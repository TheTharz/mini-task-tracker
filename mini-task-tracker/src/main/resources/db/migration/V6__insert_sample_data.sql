-- Insert sample data for Task Tracker Application
-- Note: All passwords are hashed using BCrypt (password: "Password@123")

-- Insert sample users
-- Password for all users: Password@123
INSERT INTO users (id, username, email, hashed_password, created_at) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'john_doe', 'john@example.com', '$2a$10$UE/312fqW39pebLi9oHzk.IeCjBlHIE3p4vLpVVW9yffpRMbl3R0O', CURRENT_TIMESTAMP),
('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'jane_smith', 'jane@example.com', '$2a$10$UE/312fqW39pebLi9oHzk.IeCjBlHIE3p4vLpVVW9yffpRMbl3R0O', CURRENT_TIMESTAMP),
('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'alice_wonder', 'alice@example.com', '$2a$10$UE/312fqW39pebLi9oHzk.IeCjBlHIE3p4vLpVVW9yffpRMbl3R0O', CURRENT_TIMESTAMP);

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
