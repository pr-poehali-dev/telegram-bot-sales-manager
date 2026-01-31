-- Таблица для хранения обращений граждан в ЛКСМ РФ Иркутск
CREATE TABLE IF NOT EXISTS lksm_appeals (
    id SERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    username VARCHAR(255),
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    text TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'new',
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP,
    admin_comment TEXT
);

-- Таблица для хранения состояний пользователей (FSM)
CREATE TABLE IF NOT EXISTS lksm_user_states (
    user_id BIGINT PRIMARY KEY,
    state VARCHAR(100) NOT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Индексы для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_lksm_appeals_user_id ON lksm_appeals(user_id);
CREATE INDEX IF NOT EXISTS idx_lksm_appeals_status ON lksm_appeals(status);
CREATE INDEX IF NOT EXISTS idx_lksm_appeals_created_at ON lksm_appeals(created_at DESC);

-- Комментарии к таблицам
COMMENT ON TABLE lksm_appeals IS 'Обращения граждан в местное отделение ЛКСМ РФ Иркутск';
COMMENT ON TABLE lksm_user_states IS 'Состояния пользователей для управления диалогами';
