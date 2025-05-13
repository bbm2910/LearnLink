DROP TABLE IF EXISTS dim_user, dim_skill, dim_time, facts_learning, facts_session, facts_teaching;

-- Dimension Table: User
CREATE TABLE dim_user (
    user_id INT NOT NULL AUTO_INCREMENT,
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
    skill_id INT NOT NULL AUTO_INCREMENT,
    skill_name VARCHAR(255) NOT NULL,
    skill_desc VARCHAR(255) NOT NULL,
    PRIMARY KEY (skill_id)
);

-- Dimension Table: Time
CREATE TABLE dim_time (
    time_id INT NOT NULL AUTO_INCREMENT,
    action_date DATETIME,
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

-- Insert into users
INSERT INTO dim_user (user_id, first_name, last_name, email, password, postcode, image_url) VALUES
(1, 'Alice', 'Johnson', 'alice@example.com', 'pass123', 'NW1 5DB', 'http://example.com/alice.jpg'),
(2, 'Bob', 'Smith', 'bob@example.com', 'pass456', 'N1 2AB', 'http://example.com/bob.jpg'),
(3, 'Carol', 'White', 'carol@example.com', 'pass789', 'E8 3DL', 'http://example.com/carol.jpg'),
(4, 'David', 'Lee', 'david@example.com', 'pass321', 'SE10 9NF', 'http://example.com/david.jpg'),
(5, 'Eva', 'Green', 'eva@example.com', 'pass654', 'W8 7NX', 'http://example.com/eva.jpg'),
(6, 'Frank', 'Moore', 'frank@example.com', 'pass987', 'TW9 1PX', 'http://example.com/frank.jpg'),
(7, 'Grace', 'Kim', 'grace@example.com', 'pass147', 'W6 0AA', 'http://example.com/grace.jpg'),
(8, 'Hank', 'Miller', 'hank@example.com', 'pass258', 'SW18 2PU', 'http://example.com/hank.jpg'),
(9, 'Ivy', 'Brown', 'ivy@example.com', 'pass369', 'SE1 7PB', 'http://example.com/ivy.jpg'),
(10, 'Jack', 'Wilson', 'jack@example.com', 'pass159', 'E1 6AN', 'http://example.com/jack.jpg');

-- Insert into skills
INSERT INTO dim_skill (skill_id, skill_name, skill_desc) VALUES
(101, 'Python', 'Programming language'),
(102, 'Data Science', 'Data analysis and machine learning'),
(103, 'Public Speaking', 'Presenting to an audience'),
(104, 'Photography', 'Art of taking and editing photos'),
(105, 'Guitar', 'Playing acoustic and electric guitar');

-- Insert into time
INSERT INTO dim_time (time_id, action_date, year, month, day, hour, minute, second) VALUES
(1, '2025-06-01 10:00:00', 2025, 5, 1, 10, 0, 0),
(2, '2025-06-01 11:00:00', 2025, 5, 1, 11, 0, 0),
(3, '2025-07-02 14:00:00', 2025, 5, 2, 14, 0, 0),
(4, '2025-07-02 15:30:00', 2025, 5, 2, 15, 30, 0);

-- Insert into learning
INSERT INTO facts_learning (user_id, skill_1_id, skill_2_id, skill_3_id, skill_4_id, skill_5_id) VALUES
(1, 101, 102, NULL, NULL, NULL),
(2, 103, 104, 105, NULL, NULL),
(3, 103, NULL, NULL, NULL, NULL);

-- Insert into teaching
INSERT INTO facts_teaching (user_id, skill_1_id, skill_2_id, skill_3_id, skill_4_id, skill_5_id) VALUES
(3, 105, NULL, NULL, NULL, NULL),
(4, 104, 105, NULL, NULL, NULL),
(5, 103, NULL, NULL, NULL, NULL);

-- Insert into session
INSERT INTO facts_session (learner_id, teacher_id, skill_id, start_time_id, end_time_id) VALUES
(1, 2, 101, 1, 2),
(3, 4, 105, 3, 4),
(5, 6, 103, 1, 2);