CREATE TABLE caseworker_task (
    task_id UUID PRIMARY KEY,
    title VARCHAR(120) NOT NULL,
    description VARCHAR(1000),
    status VARCHAR(30) NOT NULL,
    due_date_time TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_caseworker_task_status
        CHECK (status IN ('TODO', 'IN_PROGRESS', 'COMPLETED'))
);

CREATE INDEX idx_caseworker_task_due_date_time ON caseworker_task (due_date_time);
CREATE INDEX idx_caseworker_task_status ON caseworker_task (status);
