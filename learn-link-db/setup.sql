DROP TABLE IF EXISTS appointments, messages, chat_rooms, dim_user, dim_skill, dim_time, facts_learning, facts_session, facts_teaching;

-- Dimension Table: User
CREATE TABLE dim_user (
    user_id INT GENERATED ALWAYS AS IDENTITY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    -- city VARCHAR(255) NOT NULL,
    postcode VARCHAR(255) NOT NULL,
    image_url VARCHAR(255),
    PRIMARY KEY (user_id)
);

-- Dimension Table: Skill
CREATE TABLE dim_skill (
    skill_id INT GENERATED ALWAYS AS IDENTITY,
    skill_cat VARCHAR(255) NOT NULL,
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
CREATE TABLE chat_rooms(
    room_id INT GENERATED ALWAYS AS IDENTITY,
    user_1 INT,
    user_2 INT,
    PRIMARY KEY (room_id),
    FOREIGN KEY (user_1) REFERENCES dim_user(user_id),
    FOREIGN KEY (user_2) REFERENCES dim_user(user_id)
);

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
);

CREATE TABLE appointments (
    id INT GENERATED ALWAYS AS IDENTITY,
    requester_id INT, 
    receiver_id INT, 
    start_time TIMESTAMP NOT NULL, 
    duration INTEGER NOT NULL, 
    status TEXT CHECK(status IN('pending', 'accepted', 'rejected')) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (id),
    FOREIGN KEY (requester_id) REFERENCES dim_user(user_id),
    FOREIGN KEY (receiver_id) REFERENCES dim_user(user_id)
);

-- Insert into users
INSERT INTO dim_user (first_name, last_name, email, password, postcode, image_url) VALUES
('Alice', 'Johnson', 'alice@example.com', 'pass123', 'Birmingham City Centre', 'http://example.com/alice.jpg'),
('Bob', 'Smith', 'bob@example.com', 'pass456', 'Moseley', 'http://example.com/bob.jpg'),
('Carol', 'White', 'carol@example.com', 'pass789', 'Harborne', 'http://example.com/carol.jpg'),
('David', 'Lee', 'david@example.com', 'pass321', 'Selly Oak', 'http://example.com/david.jpg'),
('Eva', 'Green', 'eva@example.com', 'pass654', 'Erdington', 'http://example.com/eva.jpg'),
('Frank', 'Moore', 'frank@example.com', 'pass987', 'Shoreditch (East London)', 'http://example.com/frank.jpg'),
('Grace', 'Kim', 'grace@example.com', 'pass147', 'Westminster (includes Buckingham Palace)', 'http://example.com/grace.jpg'),
('Hank', 'Miller', 'hank@example.com', 'pass258', 'Camden Town', 'http://example.com/hank.jpg'),
('Ivy', 'Brown', 'ivy@example.com', 'pass369', 'Notting Hill', 'http://example.com/ivy.jpg'),
('Jack', 'Wilson', 'jack@example.com', 'pass159', 'Waterloo / South Bank area', 'http://example.com/jack.jpg'),
('Amelia', 'Jones', 'amelia.jones@example.com', 'hashedpassword123', 'Manchester', 'https://example.com/images/amelia.jpg'),
('Liam', 'Taylor', 'liam.taylor@example.com', 'hashedpassword456', 'Manchester', 'https://example.com/images/liam.jpg'),
('Chloe', 'Smith', 'chloe.smith@example.com', 'hashedpassword789', 'Manchester', 'https://example.com/images/chloe.jpg'),
('Noah', 'Wilson', 'noah.wilson@example.com', 'hashedpassword321', 'Manchester', 'https://example.com/images/noah.jpg'),
('Emily', 'Brown', 'emily.brown@example.com', 'hashedpassword654', 'Manchester', 'https://example.com/images/emily.jpg');

-- Insert skills
INSERT INTO dim_skill (skill_cat, skill_name, skill_desc) VALUES
-- Music
('Music', 'Guitar Playing', 'Ability to perform rhythm and lead guitar parts on acoustic or electric guitar.'),
('Music', 'Piano Proficiency', 'Skilled in playing classical and contemporary pieces on the piano.'),
('Music', 'Drumming Technique', 'Expertise in percussion and drumming using a standard drum kit.'),
('Music', 'Violin Performance', 'Trained in playing solo and ensemble pieces with the violin.'),
('Music', 'Saxophone Improvisation', 'Capable of performing jazz and blues improvisations on the saxophone.'),
-- Programming
('Programming', 'Proficient JavaScript', 'Building web applications.'),
('Programming', 'Experienced Python', 'Data analysis and scripting.'),
('Programming', 'Java', 'Developing enterprise-level software.'),
('Programming', 'Capable C++', 'Building efficient system-level code.'),
('Programming', 'Knowledgeable Haskell', 'Functional programming.'),
-- Cooking
('Cooking', 'Baking Techniques', 'Skilled in preparing breads, pastries, and cakes using precise baking methods.'),
('Cooking', 'Knife Skills', 'Proficient in professional knife handling, including slicing, dicing, and julienning.'),
('Cooking', 'Sauce Preparation', 'Experienced in making classic sauces such as béchamel, hollandaise, and demi-glace.'),
('Cooking', 'Grilling Mastery', 'Capable of grilling meats, vegetables, and seafood to optimal doneness and flavor.'),
('Cooking', 'International Cuisine', 'Knowledgeable in preparing dishes from various global cuisines including Thai, Italian, and Indian.');

