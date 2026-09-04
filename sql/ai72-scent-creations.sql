CREATE TABLE IF NOT EXISTS ai72_scent_creations (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  share_code VARCHAR(24) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  client_id VARCHAR(64) NULL,
  device_mac VARCHAR(32) NULL,
  user_input VARCHAR(500) NOT NULL,
  direction VARCHAR(20) NOT NULL DEFAULT 'natural',
  title VARCHAR(255) NOT NULL,
  scent_story TEXT NOT NULL,
  formula_json JSON NOT NULL,
  prescription_json JSON NULL,
  understanding_json JSON NULL,
  model VARCHAR(64) NULL,
  generation_source VARCHAR(32) NOT NULL DEFAULT 'openai',
  feedback VARCHAR(32) NULL,
  feedback_at DATETIME NULL,
  share_count INT UNSIGNED NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_ai72_share_code (share_code),
  KEY idx_ai72_client_created (client_id, created_at),
  KEY idx_ai72_feedback (feedback),
  KEY idx_ai72_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS ai72_scent_feedback (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  creation_id BIGINT UNSIGNED NOT NULL,
  client_id VARCHAR(64) NOT NULL,
  feedback VARCHAR(32) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_ai72_creation_client (creation_id, client_id),
  KEY idx_ai72_feedback_created (feedback, created_at),
  CONSTRAINT fk_ai72_feedback_creation FOREIGN KEY (creation_id)
    REFERENCES ai72_scent_creations (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
