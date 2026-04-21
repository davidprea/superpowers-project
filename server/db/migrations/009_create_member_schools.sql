CREATE TABLE member_schools (
  id SERIAL PRIMARY KEY,
  school_name VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  logo_url VARCHAR(512) NOT NULL,
  link VARCHAR(512),
  description TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
