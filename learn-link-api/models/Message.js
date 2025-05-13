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
            `SELECT * FROM messages
            WHERE (sender_id = $1 AND recipient_id = $2)
            OR (sender_id = $2 AND recipient_id = $1)
            ORDER BY sent_at ASC`, 
            [user1, user2]
        )
        return response.rows.map(row => new Message(row))
    }

    static async getConversationPartners(userId){
        const response = await db.query(
            `SELECT DISTINCT
            CASE
            WHEN sender_id = $1 THEN recipient_id
            WHEN recipient_id = $1 THEN sender_id
            END AS partner_id 
            FROM messages
            WHERE sender_id = $1 OR recipient_id = $1;
             `, [userId])
        return response.rows.map(row => row.partner_id)
    }
}


module.exports = { Message }
