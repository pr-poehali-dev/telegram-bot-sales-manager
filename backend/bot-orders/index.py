import json
import os
import psycopg2
from datetime import datetime

def handler(event: dict, context) -> dict:
    """Telegram bot webhook + API управления заказами"""
    method = event.get('httpMethod', 'POST')
    path = event.get('path', '/')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': ''
        }
    
    try:
        if method == 'GET':
            return get_orders()
        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            if 'message' in body or 'callback_query' in body:
                return handle_telegram_webhook(body)
            return response(400, {'error': 'Invalid request'})
        elif method == 'PUT':
            body = json.loads(event.get('body', '{}'))
            return update_order_status(body)
        elif method == 'DELETE':
            body = json.loads(event.get('body', '{}'))
            return delete_order(body)
        
        return response(405, {'error': 'Method not allowed'})
    except Exception as e:
        print(f"Error: {str(e)}")
        return response(500, {'error': str(e)})


def handle_telegram_webhook(body: dict) -> dict:
    """Обработка Telegram webhook"""
    if 'message' in body:
        return handle_message(body['message'])
    elif 'callback_query' in body:
        return handle_callback(body['callback_query'])
    return response(200, {'ok': True})


def handle_message(message: dict) -> dict:
    """Обработка текстовых сообщений"""
    chat_id = message['chat']['id']
    text = message.get('text', '')
    user = message['from']
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    cur.execute("""
        INSERT INTO bot_users (telegram_user_id, telegram_username, first_name, last_name, last_activity)
        VALUES (%s, %s, %s, %s, %s)
        ON CONFLICT (telegram_user_id) 
        DO UPDATE SET last_activity = %s
    """, (
        user['id'], 
        user.get('username'),
        user.get('first_name'),
        user.get('last_name'),
        datetime.now(),
        datetime.now()
    ))
    conn.commit()
    cur.close()
    conn.close()
    
    if text == '/start':
        send_start_message(chat_id)
    
    return response(200, {'ok': True})


def handle_callback(callback: dict) -> dict:
    """Обработка callback кнопок"""
    chat_id = callback['message']['chat']['id']
    data = callback['data']
    user = callback['from']
    
    if data == 'show_services':
        send_services(chat_id)
    elif data == 'show_portfolio':
        send_portfolio(chat_id)
    elif data == 'show_prices':
        send_prices(chat_id)
    elif data == 'show_reviews':
        send_reviews(chat_id)
    elif data == 'show_promo':
        send_promo(chat_id)
    elif data == 'back_to_menu':
        send_start_message(chat_id)
    elif data.startswith('order_'):
        start_order(chat_id, data.replace('order_', ''), user)
    
    answer_callback(callback['id'])
    return response(200, {'ok': True})


def send_start_message(chat_id: int):
    """Стартовое сообщение"""
    text = """🎨 <b>Привет! Мы создаём крутой дизайн</b>

Разрабатываем карточки для маркетплейсов, сайты, аватарки и многое другое!

🎁 <b>Скидка 10% на первый заказ</b>"""
    
    keyboard = {
        'inline_keyboard': [
            [{'text': '✨ Услуги', 'callback_data': 'show_services'}],
            [{'text': '💼 Портфолио', 'callback_data': 'show_portfolio'}, {'text': '💰 Цены', 'callback_data': 'show_prices'}],
            [{'text': '⭐ Отзывы', 'callback_data': 'show_reviews'}, {'text': '🎁 Акция', 'callback_data': 'show_promo'}]
        ]
    }
    
    send_message(chat_id, text, keyboard)


