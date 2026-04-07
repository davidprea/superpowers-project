CREATE TABLE email_log (
  id SERIAL PRIMARY KEY,
  subject VARCHAR(500) NOT NULL,
  body TEXT NOT NULL,
  tag_ids JSONB,
  recipient_count INTEGER NOT NULL DEFAULT 0,
  sent_at TIMESTAMP DEFAULT NOW()
);
