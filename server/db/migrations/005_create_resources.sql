CREATE TABLE resources (
  id SERIAL PRIMARY KEY,
  submitter_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  url VARCHAR(1024) NOT NULL,
  approval_status approval_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
