DROP TABLE IF EXISTS campers;

CREATE TABLE campers (
  id SERIAL PRIMARY KEY,
  name TEXT,
  session_num INT,
  balance INT,
  concerns TEXT,
  is_deleted INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
