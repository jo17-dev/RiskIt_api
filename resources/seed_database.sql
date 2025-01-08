-- Ajouter des utilisateurs
INSERT INTO users (name, email, password)
VALUES 
('Joel Bertrand', 'joel"gmail.com', 'password123'),
('Bob Martin', 'bob@example.com', 'password456'),
('Charlie Durand', 'charlie@example.com', 'password789');

-- Ajouter des administrateurs
INSERT INTO admins (user_id)
VALUES 
(1),  -- Alice est un administrateur
(2);  -- Bob est aussi un administrateur

-- Ajouter des comptes fournisseurs
INSERT INTO provider_accounts (user_id, platform_name, credentials)
VALUES 
(1, 'telegram', '{"api_id": "pleiiiiiiiiin de choses", "api_hash": "dammmmmmmmnn api hash"}'),
(2, 'instagram', '{"api_key": "ghi789", "secret": "jkl012"}');

-- Ajouter des cibles surveillées
INSERT INTO monitored_targets (id_provider_account, target_name, others)
VALUES 
(1, 'Crypto Space VIP', '{"type": "chanel", "signal_type": "crypto"}'),
(1, 'TFXC SIGNALS', '{"type": "chanel", "signal_type": "forex"}'),
(2, 'professeur signales hahah', '{"type": "direct-messages", "signal_type": "crypto"}');

-- Ajouter des signaux
INSERT INTO signals (id_monitored_target, pair,tp, sl, entry_upper_born, entry_lower_born)
VALUES 
(1, 'ZEN/USDT' ,1.20, 1.10, 1.25, 1.05),  -- Signal pour Crypto Space VIP
(2, 'FCFA/USD' ,50.00, 45.00, 55.00, 40.00);  -- Signal provenant de 'professeur signals hahaha'

-- Ajouter des trades
INSERT INTO trades (id_trader_client, id_signal, amount_traded, marge)
VALUES 
(1, 1, 1000.00, 50.00),  -- Alice, Signal pour Channel1
(2, 2, 2000.00, 150.00);  -- Bob, Signal pour Channel2

-- Ajouter des agents de traders
INSERT INTO trader_agents (id_user, agent_name, credentials)
VALUES 
(1, 'AgentA', '{"api_key": "agent123", "secret": "agent456"}'),
(2, 'AgentB', '{"api_key": "agent789", "secret": "agent012"}');
