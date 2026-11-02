-- Portfolio test data fixture. This is intentionally separated from production data.
CREATE TABLE tasks (
  id INTEGER PRIMARY KEY,
  title VARCHAR(160) NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT FALSE
);

INSERT INTO tasks (id, title, completed) VALUES
  (1, 'Review acceptance criteria', FALSE),
  (2, 'Prepare release evidence', TRUE);

-- Example SQL assertion used during data-integrity testing.
SELECT id, title, completed FROM tasks WHERE title = 'Prepare release evidence';