def send_services(chat_id: int):
    """Меню услуг"""
    text = """<b>📦 Выберите услугу:</b>

<b>Карточки товара:</b>
🎨 Дизайн карточки
✍️ Тексты для карточки
⭐ A+ контент / EBC
🎁 Пакет "Под ключ"

<b>Сайты:</b>
🚀 Лендинг
🛒 Интернет-магазин

<b>Brand Identity:</b>
👤 Аватарки
🎯 Логотип"""
    
    keyboard = {
        'inline_keyboard': [
            [{'text': '🎨 Дизайн карточки', 'callback_data': 'order_card_design'}],
            [{'text': '✍️ Тексты для карточки', 'callback_data': 'order_card_text'}],
            [{'text': '⭐ A+ контент', 'callback_data': 'order_aplus'}],
            [{'text': '🎁 Пакет под ключ', 'callback_data': 'order_full_package'}],
            [{'text': '🚀 Лендинг', 'callback_data': 'order_landing'}],
            [{'text': '🛒 Интернет-магазин', 'callback_data': 'order_shop'}],
            [{'text': '👤 Аватарки', 'callback_data': 'order_avatar'}],
            [{'text': '🎯 Логотип', 'callback_data': 'order_logo'}],
            [{'text': '« Назад', 'callback_data': 'back_to_menu'}]
        ]
    }
    
    send_message(chat_id, text, keyboard)


def send_portfolio(chat_id: int):
    """Портфолио"""
    text = """<b>📊 Наши кейсы</b>

<b>Карточка чайника Redmond</b>
✅ +180% просмотров
Было: 50/день → Стало: 140/день

<b>Лендинг для косметики</b>
✅ +65% конверсия
Было: 2.3% → Стало: 3.8%

<b>A+ контент для кроссовок</b>
✅ +220% продаж
Было: 15/неделя → Стало: 48/неделя"""
    
    keyboard = {
        'inline_keyboard': [
            [{'text': '🎨 Заказать', 'callback_data': 'show_services'}],
            [{'text': '« Назад', 'callback_data': 'back_to_menu'}]
        ]
    }
    
    send_message(chat_id, text, keyboard)


def send_prices(chat_id: int):
    """Тарифы"""
    text = """<b>💰 Тарифы</b>

<b>Базовый - 5 000 ₽</b>
• 1 вариант
• 3 правки
• 5 дней

<b>Про - 12 000 ₽</b> ⭐
• 3 варианта
• 5 правок
• 3 дня
• A+ контент

<b>Всё включено - 25 000 ₽</b>
• 5 вариантов
• Безлимит правок
• 2 дня
• Аудит конкурентов"""
    
    keyboard = {
        'inline_keyboard': [
            [{'text': '🎨 Заказать', 'callback_data': 'show_services'}],
            [{'text': '« Назад', 'callback_data': 'back_to_menu'}]
        ]
    }
    
    send_message(chat_id, text, keyboard)


def send_reviews(chat_id: int):
    """Отзывы"""
    text = """<b>⭐ Отзывы клиентов</b>

⭐⭐⭐⭐⭐
"Ребята сделали невероятную карточку! Продажи выросли в 3 раза за месяц."
— Анна

⭐⭐⭐⭐⭐
"Быстро, качественно, креативно. Лендинг получился огонь! 🔥"
— Дмитрий

⭐⭐⭐⭐⭐
"A+ контент вывел наш товар в ТОП. Спасибо!"
— Екатерина"""
    
    keyboard = {
        'inline_keyboard': [
            [{'text': '🎨 Заказать', 'callback_data': 'show_services'}],
            [{'text': '« Назад', 'callback_data': 'back_to_menu'}]
        ]
    }
    
    send_message(chat_id, text, keyboard)


def send_promo(chat_id: int):
    """Акция"""
    text = """<b>🎁 Акция!</b>

<b>-10% на первый заказ</b>

При оформлении через бота получите скидку 10%!

✅ Бесплатный аудит 1 карточки
✅ Консультация дизайнера
✅ Ускоренное выполнение"""
    
    keyboard = {
        'inline_keyboard': [
            [{'text': '🎨 Оформить заказ', 'callback_data': 'show_services'}],
            [{'text': '« Назад', 'callback_data': 'back_to_menu'}]
        ]
    }
    
    send_message(chat_id, text, keyboard)


