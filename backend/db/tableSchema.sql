-- Step 1: Create the database
CREATE DATABASE swap_skill;

-- Step 2: Connect to the database
\c swap_skill;

-- Step 3: Create tables

-- Users Table
CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  location VARCHAR(100),
  profile_photo_url TEXT,
  availability TEXT,
  public_profile BOOLEAN DEFAULT TRUE,
  role VARCHAR(10) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Skills Master Table
CREATE TABLE skills (
  skill_id SERIAL PRIMARY KEY,
  skill_name VARCHAR(100) UNIQUE NOT NULL
);

-- User Skills Join Table
CREATE TABLE user_skills (
  user_skill_id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
  skill_id INTEGER REFERENCES skills(skill_id) ON DELETE CASCADE,
  skill_type VARCHAR(10) NOT NULL CHECK (skill_type IN ('offered', 'wanted'))
);

-- Swap Requests Table
CREATE TABLE swap_requests (
  swap_id SERIAL PRIMARY KEY,
  creator_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
  offered_skill_id INTEGER REFERENCES skills(skill_id) ON DELETE SET NULL,
  requested_skill_id INTEGER REFERENCES skills(skill_id) ON DELETE SET NULL,
  status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'completed', 'cancelled')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Swap Applications Table
CREATE TABLE swap_applications (
  application_id SERIAL PRIMARY KEY,
  swap_id INTEGER REFERENCES swap_requests(swap_id) ON DELETE CASCADE,
  applicant_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  responded_at TIMESTAMP
);

-- Feedback Table
CREATE TABLE feedback (
  feedback_id SERIAL PRIMARY KEY,
  swap_id INTEGER REFERENCES swap_requests(swap_id) ON DELETE SET NULL,
  from_user_id INTEGER REFERENCES users(user_id),
  to_user_id INTEGER REFERENCES users(user_id),
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admin Logs Table
CREATE TABLE admin_logs (
  log_id SERIAL PRIMARY KEY,
  admin_id INTEGER REFERENCES users(user_id),
  action_type VARCHAR(50),
  target_user_id INTEGER REFERENCES users(user_id),
  description TEXT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
