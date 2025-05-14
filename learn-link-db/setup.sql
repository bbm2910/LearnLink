DROP TABLE IF EXISTS dim_user, dim_skill, dim_time, facts_learning, facts_session, facts_teaching, messages, chat_rooms;

-- Dimension Table: User
CREATE TABLE dim_user (
    user_id INT GENERATED ALWAYS AS IDENTITY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
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

-- To record chat rooms
-- To record chat rooms
CREATE TABLE chat_rooms(
    room_id INT GENERATED ALWAYS AS IDENTITY,
    user_1 INT,
    user_2 INT,
    PRIMARY KEY (room_id),
    FOREIGN KEY (user_1) REFERENCES dim_user(user_id),
    FOREIGN KEY (user_2) REFERENCES dim_user(user_id)
);

-- To record messages
-- To record messages
CREATE TABLE messages(
    message_id INT GENERATED ALWAYS AS IDENTITY,
    sender_id INT,
    recipient_id INT,
    message VARCHAR(500),
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read BOOLEAN DEFAULT false,
    PRIMARY KEY (message_id),
    FOREIGN KEY (sender_id) REFERENCES dim_user(user_id),
    FOREIGN KEY (recipient_id) REFERENCES dim_user(user_id)
    FOREIGN KEY (sender_id) REFERENCES dim_user(user_id),
    FOREIGN KEY (recipient_id) REFERENCES dim_user(user_id)
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
('Guitar', 'Playing acoustic and electric guitar'),
('JavaScript', 'Frontend web programming language'),
('SQL', 'Structured Query Language for databases'),
('Cooking', 'Preparing meals and culinary techniques'),
('Yoga', 'Physical and mental wellness practice'),
('French', 'Language: French speaking and writing');

('Guitar', 'Playing acoustic and electric guitar'),
('JavaScript', 'Frontend web programming language'),
('SQL', 'Structured Query Language for databases'),
('Cooking', 'Preparing meals and culinary techniques'),
('Yoga', 'Physical and mental wellness practice'),
('French', 'Language: French speaking and writing');


-- Insert into time
INSERT INTO dim_time (action_date, year, month, day, hour, minute, second) VALUES
-- October2024
('2024-10-02 09:00:00', 2024, 10, 2, 9, 0, 0),
('2024-10-02 10:00:00', 2024, 10, 2, 10, 0, 0),
('2024-10-02 10:30:00', 2024, 10, 2, 10, 30, 0),
('2024-10-02 11:30:00', 2024, 10, 2, 11, 30, 0),
('2024-10-09 09:00:00', 2024, 10, 9, 9, 0, 0),
('2024-10-09 10:00:00', 2024, 10, 9, 10, 0, 0),
('2024-10-09 10:30:00', 2024, 10, 9, 10, 30, 0),
('2024-10-09 11:30:00', 2024, 10, 9, 11, 30, 0),
('2024-10-16 09:00:00', 2024, 10, 16, 9, 0, 0),
('2024-10-16 10:00:00', 2024, 10, 16, 10, 0, 0),
('2024-10-16 10:30:00', 2024, 10, 16, 10, 30, 0),
('2024-10-16 11:30:00', 2024, 10, 16, 11, 30, 0),
('2024-10-23 09:00:00', 2024, 10, 23, 9, 0, 0),
('2024-10-23 10:00:00', 2024, 10, 23, 10, 0, 0),
('2024-10-23 10:30:00', 2024, 10, 23, 10, 30, 0),
('2024-10-23 11:30:00', 2024, 10, 23, 11, 30, 0),
('2024-10-30 09:00:00', 2024, 10, 30, 9, 0, 0),
('2024-10-30 10:00:00', 2024, 10, 30, 10, 0, 0),
('2024-10-30 10:30:00', 2024, 10, 30, 10, 30, 0),
('2024-10-30 11:30:00', 2024, 10, 30, 11, 30, 0),

-- November2024
('2024-11-06 09:00:00', 2024, 11, 6, 9, 0, 0),
('2024-11-06 10:00:00', 2024, 11, 6, 10, 0, 0),
('2024-11-06 10:30:00', 2024, 11, 6, 10, 30, 0),
('2024-11-06 11:30:00', 2024, 11, 6, 11, 30, 0),
('2024-11-13 09:00:00', 2024, 11, 13, 9, 0, 0),
('2024-11-13 10:00:00', 2024, 11, 13, 10, 0, 0),
('2024-11-13 10:30:00', 2024, 11, 13, 10, 30, 0),
('2024-11-13 11:30:00', 2024, 11, 13, 11, 30, 0),
('2024-11-20 09:00:00', 2024, 11, 20, 9, 0, 0),
('2024-11-20 10:00:00', 2024, 11, 20, 10, 0, 0),
('2024-11-20 10:30:00', 2024, 11, 20, 10, 30, 0),
('2024-11-20 11:30:00', 2024, 11, 20, 11, 30, 0),
('2024-11-27 09:00:00', 2024, 11, 27, 9, 0, 0),
('2024-11-27 10:00:00', 2024, 11, 27, 10, 0, 0),
('2024-11-27 10:30:00', 2024, 11, 27, 10, 30, 0),
('2024-11-27 11:30:00', 2024, 11, 27, 11, 30, 0),

-- December 2024
('2024-12-04 09:00:00', 2024, 12, 4, 9, 0, 0),
('2024-12-04 10:00:00', 2024, 12, 4, 10, 0, 0),
('2024-12-04 10:30:00', 2024, 12, 4, 10, 30, 0),
('2024-12-04 11:30:00', 2024, 12, 4, 11, 30, 0),

-- January 2025
('2025-01-08 10:00:00', 2025, 1, 8, 10, 0, 0),
('2025-01-08 11:00:00', 2025, 1, 8, 11, 0, 0),
('2025-01-15 14:00:00', 2025, 1, 15, 14, 0, 0),
('2025-01-15 15:00:00', 2025, 1, 15, 15, 0, 0),

-- February 2025
('2025-02-05 09:00:00', 2025, 2, 5, 9, 0, 0),
('2025-02-05 10:00:00', 2025, 2, 5, 10, 0, 0),
('2025-02-19 13:30:00', 2025, 2, 19, 13, 30, 0),
('2025-02-19 14:30:00', 2025, 2, 19, 14, 30, 0),

-- March 2025
('2025-03-06 11:00:00', 2025, 3, 6, 11, 0, 0),
('2025-03-06 12:00:00', 2025, 3, 6, 12, 0, 0),
('2025-03-20 15:30:00', 2025, 3, 20, 15, 30, 0),
('2025-03-20 16:30:00', 2025, 3, 20, 16, 30, 0),

-- April 2025
('2025-04-03 10:00:00', 2025, 4, 3, 10, 0, 0),
('2025-04-03 11:00:00', 2025, 4, 3, 11, 0, 0),
('2025-04-17 14:00:00', 2025, 4, 17, 14, 0, 0),
('2025-04-17 15:00:00', 2025, 4, 17, 15, 0, 0),

-- May 2025
('2025-05-01 13:00:00', 2025, 5, 1, 13, 0, 0),
('2025-05-01 14:00:00', 2025, 5, 1, 14, 0, 0),
('2025-05-15 09:30:00', 2025, 5, 15, 9, 30, 0),
('2025-05-15 10:30:00', 2025, 5, 15, 10, 30, 0),

-- June 2025
('2025-06-05 11:00:00', 2025, 6, 5, 11, 0, 0),
('2025-06-05 12:00:00', 2025, 6, 5, 12, 0, 0),
('2025-06-19 14:00:00', 2025, 6, 19, 14, 0, 0),
('2025-06-19 15:00:00', 2025, 6, 19, 15, 0, 0),

-- July 2025
('2025-07-03 10:30:00', 2025, 7, 3, 10, 30, 0),
('2025-07-03 11:30:00', 2025, 7, 3, 11, 30, 0),
('2025-07-17 16:00:00', 2025, 7, 17, 16, 0, 0),
('2025-07-17 17:00:00', 2025, 7, 17, 17, 0, 0),

-- August 2025
('2025-08-07 13:00:00', 2025, 8, 7, 13, 0, 0),
('2025-08-07 14:00:00', 2025, 8, 7, 14, 0, 0),
('2025-08-21 15:00:00', 2025, 8, 21, 15, 0, 0),
('2025-08-21 16:00:00', 2025, 8, 21, 16, 0, 0),

-- September 2025
('2025-09-04 11:00:00', 2025, 9, 4, 11, 0, 0),
('2025-09-04 12:00:00', 2025, 9, 4, 12, 0, 0),
('2025-09-18 17:30:00', 2025, 9, 18, 17, 30, 0),
('2025-09-18 18:30:00', 2025, 9, 18, 18, 30, 0);

-- Insert teaching data
INSERT INTO facts_teaching (user_id, skill_1_id, skill_2_id, skill_3_id, skill_4_id, skill_5_id) VALUES 
(1, 3, NULL, NULL, NULL, NULL),
(2, 8, 10, NULL, NULL, NULL),
(3, 9, 4, 7, NULL, NULL),
(4, 9, 4, 8, NULL, NULL),
(5, 5, 6, NULL, NULL, NULL),
(6, 10, NULL, NULL, NULL, NULL),
(7, 7, 2, NULL, NULL, NULL),
(8, 1, NULL, NULL, NULL, NULL),
(9, 10, 8, 9, NULL, NULL),
(10, 2, 1, NULL, NULL, NULL);
-- October2024
('2024-10-02 09:00:00', 2024, 10, 2, 9, 0, 0),
('2024-10-02 10:00:00', 2024, 10, 2, 10, 0, 0),
('2024-10-02 10:30:00', 2024, 10, 2, 10, 30, 0),
('2024-10-02 11:30:00', 2024, 10, 2, 11, 30, 0),
('2024-10-09 09:00:00', 2024, 10, 9, 9, 0, 0),
('2024-10-09 10:00:00', 2024, 10, 9, 10, 0, 0),
('2024-10-09 10:30:00', 2024, 10, 9, 10, 30, 0),
('2024-10-09 11:30:00', 2024, 10, 9, 11, 30, 0),
('2024-10-16 09:00:00', 2024, 10, 16, 9, 0, 0),
('2024-10-16 10:00:00', 2024, 10, 16, 10, 0, 0),
('2024-10-16 10:30:00', 2024, 10, 16, 10, 30, 0),
('2024-10-16 11:30:00', 2024, 10, 16, 11, 30, 0),
('2024-10-23 09:00:00', 2024, 10, 23, 9, 0, 0),
('2024-10-23 10:00:00', 2024, 10, 23, 10, 0, 0),
('2024-10-23 10:30:00', 2024, 10, 23, 10, 30, 0),
('2024-10-23 11:30:00', 2024, 10, 23, 11, 30, 0),
('2024-10-30 09:00:00', 2024, 10, 30, 9, 0, 0),
('2024-10-30 10:00:00', 2024, 10, 30, 10, 0, 0),
('2024-10-30 10:30:00', 2024, 10, 30, 10, 30, 0),
('2024-10-30 11:30:00', 2024, 10, 30, 11, 30, 0),

-- November2024
('2024-11-06 09:00:00', 2024, 11, 6, 9, 0, 0),
('2024-11-06 10:00:00', 2024, 11, 6, 10, 0, 0),
('2024-11-06 10:30:00', 2024, 11, 6, 10, 30, 0),
('2024-11-06 11:30:00', 2024, 11, 6, 11, 30, 0),
('2024-11-13 09:00:00', 2024, 11, 13, 9, 0, 0),
('2024-11-13 10:00:00', 2024, 11, 13, 10, 0, 0),
('2024-11-13 10:30:00', 2024, 11, 13, 10, 30, 0),
('2024-11-13 11:30:00', 2024, 11, 13, 11, 30, 0),
('2024-11-20 09:00:00', 2024, 11, 20, 9, 0, 0),
('2024-11-20 10:00:00', 2024, 11, 20, 10, 0, 0),
('2024-11-20 10:30:00', 2024, 11, 20, 10, 30, 0),
('2024-11-20 11:30:00', 2024, 11, 20, 11, 30, 0),
('2024-11-27 09:00:00', 2024, 11, 27, 9, 0, 0),
('2024-11-27 10:00:00', 2024, 11, 27, 10, 0, 0),
('2024-11-27 10:30:00', 2024, 11, 27, 10, 30, 0),
('2024-11-27 11:30:00', 2024, 11, 27, 11, 30, 0),

-- December 2024
('2024-12-04 09:00:00', 2024, 12, 4, 9, 0, 0),
('2024-12-04 10:00:00', 2024, 12, 4, 10, 0, 0),
('2024-12-04 10:30:00', 2024, 12, 4, 10, 30, 0),
('2024-12-04 11:30:00', 2024, 12, 4, 11, 30, 0),

-- January 2025
('2025-01-08 10:00:00', 2025, 1, 8, 10, 0, 0),
('2025-01-08 11:00:00', 2025, 1, 8, 11, 0, 0),
('2025-01-15 14:00:00', 2025, 1, 15, 14, 0, 0),
('2025-01-15 15:00:00', 2025, 1, 15, 15, 0, 0),

-- February 2025
('2025-02-05 09:00:00', 2025, 2, 5, 9, 0, 0),
('2025-02-05 10:00:00', 2025, 2, 5, 10, 0, 0),
('2025-02-19 13:30:00', 2025, 2, 19, 13, 30, 0),
('2025-02-19 14:30:00', 2025, 2, 19, 14, 30, 0),

-- March 2025
('2025-03-06 11:00:00', 2025, 3, 6, 11, 0, 0),
('2025-03-06 12:00:00', 2025, 3, 6, 12, 0, 0),
('2025-03-20 15:30:00', 2025, 3, 20, 15, 30, 0),
('2025-03-20 16:30:00', 2025, 3, 20, 16, 30, 0),

-- April 2025
('2025-04-03 10:00:00', 2025, 4, 3, 10, 0, 0),
('2025-04-03 11:00:00', 2025, 4, 3, 11, 0, 0),
('2025-04-17 14:00:00', 2025, 4, 17, 14, 0, 0),
('2025-04-17 15:00:00', 2025, 4, 17, 15, 0, 0),

-- May 2025
('2025-05-01 13:00:00', 2025, 5, 1, 13, 0, 0),
('2025-05-01 14:00:00', 2025, 5, 1, 14, 0, 0),
('2025-05-15 09:30:00', 2025, 5, 15, 9, 30, 0),
('2025-05-15 10:30:00', 2025, 5, 15, 10, 30, 0),

-- June 2025
('2025-06-05 11:00:00', 2025, 6, 5, 11, 0, 0),
('2025-06-05 12:00:00', 2025, 6, 5, 12, 0, 0),
('2025-06-19 14:00:00', 2025, 6, 19, 14, 0, 0),
('2025-06-19 15:00:00', 2025, 6, 19, 15, 0, 0),

-- July 2025
('2025-07-03 10:30:00', 2025, 7, 3, 10, 30, 0),
('2025-07-03 11:30:00', 2025, 7, 3, 11, 30, 0),
('2025-07-17 16:00:00', 2025, 7, 17, 16, 0, 0),
('2025-07-17 17:00:00', 2025, 7, 17, 17, 0, 0),

-- August 2025
('2025-08-07 13:00:00', 2025, 8, 7, 13, 0, 0),
('2025-08-07 14:00:00', 2025, 8, 7, 14, 0, 0),
('2025-08-21 15:00:00', 2025, 8, 21, 15, 0, 0),
('2025-08-21 16:00:00', 2025, 8, 21, 16, 0, 0),

-- September 2025
('2025-09-04 11:00:00', 2025, 9, 4, 11, 0, 0),
('2025-09-04 12:00:00', 2025, 9, 4, 12, 0, 0),
('2025-09-18 17:30:00', 2025, 9, 18, 17, 30, 0),
('2025-09-18 18:30:00', 2025, 9, 18, 18, 30, 0);

-- Insert teaching data
INSERT INTO facts_teaching (user_id, skill_1_id, skill_2_id, skill_3_id, skill_4_id, skill_5_id) VALUES 
(1, 3, NULL, NULL, NULL, NULL),
(2, 8, 10, NULL, NULL, NULL),
(3, 9, 4, 7, NULL, NULL),
(4, 9, 4, 8, NULL, NULL),
(5, 5, 6, NULL, NULL, NULL),
(6, 10, NULL, NULL, NULL, NULL),
(7, 7, 2, NULL, NULL, NULL),
(8, 1, NULL, NULL, NULL, NULL),
(9, 10, 8, 9, NULL, NULL),
(10, 2, 1, NULL, NULL, NULL);

-- Insert learning data
INSERT INTO facts_learning (user_id, skill_1_id, skill_2_id, skill_3_id, skill_4_id, skill_5_id) VALUES 
(1, 8, 2, NULL, NULL, NULL),
(2, 6, 5, 3, NULL, NULL),
(3, 5, 8, 1, NULL, NULL),
(4, 10, 2, NULL, NULL, NULL),
(5, 2, 1, 10, NULL, NULL),
(6, 7, 3, 2, NULL, NULL),
(7, 4, 1, NULL, NULL, NULL),
(8, 3, 7, NULL, NULL, NULL),
(9, 6, 3, NULL, NULL, NULL),
(10, 5, 3, 6, NULL, NULL);

-- Insert session data
INSERT INTO facts_session (learner_id, teacher_id, skill_id, start_time_id, end_time_id) VALUES 
(1, 9, 8, 7, 8),
(1, 10, 2, 15, 16),
(2, 5, 6, 9, 10),
(2, 5, 5, 7, 8),
(2, 1, 3, 25, 26),
(3, 5, 5, 25, 26),
(3, 4, 8, 19, 20),
(3, 8, 1, 1, 2),
(4, 2, 10, 29, 30),
(4, 7, 2, 3, 4),
(5, 7, 2, 27, 28),
(5, 8, 1, 23, 24),
(5, 9, 10, 3, 4),
(6, 3, 7, 5, 6),
(6, 1, 3, 25, 26),
(6, 10, 2, 23, 24),
(7, 4, 4, 27, 28),
(7, 8, 1, 11, 12),
(8, 1, 3, 7, 8),
(8, 7, 7, 29, 30),
(9, 5, 6, 5, 6),
(9, 1, 3, 1, 2),
(10, 5, 5, 31, 32),
(10, 1, 3, 23, 24),
(10, 5, 6, 19, 20),
(1, 9, 8, 53, 54),
(1, 7, 2, 33, 34),
(2, 5, 6, 57, 58),
(2, 5, 5, 69, 70),
(2, 1, 3, 37, 38),
(3, 5, 5, 37, 38),
(3, 9, 8, 47, 48),
(3, 8, 1, 57, 58),
(4, 6, 10, 33, 34),
(4, 7, 2, 35, 36),
(5, 7, 2, 33, 34),
(5, 10, 1, 53, 54),
(5, 9, 10, 37, 38),
(6, 3, 7, 49, 50),
(6, 1, 3, 47, 48),
(6, 10, 2, 67, 68),
(7, 3, 4, 67, 68),
(7, 8, 1, 63, 64),
(8, 1, 3, 53, 54),
(8, 3, 7, 71, 72),
(9, 5, 6, 67, 68),
(9, 1, 3, 69, 70),
(10, 5, 5, 41, 42),
(10, 1, 3, 47, 48),
(10, 5, 6, 39, 40);

-- -- Chat room sim 1
-- INSERT INTO chat_rooms (user_1, user_2)
-- VALUES (1, 2);  -- Alice and Bob in a chat room

-- -- Message sim 1
-- INSERT INTO messages (room_id, user_sent, message_content)
-- VALUES (1, 1, 'Hello, Bob!');  -- Alice sends a message to Bob
-- Insert learning data
INSERT INTO facts_learning (user_id, skill_1_id, skill_2_id, skill_3_id, skill_4_id, skill_5_id) VALUES 
(1, 8, 2, NULL, NULL, NULL),
(2, 6, 5, 3, NULL, NULL),
(3, 5, 8, 1, NULL, NULL),
(4, 10, 2, NULL, NULL, NULL),
(5, 2, 1, 10, NULL, NULL),
(6, 7, 3, 2, NULL, NULL),
(7, 4, 1, NULL, NULL, NULL),
(8, 3, 7, NULL, NULL, NULL),
(9, 6, 3, NULL, NULL, NULL),
(10, 5, 3, 6, NULL, NULL);

-- Insert session data
INSERT INTO facts_session (learner_id, teacher_id, skill_id, start_time_id, end_time_id) VALUES 
(1, 9, 8, 7, 8),
(1, 10, 2, 15, 16),
(2, 5, 6, 9, 10),
(2, 5, 5, 7, 8),
(2, 1, 3, 25, 26),
(3, 5, 5, 25, 26),
(3, 4, 8, 19, 20),
(3, 8, 1, 1, 2),
(4, 2, 10, 29, 30),
(4, 7, 2, 3, 4),
(5, 7, 2, 27, 28),
(5, 8, 1, 23, 24),
(5, 9, 10, 3, 4),
(6, 3, 7, 5, 6),
(6, 1, 3, 25, 26),
(6, 10, 2, 23, 24),
(7, 4, 4, 27, 28),
(7, 8, 1, 11, 12),
(8, 1, 3, 7, 8),
(8, 7, 7, 29, 30),
(9, 5, 6, 5, 6),
(9, 1, 3, 1, 2),
(10, 5, 5, 31, 32),
(10, 1, 3, 23, 24),
(10, 5, 6, 19, 20),
(1, 9, 8, 53, 54),
(1, 7, 2, 33, 34),
(2, 5, 6, 57, 58),
(2, 5, 5, 69, 70),
(2, 1, 3, 37, 38),
(3, 5, 5, 37, 38),
(3, 9, 8, 47, 48),
(3, 8, 1, 57, 58),
(4, 6, 10, 33, 34),
(4, 7, 2, 35, 36),
(5, 7, 2, 33, 34),
(5, 10, 1, 53, 54),
(5, 9, 10, 37, 38),
(6, 3, 7, 49, 50),
(6, 1, 3, 47, 48),
(6, 10, 2, 67, 68),
(7, 3, 4, 67, 68),
(7, 8, 1, 63, 64),
(8, 1, 3, 53, 54),
(8, 3, 7, 71, 72),
(9, 5, 6, 67, 68),
(9, 1, 3, 69, 70),
(10, 5, 5, 41, 42),
(10, 1, 3, 47, 48),
(10, 5, 6, 39, 40);

-- -- Chat room sim 1
-- INSERT INTO chat_rooms (user_1, user_2)
-- VALUES (1, 2);  -- Alice and Bob in a chat room

-- -- Message sim 1
-- INSERT INTO messages (room_id, user_sent, message_content)
-- VALUES (1, 1, 'Hello, Bob!');  -- Alice sends a message to Bob