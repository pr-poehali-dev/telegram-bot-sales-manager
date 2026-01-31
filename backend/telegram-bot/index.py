import json
import os
import psycopg2
from datetime import datetime

def handler(event: dict, context) -> dict:
    """Телеграм-бот ЛКСМ РФ Иркутск для приёма обращений граждан"""
    
    method = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method == 'POST':
        try:
            body = json.loads(event.get('body', '{}'))
            
            if 'message' in body:
                message = body['message']
                chat_id = message['chat']['id']
                user_id = message['from']['id']
                username = message['from'].get('username', '')
                first_name = message['from'].get('first_name', '')
                last_name = message['from'].get('last_name', '')
                text = message.get('text', '')
                
                if text.startswith('/start'):
                    send_message(chat_id, 
                        "Добро пожаловать в бот ЛКСМ РФ Иркутск! 🚩\n\n"
                        "Я помогу вам отправить обращение в местное отделение.\n\n"
                        "Доступные команды:\n"
                        "/appeal - Отправить обращение\n"
                        "/status - Проверить статус обращения\n"
                        "/help - Помощь"
                    )
                
                elif text.startswith('/appeal'):
                    send_message(chat_id,
                        "Пожалуйста, напишите ваше обращение в следующем сообщении.\n\n"
                        "Укажите:\n"
                        "• Тему обращения\n"
                        "• Подробное описание\n"
                        "• Контактные данные (если необходимо)"
                    )
                    save_user_state(user_id, 'waiting_appeal')
                
                elif text.startswith('/status'):
                    appeals = get_user_appeals(user_id)
                    if appeals:
                        response = "Ваши обращения:\n\n"
                        for appeal in appeals:
                            response += f"#{appeal['id']} - {appeal['status']}\n"
                            response += f"Дата: {appeal['created_at']}\n"
                            response += f"Текст: {appeal['text'][:50]}...\n\n"
                    else:
                        response = "У вас пока нет обращений."
                    send_message(chat_id, response)
                
                elif text.startswith('/help'):
                    send_message(chat_id,
                        "Помощь по боту ЛКСМ РФ Иркутск\n\n"
                        "/appeal - Отправить новое обращение\n"
                        "/status - Проверить статус ваших обращений\n"
                        "/help - Показать эту справку\n\n"
                        "По всем вопросам обращайтесь в местное отделение."
                    )
                
                else:
                    user_state = get_user_state(user_id)
                    if user_state == 'waiting_appeal':
                        save_appeal(user_id, username, first_name, last_name, text)
                        send_message(chat_id,
                            "Ваше обращение принято! ✅\n\n"
                            "Номер обращения будет отправлен вам в ближайшее время.\n"
                            "Вы можете проверить статус командой /status"
                        )
                        clear_user_state(user_id)
                    else:
                        send_message(chat_id,
                            "Я вас не понял. Используйте /help для списка команд."
                        )
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'ok': True}),
                'isBase64Encoded': False
            }
            
        except Exception as e:
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': str(e)}),
                'isBase64Encoded': False
            }
    
    return {
        'statusCode': 405,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'error': 'Method not allowed'}),
        'isBase64Encoded': False
    }


def get_db_connection():
    """Получить подключение к базе данных"""
    return psycopg2.connect(os.environ['DATABASE_URL'])


def send_message(chat_id: int, text: str):
    """Отправить сообщение пользователю через Telegram API"""
    import urllib.request
    import urllib.parse
    
    token = os.environ['TELEGRAM_BOT_TOKEN']
    url = f'https://api.telegram.org/bot{token}/sendMessage'
    
    data = {
        'chat_id': chat_id,
        'text': text,
        'parse_mode': 'HTML'
    }
    
    req = urllib.request.Request(
        url,
        data=json.dumps(data).encode('utf-8'),
        headers={'Content-Type': 'application/json'}
    )
    
    try:
        urllib.request.urlopen(req)
    except Exception as e:
        print(f'Error sending message: {e}')


def save_user_state(user_id: int, state: str):
    """Сохранить состояние пользователя"""
    conn = get_db_connection()
    cur = conn.cursor()
    
    cur.execute("""
        INSERT INTO lksm_user_states (user_id, state, updated_at)
        VALUES (%s, %s, NOW())
        ON CONFLICT (user_id) 
        DO UPDATE SET state = EXCLUDED.state, updated_at = NOW()
    """, (user_id, state))
    
    conn.commit()
    cur.close()
    conn.close()


def get_user_state(user_id: int) -> str:
    """Получить состояние пользователя"""
    conn = get_db_connection()
    cur = conn.cursor()
    
    cur.execute("""
        SELECT state FROM lksm_user_states WHERE user_id = %s
    """, (user_id,))
    
    result = cur.fetchone()
    cur.close()
    conn.close()
    
    return result[0] if result else None


def clear_user_state(user_id: int):
    """Очистить состояние пользователя"""
    conn = get_db_connection()
    cur = conn.cursor()
    
    cur.execute("""
        DELETE FROM lksm_user_states WHERE user_id = %s
    """, (user_id,))
    
    conn.commit()
    cur.close()
    conn.close()


def save_appeal(user_id: int, username: str, first_name: str, last_name: str, text: str):
    """Сохранить обращение в базу данных"""
    conn = get_db_connection()
    cur = conn.cursor()
    
    cur.execute("""
        INSERT INTO lksm_appeals (user_id, username, first_name, last_name, text, status, created_at)
        VALUES (%s, %s, %s, %s, %s, %s, NOW())
    """, (user_id, username, first_name, last_name, text, 'new'))
    
    conn.commit()
    cur.close()
    conn.close()


def get_user_appeals(user_id: int) -> list:
    """Получить обращения пользователя"""
    conn = get_db_connection()
    cur = conn.cursor()
    
    cur.execute("""
        SELECT id, text, status, created_at
        FROM lksm_appeals
        WHERE user_id = %s
        ORDER BY created_at DESC
        LIMIT 10
    """, (user_id,))
    
    appeals = []
    for row in cur.fetchall():
        appeals.append({
            'id': row[0],
            'text': row[1],
            'status': row[2],
            'created_at': row[3].strftime('%d.%m.%Y %H:%M')
        })
    
    cur.close()
    conn.close()
    
    return appeals
