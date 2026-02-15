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