-- Insert into time
INSERT INTO dim_time (action_date, year, month, day, hour, minute, second) VALUES
-- October 2024
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

-- November 2024
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
(7, 4, 4, 69, 70),
(7, 8, 1, 65, 66),
(8, 1, 3, 63, 64),
(8, 7, 7, 43, 44),
(9, 5, 6, 45, 46),
(9, 1, 3, 41, 42),
(10, 5, 5, 59, 60),
(10, 1, 3, 71, 72),
(10, 5, 6, 39, 40);

-- Insert chat room data
INSERT INTO chat_rooms (user_1, user_2) VALUES
(3, 1),  -- Carol ↔ Alice (teacher)
(5, 8),  -- Eva ↔ Hank (teacher)
(10, 1), -- Jack ↔ Alice (teacher)
(4, 7),   -- David ↔ Grace (Grace teaches guitar and piano)
(2, 5),   -- Bob ↔ Eva (Eva teaches saxophone + guitar)
(6, 1),   -- Frank ↔ Alice (Alice teaches guitar)
(7, 8);   -- Grace ↔ Hank (both involved in guitar lessons)

-- Insert messages data
INSERT INTO messages (sender_id, recipient_id, message, sent_at) VALUES
-- Carol → Alice
(3, 1, 'Hi Alice! I’m interested in guitar lessons. Are you available next week?', '2025-05-15 10:00:00'),
(1, 3, 'Hi Carol! Yes, I’m free Tuesday or Thursday afternoon.', '2025-05-15 10:15:00'),
-- Eva → Hank
(5, 8, 'Hey Hank! Loved your guitar profile. Can we do a trial lesson soon?', '2025-05-16 11:30:00'),
(8, 5, 'Thanks Eva! How about Wednesday at 2pm?', '2025-05-16 11:35:00'),
-- Jack → Alice
(10, 1, 'Hi Alice, can we book another session this weekend?', '2025-05-17 09:00:00'),
(1, 10, 'Sure, Saturday morning at 10am works for me!', '2025-05-17 09:05:00'),
-- David ↔ Grace
(4, 7, 'Hi Grace, I’m trying to learn guitar basics. Can we set up a session?', '2025-05-18 15:00:00'),
(7, 4, 'Of course! How’s Friday afternoon?', '2025-05-18 15:10:00'),
-- Bob ↔ Eva
(2, 5, 'Hey Eva, do you still offer lessons in guitar?', '2025-05-18 16:20:00'),
(5, 2, 'Yes! I’m available next week on Monday morning.', '2025-05-18 16:22:00'),
-- Frank ↔ Alice
(6, 1, 'Hi Alice, I’m in Shoreditch and want to learn acoustic guitar. Can we start this weekend?', '2025-05-19 10:00:00'),
(1, 6, 'Hi Frank! I can do Sunday at 4pm.', '2025-05-19 10:05:00'),
-- Grace ↔ Hank (peer collaboration chat)
(7, 8, 'Hey Hank, I noticed we both teach guitar. Want to collaborate on a group session?', '2025-05-20 12:00:00'),
(8, 7, 'Sounds awesome. Let’s do it next Wednesday afternoon?', '2025-05-20 12:05:00');

-- Insert appointment data
INSERT INTO appointments (requester_id, receiver_id, start_time, duration, status, created_at) VALUES
-- Carol ↔ Alice: Assume agreed on May 20 at 2pm for 60 mins
(3, 1, '2025-05-20 14:00:00', 60, 'accepted', '2025-05-15 10:20:00'),
-- Eva ↔ Hank: May 21 at 2pm, 60 mins
(5, 8, '2025-05-21 14:00:00', 60, 'accepted', '2025-05-16 11:40:00'),
-- Jack ↔ Alice: May 24 at 10am, 60 mins
(10, 1, '2025-05-24 10:00:00', 60, 'accepted', '2025-05-17 09:10:00'),
-- David ↔ Grace: Friday, May 23 at 3pm
(4, 7, '2025-05-23 15:00:00', 60, 'accepted', '2025-05-18 15:15:00'),
-- Bob ↔ Eva: Monday, May 26 at 10am
(2, 5, '2025-05-26 10:00:00', 60, 'accepted', '2025-05-18 16:25:00'),
-- Frank ↔ Alice: Sunday, May 25 at 4pm
(6, 1, '2025-05-25 16:00:00', 60, 'accepted', '2025-05-19 10:10:00'),
-- Grace ↔ Hank: Peer collaboration on May 28 at 2pm
(7, 8, '2025-05-28 14:00:00', 90, 'accepted', '2025-05-20 12:10:00');