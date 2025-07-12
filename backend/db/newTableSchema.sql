-- Table: public.admin_logs

-- DROP TABLE IF EXISTS public.admin_logs;

CREATE TABLE IF NOT EXISTS public.admin_logs
(
    log_id integer NOT NULL DEFAULT nextval('admin_logs_log_id_seq'::regclass),
    admin_id integer,
    action_type character varying(50) COLLATE pg_catalog."default",
    target_user_id integer,
    description text COLLATE pg_catalog."default",
    "timestamp" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT admin_logs_pkey PRIMARY KEY (log_id),
    CONSTRAINT admin_logs_admin_id_fkey FOREIGN KEY (admin_id)
        REFERENCES public.users (user_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT admin_logs_target_user_id_fkey FOREIGN KEY (target_user_id)
        REFERENCES public.users (user_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.admin_logs
    OWNER to postgres;

-- Table: public.feedback

-- DROP TABLE IF EXISTS public.feedback;

CREATE TABLE IF NOT EXISTS public.feedback
(
    feedback_id integer NOT NULL DEFAULT nextval('feedback_feedback_id_seq'::regclass),
    swap_id integer,
    from_user_id integer,
    to_user_id integer,
    rating integer,
    comment text COLLATE pg_catalog."default",
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT feedback_pkey PRIMARY KEY (feedback_id),
    CONSTRAINT feedback_from_user_id_fkey FOREIGN KEY (from_user_id)
        REFERENCES public.users (user_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE SET NULL,
    CONSTRAINT feedback_to_user_id_fkey FOREIGN KEY (to_user_id)
        REFERENCES public.users (user_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE SET NULL,
    CONSTRAINT feedback_rating_check CHECK (rating >= 1 AND rating <= 5)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.feedback
    OWNER to postgres;

-- Table: public.skills

-- DROP TABLE IF EXISTS public.skills;

CREATE TABLE IF NOT EXISTS public.skills
(
    skill_id integer NOT NULL DEFAULT nextval('skills_skill_id_seq'::regclass),
    skill_name character varying(100) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT skills_pkey PRIMARY KEY (skill_id),
    CONSTRAINT skills_skill_name_key UNIQUE (skill_name)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.skills
    OWNER to postgres;

-- Table: public.swap_requests

-- DROP TABLE IF EXISTS public.swap_requests;

CREATE TABLE IF NOT EXISTS public.swap_requests
(
    swap_id integer NOT NULL DEFAULT nextval('swap_requests_swap_id_seq'::regclass),
    creator_id integer,
    receiver_id integer,
    offered_skill_id integer,
    requested_skill_id integer,
    message text COLLATE pg_catalog."default",
    status character varying(20) COLLATE pg_catalog."default" DEFAULT 'pending'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT swap_requests_pkey PRIMARY KEY (swap_id),
    CONSTRAINT swap_requests_creator_id_fkey FOREIGN KEY (creator_id)
        REFERENCES public.users (user_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT swap_requests_offered_skill_id_fkey FOREIGN KEY (offered_skill_id)
        REFERENCES public.skills (skill_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE SET NULL,
    CONSTRAINT swap_requests_receiver_id_fkey FOREIGN KEY (receiver_id)
        REFERENCES public.users (user_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT swap_requests_requested_skill_id_fkey FOREIGN KEY (requested_skill_id)
        REFERENCES public.skills (skill_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE SET NULL,
    CONSTRAINT swap_requests_status_check CHECK (status::text = ANY (ARRAY['pending'::character varying, 'accepted'::character varying, 'rejected'::character varying]::text[]))
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.swap_requests
    OWNER to postgres;

-- Table: public.user_skills

-- DROP TABLE IF EXISTS public.user_skills;

CREATE TABLE IF NOT EXISTS public.user_skills
(
    user_skill_id integer NOT NULL DEFAULT nextval('user_skills_user_skill_id_seq'::regclass),
    user_id integer,
    skill_id integer,
    skill_type character varying(10) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT user_skills_pkey PRIMARY KEY (user_skill_id),
    CONSTRAINT user_skills_skill_id_fkey FOREIGN KEY (skill_id)
        REFERENCES public.skills (skill_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT user_skills_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public.users (user_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT user_skills_skill_type_check CHECK (skill_type::text = ANY (ARRAY['offered'::character varying, 'wanted'::character varying]::text[]))
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.user_skills
    OWNER to postgres;

-- Table: public.users

-- DROP TABLE IF EXISTS public.users;

CREATE TABLE IF NOT EXISTS public.users
(
    user_id integer NOT NULL DEFAULT nextval('users_user_id_seq'::regclass),
    name character varying(100) COLLATE pg_catalog."default" NOT NULL,
    email character varying(100) COLLATE pg_catalog."default" NOT NULL,
    password_hash text COLLATE pg_catalog."default" NOT NULL,
    location character varying(100) COLLATE pg_catalog."default",
    profile_photo_url text COLLATE pg_catalog."default",
    availability text COLLATE pg_catalog."default",
    public_profile boolean DEFAULT false,
    role character varying(10) COLLATE pg_catalog."default" DEFAULT 'user'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    profile_completed boolean DEFAULT false,
    CONSTRAINT users_pkey PRIMARY KEY (user_id),
    CONSTRAINT users_email_key UNIQUE (email)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.users
    OWNER to postgres;