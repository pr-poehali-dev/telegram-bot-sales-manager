import json
import os
import psycopg2
from datetime import datetime

def handler(event: dict, context) -> dict:
    """Telegram бот для приема обращений в ЛКСМ РФ Иркутск"""
    
    method = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': ''
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    try:
        update = json.loads(event.get('body', '{}'))
        
        if 'message' not in update:
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json'},
                'body': json.dumps({'ok': True})
            }
        
        message = update['message']
        chat_id = message['chat']['id']
        user = message['from']
        text = message.get('text', '')
        
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cursor = conn.cursor()
        
        if text == '/start':
            response_text = (
                "🚩 Добро пожаловать в бот ЛКСМ РФ Иркутск!\n\n"
                "Этот бот создан для приема обращений граждан.\n\n"
                "Доступные команды:\n"
                "/appeal - Подать обращение\n"
                "/status - Проверить статус обращения\n"
                "/info - Информация о ЛКСМ РФ\n"
                "/contact - Контакты отделения"
            )
            
            cursor.execute(
                f"INSERT INTO bot_users (telegram_user_id, username, first_name, last_name) "
                f"VALUES ({user['id']}, '{user.get('username', '')}', '{user.get('first_name', '')}', '{user.get('last_name', '')}') "
                f"ON CONFLICT (telegram_user_id) DO NOTHING"
            )
            conn.commit()
            
        elif text == '/appeal':
            response_text = (
                "📝 Для подачи обращения отправьте сообщение в следующем формате:\n\n"
                "ФИО: Ваше полное имя\n"
                "Телефон: Ваш номер телефона\n"
                "Тип обращения: (жалоба/предложение/вопрос)\n"
                "Текст обращения: Подробное описание вашего обращения\n\n"
                "Пример:\n"
                "ФИО: Иванов Иван Иванович\n"
                "Телефон: +79001234567\n"
                "Тип обращения: вопрос\n"
                "Текст обращения: Как вступить в ЛКСМ?"
            )
            
        elif text == '/status':
            cursor.execute(
                f"SELECT id, appeal_type, status, created_at FROM appeals "
                f"WHERE telegram_user_id = {chat_id} ORDER BY created_at DESC LIMIT 5"
            )
            appeals = cursor.fetchall()
            
            if appeals:
                response_text = "📋 Ваши последние обращения:\n\n"
                for appeal in appeals:
                    appeal_id, appeal_type, status, created = appeal
                    status_emoji = '🆕' if status == 'new' else '✅' if status == 'processed' else '⏳'
                    response_text += f"{status_emoji} #{appeal_id} - {appeal_type} ({status})\nДата: {created}\n\n"
            else:
                response_text = "У вас пока нет обращений."
                
        elif text == '/info':
            response_text = (
                "ℹ️ ЛКСМ РФ - Ленинский коммунистический союз молодёжи Российской Федерации\n\n"
                "Иркутское местное отделение\n\n"
                "Мы работаем над:\n"
                "• Защитой прав молодёжи\n"
                "• Организацией культурных и спортивных мероприятий\n"
                "• Образовательными программами\n"
                "• Социальной поддержкой"
            )
            
        elif text == '/contact':
            response_text = (
                "📞 Контакты ЛКСМ РФ Иркутск:\n\n"
                "📍 Адрес: г. Иркутск\n"
                "📧 Email: irkutsk@lksm.org\n"
                "🌐 Сайт: lksm.org\n"
                "💬 Telegram: @lksm_irkutsk"
            )
            
        elif 'ФИО:' in text and 'Телефон:' in text:
            lines = text.split('\n')
            full_name = ''
            phone = ''
            appeal_type = 'общее'
            appeal_text = ''
            
            for line in lines:
                if line.startswith('ФИО:'):
                    full_name = line.replace('ФИО:', '').strip()
                elif line.startswith('Телефон:'):
                    phone = line.replace('Телефон:', '').strip()
                elif line.startswith('Тип обращения:'):
                    appeal_type = line.replace('Тип обращения:', '').strip()
                elif line.startswith('Текст обращения:'):
                    appeal_text = line.replace('Текст обращения:', '').strip()
            
            cursor.execute(
                f"INSERT INTO appeals (telegram_user_id, username, full_name, phone, appeal_type, message) "
                f"VALUES ({chat_id}, '{user.get('username', '')}', '{full_name}', '{phone}', '{appeal_type}', '{appeal_text}') "
                f"RETURNING id"
            )
            appeal_id = cursor.fetchone()[0]
            conn.commit()
            
            response_text = (
                f"✅ Ваше обращение #{appeal_id} успешно принято!\n\n"
                f"Мы рассмотрим его в ближайшее время и свяжемся с вами.\n\n"
                f"Проверить статус можно командой /status"
            )
        else:
            response_text = (
                "Извините, я не понял вашу команду.\n\n"
                "Используйте /start для просмотра доступных команд."
            )
        
        cursor.close()
        conn.close()
        
        send_telegram_message(chat_id, response_text)
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'ok': True})
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }

def send_telegram_message(chat_id: int, text: str):
    """Отправка сообщения пользователю через Telegram Bot API"""
    import urllib.request
    import urllib.parse
    
    token = os.environ['TELEGRAM_BOT_TOKEN']
    url = f'https://api.telegram.org/bot{token}/sendMessage'
    
    data = urllib.parse.urlencode({
        'chat_id': chat_id,
        'text': text,
        'parse_mode': 'HTML'
    }).encode()
    
    req = urllib.request.Request(url, data=data)
    urllib.request.urlopen(req)
