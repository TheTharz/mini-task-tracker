-- Complete Database Setup - All-in-One Script
-- Task Tracker Application
-- PostgreSQL Database

-- Connect to PostgreSQL and create database (run separately if needed)
-- CREATE DATABASE taskdb;

-- Connect to the taskdb database
\c taskdb;

-- ========================================
-- SCHEMA CREATION
-- ========================================

-- Drop existing objects for clean setup
DROP TABLE IF EXISTS refresh_tokens CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TYPE IF EXISTS task_status CASCADE;

-- Create task_status enum type
CREATE TYPE task_status AS ENUM (
    'TODO',
    'IN_PROGRESS',
    'DONE'
);

-- Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    hashed_password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT uk_users_email UNIQUE (email)
);

-- Create tasks table
CREATE TABLE tasks (
    id UUID PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status task_status NOT NULL DEFAULT 'TODO',
    priority VARCHAR(50),
    due_date TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    user_id UUID NOT NULL,

    CONSTRAINT fk_tasks_user
        FOREIGN KEY (user_id)
            REFERENCES users(id)
            ON DELETE CASCADE
);

-- Create refresh_tokens table
CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY,
    token VARCHAR(500) NOT NULL UNIQUE,
    expiry_date TIMESTAMP NOT NULL,
    user_id UUID NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_refresh_tokens_user
        FOREIGN KEY (user_id)
            REFERENCES users(id)
            ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_priority ON tasks(priority);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_tasks_created_at ON tasks(created_at);
CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_token ON refresh_tokens(token);

-- ========================================
-- SAMPLE DATA INSERTION
-- ========================================

-- Insert sample users (Password: Password@123)
INSERT INTO users (id, username, email, hashed_password, created_at) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'john_doe', 'john@example.com', '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP7L9cxTO', CURRENT_TIMESTAMP),
('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'jane_smith', 'jane@example.com', '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP7L9cxTO', CURRENT_TIMESTAMP),
('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'alice_wonder', 'alice@example.com', '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP7L9cxTO', CURRENT_TIMESTAMP);

-- Insert sample tasks for john_doe
INSERT INTO tasks (id, title, description, status, priority, due_date, created_at, updated_at, user_id) VALUES
('d3eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'Complete project proposal', 'Write and submit the project proposal for Q1 2026', 'IN_PROGRESS', 'high', '2026-02-20 17:00:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
('d4eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', 'Review code changes', 'Review pull requests from team members', 'TODO', 'medium', '2026-02-18 12:00:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
('d5eebc99-9c0b-4ef8-bb6d-6bb9bd380a16', 'Setup CI/CD pipeline', 'Configure GitHub Actions for automated deployment', 'DONE', 'high', '2026-02-15 09:00:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
('d6eebc99-9c0b-4ef8-bb6d-6bb9bd380a17', 'Update documentation', 'Update API documentation with new endpoints', 'TODO', 'low', '2026-02-25 14:00:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
('d7eebc99-9c0b-4ef8-bb6d-6bb9bd380a18', 'Fix login bug', 'Investigate and fix the login timeout issue', 'IN_PROGRESS', 'high', '2026-02-17 10:00:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11');

-- Insert sample tasks for jane_smith
INSERT INTO tasks (id, title, description, status, priority, due_date, created_at, updated_at, user_id) VALUES
('e8eebc99-9c0b-4ef8-bb6d-6bb9bd380a19', 'Design new UI mockups', 'Create mockups for the dashboard redesign', 'IN_PROGRESS', 'medium', '2026-02-22 16:00:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12'),
('e9eebc99-9c0b-4ef8-bb6d-6bb9bd380a20', 'Conduct user testing', 'Run usability tests with 5 participants', 'TODO', 'high', '2026-02-28 15:00:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12'),
('eaeebc99-9c0b-4ef8-bb6d-6bb9bd380a21', 'Update color scheme', 'Apply new brand colors to the design system', 'DONE', 'medium', '2026-02-14 11:00:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12');

-- Insert sample tasks for alice_wonder
INSERT INTO tasks (id, title, description, status, priority, due_date, created_at, updated_at, user_id) VALUES
('ebeebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Write unit tests', 'Add unit tests for the task service layer', 'TODO', 'high', '2026-02-21 13:00:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a13'),
('eceebc99-9c0b-4ef8-bb6d-6bb9bd380a23', 'Database optimization', 'Optimize slow queries and add proper indexes', 'IN_PROGRESS', 'high', '2026-02-19 10:00:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a13'),
('edeebc99-9c0b-4ef8-bb6d-6bb9bd380a24', 'Security audit', 'Perform security audit on authentication flow', 'TODO', 'high', '2026-02-24 09:00:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a13'),
('eeeebc99-9c0b-4ef8-bb6d-6bb9bd380a25', 'Setup monitoring', 'Configure application monitoring and alerts', 'DONE', 'medium', '2026-02-13 16:00:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a13');

-- ========================================
-- VERIFICATION
-- ========================================

-- Print summary
DO $$
DECLARE
    user_count INTEGER;
    task_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO user_count FROM users;
    SELECT COUNT(*) INTO task_count FROM tasks;
    
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Database setup completed successfully!';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Created % users', user_count;
    RAISE NOTICE 'Created % tasks', task_count;
    RAISE NOTICE '';
    RAISE NOTICE 'Sample user credentials:';
    RAISE NOTICE '  john@example.com / Password@123';
    RAISE NOTICE '  jane@example.com / Password@123';
    RAISE NOTICE '  alice@example.com / Password@123';
    RAISE NOTICE '========================================';
END $$;
