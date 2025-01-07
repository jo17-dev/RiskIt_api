-- Étape 1: Créer la base de données 'base_base'
CREATE DATABASE IF NOT EXISTS risk_it;

-- Étape 2: Sélectionner la base de données à utiliser
USE risk_it;

-- Étape 3: Créer la table 'trades'
CREATE TABLE IF NOT EXISTS trades (
    id INT AUTO_INCREMENT PRIMARY KEY,  -- id, entier qui s'auto-incrémente
    type ENUM('long', 'short') NOT NULL,  -- type peut être 'long' ou 'short'
    tp DOUBLE NOT NULL, -- take profit
    sl DOUBLE NOT NULL, -- stoop loss
    position_price DOUBLE NOT NULL,
    marge DOUBLE NULL -- marge
);


CREATE TABLE IF NOT EXISTS telegramAccounts (
    phoneNumber VARCHAR(14) PRIMARY KEY,
    session_string TEXT NULL, -- encrypted session string
    api_id TEXT NULL, -- encrypted api_id
    api_hash TEXT NULL, -- encrypted api_hash
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS monitoredChanels (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    idTelegramAccount VARCHAR(14),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (idTelegramAccount) REFERENCES telegramAccounts(phoneNumber)
);


-- Étape 4: Insérer 10 lignes dans la table 'trades'
INSERT INTO trades (type, tp, sl, position_price, marge) VALUES
('long', 100.1237, 99.12890, 1.2341, 41),
('short', 110.2371, 100.7891, 2.3012, 12),
('long', 120.3459, 110.3901, 3.4523, 23),
('short', 130.4593, 120.9013, 4.5234, 34),
('long', 140.5671, 130.5123, 5.6745, 45),
('short', 150.6715, 140.1235, 6.7456, 56),
('long', 160.7893, 150.7345, 7.8967, 67),
('short', 170.8937, 160.3457, 8.9678, -78),
('long', 180.9015, 170.9567, 9.0189, 89),
('short', 190.0159, 180.5679, 10.7890, 0);