def start_order(chat_id: int, service: str, user: dict):
    """Начало заказа"""
    service_names = {
        'card_design': 'Дизайн карточки товара',
        'card_text': 'Тексты для карточки',
        'aplus': 'A+ контент / EBC',
        'full_package': 'Пакет "Под ключ"',
        'landing': 'Лендинг',
        'shop': 'Интернет-магазин',
        'avatar': 'Аватарки',
        'logo': 'Логотип'
    }
    
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("""
        INSERT INTO orders (telegram_user_id, telegram_username, service, status)
        VALUES (%s, %s, %s, 'new')
        RETURNING id
    """, (chat_id, user.get('username'), service_names.get(service, service)))
    order_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()
    
    text = f"""<b>✅ Заказ #{order_id} создан!</b>

Услуга: {service_names.get(service, service)}

Для продолжения напишите нам:
@your_manager

Или позвоните: +7 (XXX) XXX-XX-XX

Мы свяжемся с вами в течение 1 часа!"""
    
    keyboard = {
        'inline_keyboard': [
            [{'text': '« Назад к услугам', 'callback_data': 'show_services'}]
        ]
    }
    
    send_message(chat_id, text, keyboard)


def send_message(chat_id: int, text: str, keyboard: dict = None):
    """Отправка сообщения"""
    import urllib.request
    
    token = os.environ.get('TELEGRAM_BOT_TOKEN')
    url = f'https://api.telegram.org/bot{token}/sendMessage'
    
    data = {
        'chat_id': chat_id,
        'text': text,
        'parse_mode': 'HTML'
    }
    
    if keyboard:
        data['reply_markup'] = keyboard
    
    req = urllib.request.Request(
        url,
        data=json.dumps(data).encode('utf-8'),
        headers={'Content-Type': 'application/json'}
    )
    
    try:
        urllib.request.urlopen(req)
    except Exception as e:
        print(f"Error sending message: {str(e)}")


def answer_callback(callback_id: str):
    """Ответ на callback"""
    import urllib.request
    
    token = os.environ.get('TELEGRAM_BOT_TOKEN')
    url = f'https://api.telegram.org/bot{token}/answerCallbackQuery'
    
    data = {'callback_query_id': callback_id}
    
    req = urllib.request.Request(
        url,
        data=json.dumps(data).encode('utf-8'),
        headers={'Content-Type': 'application/json'}
    )
    
    try:
        urllib.request.urlopen(req)
    except:
        pass


def get_orders() -> dict:
    """Получение заказов для админки"""
    conn = get_db_connection()
    cur = conn.cursor()
    
    cur.execute("""
        SELECT 
            id, telegram_user_id, telegram_username, service,
            link, audience, advantages, refs, deadline, tariff,
            status, created_at, updated_at
        FROM orders
        ORDER BY created_at DESC
    """)
    
    orders = []
    for row in cur.fetchall():
        orders.append({
            'id': row[0],
            'telegram_user_id': row[1],
            'telegram_username': row[2],
            'service': row[3],
            'link': row[4],
            'audience': row[5],
            'advantages': row[6],
            'references': row[7],
            'deadline': row[8],
            'tariff': row[9],
            'status': row[10],
            'created_at': row[11].isoformat() if row[11] else None,
            'updated_at': row[12].isoformat() if row[12] else None
        })
    
    cur.close()
    conn.close()
    
    return response(200, {'orders': orders})


def update_order_status(body: dict) -> dict:
    """Обновление статуса"""
    order_id = body.get('id')
    new_status = body.get('status')
    
    if not order_id or not new_status:
        return response(400, {'error': 'Missing id or status'})
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    cur.execute("""
        UPDATE orders
        SET status = %s, updated_at = %s
        WHERE id = %s
    """, (new_status, datetime.now(), order_id))
    
    conn.commit()
    cur.close()
    conn.close()
    
    return response(200, {'success': True})


def delete_order(body: dict) -> dict:
    """Удаление заказа"""
    order_id = body.get('id')
    
    if not order_id:
        return response(400, {'error': 'Missing id'})
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    cur.execute("DELETE FROM orders WHERE id = %s", (order_id,))
    
    conn.commit()
    cur.close()
    conn.close()
    
    return response(200, {'success': True})


def get_db_connection():
    """Подключение к БД"""
    dsn = os.environ.get('DATABASE_URL')
    schema = os.environ.get('MAIN_DB_SCHEMA')
    conn = psycopg2.connect(dsn, options=f'-c search_path={schema}')
    return conn


def response(status: int, body: dict) -> dict:
    """HTTP ответ"""
    return {
        'statusCode': status,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps(body)
    }
