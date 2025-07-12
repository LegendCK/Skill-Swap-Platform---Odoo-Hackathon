-- =======================
-- Users Table
-- =======================
CREATE TABLE IF NOT EXISTS public.users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    location VARCHAR(100),
    profile_photo_url TEXT,
    availability TEXT,
    public_profile BOOLEAN DEFAULT false,
    role VARCHAR(10) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    profile_completed BOOLEAN DEFAULT false
);

-- =======================
-- Skills Table
-- =======================
CREATE TABLE IF NOT EXISTS public.skills (
    skill_id SERIAL PRIMARY KEY,
    skill_name VARCHAR(100) NOT NULL UNIQUE
);

-- =======================
-- User Skills Table
-- =======================
CREATE TABLE IF NOT EXISTS public.user_skills (
    user_skill_id SERIAL PRIMARY KEY,
    user_id INTEGER,
    skill_id INTEGER,
    skill_type VARCHAR(10) NOT NULL,
    CONSTRAINT user_skills_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public.users(user_id)
        ON DELETE CASCADE,
    CONSTRAINT user_skills_skill_id_fkey FOREIGN KEY (skill_id)
        REFERENCES public.skills(skill_id)
        ON DELETE CASCADE,
    CONSTRAINT user_skills_skill_type_check CHECK (skill_type IN ('offered', 'wanted'))
);

-- =======================
-- Swap Requests Table
-- =======================
CREATE TABLE IF NOT EXISTS public.swap_requests (
    swap_id SERIAL PRIMARY KEY,
    creator_id INTEGER,
    receiver_id INTEGER,
    offered_skill_id INTEGER,
    requested_skill_id INTEGER,
    message TEXT,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT swap_requests_creator_id_fkey FOREIGN KEY (creator_id)
        REFERENCES public.users(user_id)
        ON DELETE CASCADE,
    CONSTRAINT swap_requests_receiver_id_fkey FOREIGN KEY (receiver_id)
        REFERENCES public.users(user_id)
        ON DELETE CASCADE,
    CONSTRAINT swap_requests_offered_skill_id_fkey FOREIGN KEY (offered_skill_id)
        REFERENCES public.skills(skill_id)
        ON DELETE SET NULL,
    CONSTRAINT swap_requests_requested_skill_id_fkey FOREIGN KEY (requested_skill_id)
        REFERENCES public.skills(skill_id)
        ON DELETE SET NULL,
    CONSTRAINT swap_requests_status_check CHECK (status IN ('pending', 'accepted', 'rejected'))
);

-- =======================
-- Feedback Table
-- =======================
CREATE TABLE IF NOT EXISTS public.feedback (
    feedback_id SERIAL PRIMARY KEY,
    swap_id INTEGER,
    from_user_id INTEGER,
    to_user_id INTEGER,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT feedback_from_user_id_fkey FOREIGN KEY (from_user_id)
        REFERENCES public.users(user_id)
        ON DELETE SET NULL,
    CONSTRAINT feedback_to_user_id_fkey FOREIGN KEY (to_user_id)
        REFERENCES public.users(user_id)
        ON DELETE SET NULL
);

-- =======================
-- Admin Logs Table
-- =======================
CREATE TABLE IF NOT EXISTS public.admin_logs (
    log_id SERIAL PRIMARY KEY,
    admin_id INTEGER,
    action_type VARCHAR(50),
    target_user_id INTEGER,
    description TEXT,
    "timestamp" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT admin_logs_admin_id_fkey FOREIGN KEY (admin_id)
        REFERENCES public.users(user_id),
    CONSTRAINT admin_logs_target_user_id_fkey FOREIGN KEY (target_user_id)
        REFERENCES public.users(user_id)
);
