CREATE TABLE IF NOT EXISTS chains (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    short_name VARCHAR(20) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tokens (
    id BIGSERIAL PRIMARY KEY,
    chain_id INT REFERENCES chains(id),
    address VARCHAR(200) NOT NULL,
    symbol VARCHAR(50),
    name VARCHAR(200),
    first_seen_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deployer_wallet VARCHAR(200),
    pumpfun_id VARCHAR(200),
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    last_updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(chain_id, address)
);

CREATE TABLE IF NOT EXISTS token_pairs (
    id BIGSERIAL PRIMARY KEY,
    token_id BIGINT REFERENCES tokens(id),
    dex_name VARCHAR(100),
    pair_address VARCHAR(200) UNIQUE,
    liquidity_usd NUMERIC(24,8),
    liquidity_token NUMERIC(38,8),
    is_lp_locked BOOLEAN DEFAULT FALSE,
    lp_lock_provider VARCHAR(100),
    lp_lock_until TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS token_metrics_snapshot (
    id BIGSERIAL PRIMARY KEY,
    token_id BIGINT REFERENCES tokens(id),
    timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
    price_usd NUMERIC(24,12),
    liquidity_usd NUMERIC(24,8),
    volume_5m_usd NUMERIC(24,8),
    buys_5m INT,
    sells_5m INT,
    holders_count INT,
    top_holder_pct NUMERIC(6,2),
    smart_wallet_buys INT,
    unique_buyers_5m INT
);
CREATE INDEX tms_token_ts_idx ON token_metrics_snapshot(token_id, timestamp DESC);

CREATE TABLE IF NOT EXISTS token_risk_assessments (
    id BIGSERIAL PRIMARY KEY,
    token_id BIGINT REFERENCES tokens(id),
    calculated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    risk_score INT,
    lp_locked BOOLEAN,
    lp_lock_until TIMESTAMP,
    mint_authority_enabled BOOLEAN,
    freeze_authority_enabled BOOLEAN,
    is_honeypot BOOLEAN,
    holders_count INT,
    top_holder_pct NUMERIC(6,2),
    deployer_wallet VARCHAR(200),
    deployer_known_rugs INT,
    deployer_score INT,
    anomaly_score INT,
    external_risk_score INT
);
CREATE INDEX risk_token_ts_idx ON token_risk_assessments(token_id, calculated_at DESC);

CREATE TABLE IF NOT EXISTS token_momentum_assessments (
    id BIGSERIAL PRIMARY KEY,
    token_id BIGINT REFERENCES tokens(id),
    calculated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    momentum_score INT,
    price_change_pct NUMERIC(12,4),
    liquidity_change_pct NUMERIC(12,4),
    buys_5m INT,
    sells_5m INT,
    holder_growth_pct NUMERIC(12,4),
    smart_wallet_buys INT,
    social_burst_pct NUMERIC(12,4)
);

CREATE TABLE IF NOT EXISTS wallets (
    id BIGSERIAL PRIMARY KEY,
    chain_id INT REFERENCES chains(id),
    address VARCHAR(200),
    smart_score INT,
    realized_pnl_meme NUMERIC(24,8),
    total_trades INT,
    last_seen_at TIMESTAMP DEFAULT NOW(),
    flagged_rugger BOOLEAN DEFAULT FALSE,
    UNIQUE(chain_id, address)
);

CREATE TABLE IF NOT EXISTS wallet_trades (
    id BIGSERIAL PRIMARY KEY,
    wallet_id BIGINT REFERENCES wallets(id),
    token_id BIGINT REFERENCES tokens(id),
    tx_hash VARCHAR(200),
    direction VARCHAR(10),
    amount_token NUMERIC(38,8),
    amount_usd NUMERIC(24,8),
    price_usd NUMERIC(24,12),
    timestamp TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS social_stats (
    id BIGSERIAL PRIMARY KEY,
    token_id BIGINT REFERENCES tokens(id),
    timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
    twitter_mentions INT,
    telegram_members INT,
    discord_members INT,
    pumpfun_comments INT,
    extra JSONB
);

CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(200),
    password_hash VARCHAR(300),
    telegram_handle VARCHAR(200),
    discord_id VARCHAR(200),
    plan VARCHAR(50) DEFAULT 'free',
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS watchlist_items (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    token_id BIGINT REFERENCES tokens(id),
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, token_id)
);

CREATE TABLE IF NOT EXISTS alert_rules (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    name VARCHAR(200),
    is_enabled BOOLEAN DEFAULT TRUE,
    conditions JSONB,
    channels JSONB,
    last_triggered_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS alert_events (
    id BIGSERIAL PRIMARY KEY,
    alert_rule_id BIGINT REFERENCES alert_rules(id),
    token_id BIGINT REFERENCES tokens(id),
    created_at TIMESTAMP DEFAULT NOW(),
    sent BOOLEAN DEFAULT FALSE
);
