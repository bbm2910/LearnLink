const db = require('../database/connect')

class Message {
    constructor({message_id, sender_id, recipient_id, message, sent_at}){
        this.message_id = message_id
        this.sender_id = sender_id
        this.recipient_id = recipient_id
        this.message = message
        this.sent_at = sent_at
    }

    static async create({sender_id, recipient_id, message}) {
        const response = await db.query(
            `INSERT INTO messages (sender_id, recipient_id, message)
            VALUES ($1, $2, $3) RETURNING *;`,
            [sender_id, recipient_id, message]
);
         return new Message(response.rows[0])
    };

    static async getChatHistory(user1, user2){
        const response = await db.query(
        `SELECT 
            sender_id AS "senderId",
            recipient_id AS "recipientId",
            message AS "content",
            sent_at AS "timestamp"
         FROM messages
         WHERE (sender_id = $1 AND recipient_id = $2)
         OR (sender_id = $2 AND recipient_id = $1)
         ORDER BY sent_at ASC`, 
        [user1, user2]
    );
    return response.rows;
       
    }

   static async getConversationPartners(userId) {
    const response = await db.query(
        `
        SELECT
            u.user_id,
            u.email,
            MAX(m.sent_at) AS last_message_time
        FROM (
            SELECT recipient_id AS user_id FROM messages WHERE sender_id = $1
            UNION
            SELECT sender_id AS user_id FROM messages WHERE recipient_id = $1
        ) AS conversation_users
        JOIN dim_user u ON u.user_id = conversation_users.user_id
        JOIN messages m ON (
            (m.sender_id = $1 AND m.recipient_id = u.user_id) OR
            (m.sender_id = u.user_id AND m.recipient_id = $1)
        )
        GROUP BY u.user_id, u.email
        ORDER BY last_message_time DESC;
        `,
        [userId]
    );
    
    return response.rows;
}
}


module.exports = { Message }
