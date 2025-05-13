DROP TABLE IF EXISTS dim_user, dim_skill, dim_time, facts_learning, facts_session, facts_teaching, messages, chat_rooms;

-- Dimension Table: User
CREATE TABLE dim_user (
    user_id INT GENERATED ALWAYS AS IDENTITY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    postcode VARCHAR(10) NOT NULL,
    image_url VARCHAR(255),
    PRIMARY KEY (user_id)
);

-- Dimension Table: Skill
CREATE TABLE dim_skill (
    skill_id INT GENERATED ALWAYS AS IDENTITY,
    skill_name VARCHAR(255) NOT NULL,
    skill_desc VARCHAR(255) NOT NULL,
    PRIMARY KEY (skill_id)
);

-- Dimension Table: Time
CREATE TABLE dim_time (
    time_id INT GENERATED ALWAYS AS IDENTITY,
    action_date TIMESTAMP,
    year INT,
    month INT,
    day INT,
    hour INT,
    minute INT,
    second INT,
    PRIMARY KEY (time_id)
);

-- Fact Table: Learning
CREATE TABLE facts_learning (
    user_id INT NOT NULL,
    skill_1_id INT NOT NULL,
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
    user_id INT NOT NULL,
    skill_1_id INT NOT NULL,
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
    teacher_id INT NOT NULL,
    skill_id INT NOT NULL,
    start_time_id INT NOT NULL,
    end_time_id INT NOT NULL,
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
    FOREIGN KEY (user_1) REFERENCES dim_user(user_id),
    FOREIGN KEY (user_2) REFERENCES dim_user(user_id)
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
INSERT INTO dim_user (first_name, last_name, email, password, postcode, image_url) VALUES
('Alice', 'Johnson', 'alice@example.com', 'pass123', 'NW1 5DB', 'http://example.com/alice.jpg'),
('Bob', 'Smith', 'bob@example.com', 'pass456', 'N1 2AB', 'http://example.com/bob.jpg'),
('Carol', 'White', 'carol@example.com', 'pass789', 'E8 3DL', 'http://example.com/carol.jpg'),
('David', 'Lee', 'david@example.com', 'pass321', 'SE10 9NF', 'http://example.com/david.jpg'),
('Eva', 'Green', 'eva@example.com', 'pass654', 'W8 7NX', 'http://example.com/eva.jpg'),
('Frank', 'Moore', 'frank@example.com', 'pass987', 'TW9 1PX', 'http://example.com/frank.jpg'),
('Grace', 'Kim', 'grace@example.com', 'pass147', 'W6 0AA', 'http://example.com/grace.jpg'),
('Hank', 'Miller', 'hank@example.com', 'pass258', 'SW18 2PU', 'http://example.com/hank.jpg'),
('Ivy', 'Brown', 'ivy@example.com', 'pass369', 'SE1 7PB', 'http://example.com/ivy.jpg'),
('Jack', 'Wilson', 'jack@example.com', 'pass159', 'E1 6AN', 'http://example.com/jack.jpg');

-- Insert into skills
INSERT INTO dim_skill (skill_name, skill_desc) VALUES
('Python', 'Programming language'),
('Data Science', 'Data analysis and machine learning'),
('Public Speaking', 'Presenting to an audience'),
('Photography', 'Art of taking and editing photos'),
('Guitar', 'Playing acoustic and electric guitar');

-- Insert into time
INSERT INTO dim_time (action_date, year, month, day, hour, minute, second) VALUES
('2025-06-01 10:00:00', 2025, 5, 1, 10, 0, 0),
('2025-06-01 11:00:00', 2025, 5, 1, 11, 0, 0),
('2025-07-02 14:00:00', 2025, 5, 2, 14, 0, 0),
('2025-07-02 15:30:00', 2025, 5, 2, 15, 30, 0);

-- -- Insert into learning
-- INSERT INTO facts_learning (user_id, skill_1_id, skill_2_id, skill_3_id, skill_4_id, skill_5_id) VALUES
-- (1, 101, 102, NULL, NULL, NULL),
-- (2, 103, 104, 105, NULL, NULL),
-- (3, 103, NULL, NULL, NULL, NULL);

-- -- Insert into teaching
-- INSERT INTO facts_teaching (user_id, skill_1_id, skill_2_id, skill_3_id, skill_4_id, skill_5_id) VALUES
-- (3, 105, NULL, NULL, NULL, NULL),
-- (4, 104, 105, NULL, NULL, NULL),
-- (5, 103, NULL, NULL, NULL, NULL);

-- -- Insert into session
-- INSERT INTO facts_session (learner_id, teacher_id, skill_id, start_time_id, end_time_id) VALUES
-- (1, 2, 101, 1, 2),
-- (3, 4, 105, 3, 4),
-- (5, 6, 103, 1, 2);