-- Créer la base de données
CREATE DATABASE IF NOT EXISTS risk_it;
USE risk_it;

-- Table users
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table admins
CREATE TABLE IF NOT EXISTS admins (
    user_id INT,
    PRIMARY KEY (user_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Table provider_accounts
CREATE TABLE IF NOT EXISTS provider_accounts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    platform_name VARCHAR(255) NOT NULL,
    credentials JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Table monitored_targets ( exple: chanels on a telegram account)
CREATE TABLE IF NOT EXISTS monitored_targets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_provider_account INT,
    target_name VARCHAR(255) NOT NULL,
    others JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_provider_account) REFERENCES provider_accounts(id) ON DELETE CASCADE
);

-- Table signals
CREATE TABLE IF NOT EXISTS signals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_monitored_target INT,
    pair VARCHAR(20), -- pair de trading récupérée
    tp FLOAT NOT NULL,
    sl FLOAT NOT NULL,
    entry_upper_born FLOAT DEFAULT NULL,
    entry_lower_born FLOAT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    parent INT DEFAULT NULL, -- champ parent nullable
    FOREIGN KEY (id_monitored_target) REFERENCES monitored_targets(id) ON DELETE CASCADE,
    FOREIGN KEY (parent) REFERENCES signals(id) ON DELETE CASCADE -- référence à l'id du parent dans la même table
);

-- Table trades
CREATE TABLE IF NOT EXISTS trades (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_trader_client INT,
    id_signal INT,
    amount_traded FLOAT NOT NULL,
    marge FLOAT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_trader_client) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (id_signal) REFERENCES signals(id) ON DELETE CASCADE
);

-- Table trader_agents
CREATE TABLE IF NOT EXISTS trader_agents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_user INT,
    agent_name VARCHAR(255) NOT NULL,
    credentials JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_user) REFERENCES users(id) ON DELETE CASCADE
);