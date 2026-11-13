
-- =========================================
-- AZMA AI DATABASE SCHEMA
-- PostgreSQL
-- =========================================

-- 1. USERS
CREATE TABLE IF NOT EXISTS users (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'user'
        CHECK (role IN ('user', 'admin')),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. CONVERSATIONS
CREATE TABLE IF NOT EXISTS conversations (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL DEFAULT 'New Conversation',
    is_archived BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. MESSAGES
CREATE TABLE IF NOT EXISTS messages (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    conversation_id BIGINT NOT NULL
        REFERENCES conversations(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL
        CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. KNOWLEDGE BASE
CREATE TABLE IF NOT EXISTS knowledge_base (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(100),
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    created_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. SUPPORT REQUESTS
CREATE TABLE IF NOT EXISTS support_requests (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'in_progress', 'resolved')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =========================================
-- INDEXES
-- =========================================

CREATE INDEX IF NOT EXISTS idx_conversations_user_id
ON conversations(user_id);

CREATE INDEX IF NOT EXISTS idx_messages_conversation_id
ON messages(conversation_id);

CREATE INDEX IF NOT EXISTS idx_knowledge_base_category
ON knowledge_base(category);

CREATE INDEX IF NOT EXISTS idx_support_requests_status
ON support_requests(status);

CREATE INDEX IF NOT EXISTS idx_users_email
ON users(email);
