-- Таблица для хранения обращений граждан в ЛКСМ РФ Иркутск
CREATE TABLE IF NOT EXISTS appeals (
    id SERIAL PRIMARY KEY,
    telegram_user_id BIGINT NOT NULL,
    username VARCHAR(255),
    full_name VARCHAR(255),
    phone VARCHAR(50),
    appeal_type VARCHAR(100),
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица для хранения пользователей бота
CREATE TABLE IF NOT EXISTS bot_users (
    id SERIAL PRIMARY KEY,
    telegram_user_id BIGINT UNIQUE NOT NULL,
    username VARCHAR(255),
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    phone VARCHAR(50),
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_member BOOLEAN DEFAULT FALSE
);

-- Индексы для оптимизации поиска
CREATE INDEX IF NOT EXISTS idx_appeals_telegram_user_id ON appeals(telegram_user_id);
CREATE INDEX IF NOT EXISTS idx_appeals_status ON appeals(status);
CREATE INDEX IF NOT EXISTS idx_appeals_created_at ON appeals(created_at);
CREATE INDEX IF NOT EXISTS idx_bot_users_telegram_user_id ON bot_users(telegram_user_id);