DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS chat_rooms;

-- Dimension Table: User
CREATE TABLE dim_user (
    user_id INT PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255),
    password VARCHAR(255),
    location VARCHAR(255),
    image_url VARCHAR(255)
);

-- Dimension Table: Skill
CREATE TABLE dim_skill (
    skill_id INT PRIMARY KEY,
    skill_name TEXT,
    skill_desc TEXT
);

-- Dimension Table: Time
CREATE TABLE dim_time (
    time_id INT PRIMARY KEY,
    action_date DATETIME,
    year INT,
    month INT,
    day INT,
    hour INT,
    minute INT,
    second INT
);

-- Fact Table: Learning
CREATE TABLE facts_learning (
    user_id INT,
    skill_1_id INT,
    skill_2_id INT,
    skill_3_id INT,
    skill_4_id INT,
    skill_5_id INT,
    FOREIGN KEY (user_id) REFERENCES dim_user(user_id),
    FOREIGN KEY (skill_1_id) REFERENCES dim_skill(skill_id),
    FOREIGN KEY (skill_2_id) REFERENCES dim_skill(skill_id),
    FOREIGN KEY (skill_3_id) REFERENCES dim_skill(skill_id),
    FOREIGN KEY (skill_4_id) REFERENCES dim_skill(skill_id),
    FOREIGN KEY (skill_5_id) REFERENCES dim_skill(skill_id)
);

-- Fact Table: Teaching
CREATE TABLE facts_teaching (
    user_id INT,
    skill_1_id INT,
    skill_2_id INT,
    skill_3_id INT,
    skill_4_id INT,
    skill_5_id INT,
    FOREIGN KEY (user_id) REFERENCES dim_user(user_id),
    FOREIGN KEY (skill_1_id) REFERENCES dim_skill(skill_id),
    FOREIGN KEY (skill_2_id) REFERENCES dim_skill(skill_id),
    FOREIGN KEY (skill_3_id) REFERENCES dim_skill(skill_id),
    FOREIGN KEY (skill_4_id) REFERENCES dim_skill(skill_id),
    FOREIGN KEY (skill_5_id) REFERENCES dim_skill(skill_id)
);

-- Fact Table: Session
CREATE TABLE facts_session (
    learner_id INT,
    teacher_id INT,
    skill_id INT,
    start_time_id INT,
    end_time_id INT,
    FOREIGN KEY (learner_id) REFERENCES dim_user(user_id),
    FOREIGN KEY (teacher_id) REFERENCES dim_user(user_id),
    FOREIGN KEY (skill_id) REFERENCES dim_skill(skill_id),
    FOREIGN KEY (start_time_id) REFERENCES dim_time(time_id),
    FOREIGN KEY (end_time_id) REFERENCES dim_time(time_id)
);

CREATE TABLE chat_rooms(
    room_id INT GENERATED ALWAYS AS IDENTITY,
    user_1 INT,
    user_2 INT,
    PRIMARY KEY (room_id),
    FOREIGN KEY REFERENCES dim_user(user_id),
    FOREIGN KEY REFERENCES dim_user(user_id)
);

CREATE TABLE messages(
    message_id INT GENERATED ALWAYS AS IDENTITY,
    room_id INT,
    user_sent INT,
    message_content TEXT,
    PRIMARY KEY (message_id),
    FOREIGN KEY (room_id) REFERENCES chat_rooms(room_id),
    FOREIGN KEY (user_sent) REFERENCES dim_user(user_id)
);


-- Insert into users
INSERT INTO dim_user (user_id, name, email, password, location, image_url) VALUES
(1, 'Alice Johnson', 'alice@example.com', 'pass123', 'Angel', 'http://example.com/alice.jpg'),
(2, 'Bob Smith', 'bob@example.com', 'pass456', 'Euston', 'http://example.com/bob.jpg'),
(3, 'Carol White', 'carol@example.com', 'pass789', 'Victoria', 'http://example.com/carol.jpg'),
(4, 'David Lee', 'david@example.com', 'pass321', 'Vauxhall', 'http://example.com/david.jpg');

-- Insert into time
INSERT INTO dim_time (time_id, action_date, year, month, day, hour, minute, second) VALUES
(1, '2025-05-01 10:00:00', 2025, 5, 1, 10, 0, 0),
(2, '2025-05-01 11:00:00', 2025, 5, 1, 11, 0, 0),
(3, '2025-05-02 14:00:00', 2025, 5, 2, 14, 0, 0),
(4, '2025-05-02 15:30:00', 2025, 5, 2, 15, 30, 0);

-- Insert into learning
INSERT INTO facts_learning (user_id, skill_1_id, skill_2_id, skill_3_id, skill_4_id, skill_5_id) VALUES
(1, 101, 102, NULL, NULL, NULL),
(2, 103, 104, NULL, NULL, NULL),
(3, 105, NULL, NULL, NULL, NULL);

-- Insert into teaching
INSERT INTO facts_teaching (user_id, skill_1_id, skill_2_id, skill_3_id, skill_4_id, skill_5_id) VALUES
(4, 101, 105, NULL, NULL, NULL),
(2, 103, NULL, NULL, NULL, NULL);

-- Insert into session
INSERT INTO facts_session (learner_id, teacher_id, skill_id, start_time_id, end_time_id) VALUES
(1, 4, 101, 1, 2),
(3, 4, 105, 3, 4),
(2, 2, 103, 1, 2); -- Bob is both learner and teacher in this case (demo purpose)
