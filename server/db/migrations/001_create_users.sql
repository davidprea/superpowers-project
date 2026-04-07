CREATE TYPE user_role AS ENUM ('observer', 'member', 'admin');
CREATE TYPE member_status AS ENUM ('pending', 'approved', 'rejected');

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role user_role NOT NULL DEFAULT 'observer',
  member_status member_status,
  can_blog BOOLEAN DEFAULT FALSE,
  school_name VARCHAR(255),
  school_url VARCHAR(512),
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
