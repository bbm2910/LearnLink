DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS chat_rooms;

CREATE TABLE chat_rooms(
    room_id INT GENERATED ALWAYS AS IDENTITY,
    user_1 INT,
    user_2 INT,
    PRIMARY KEY (room_id),
    FOREIGN KEY REFERENCES users(user_id),
    FOREIGN KEY REFERENCES users(user_id)
);

CREATE TABLE messages(
    message_id INT GENERATED ALWAYS AS IDENTITY,
    room_id INT,
    user_sent INT,
    message_id TEXT,
    PRIMARY KEY (message_id),
    FOREIGN KEY (room_id) REFERENCES chat_rooms(room_id)
    FOREIGN KEY (user_sent) REFERENCES users(user_id)
)
