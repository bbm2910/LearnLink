const db = require("../database/connect")

class Appointment{
    constructor(data) {
        this.id = data.id;
        this.requesterId = data.requester_id;
        this.receiverId = data.receiver_id;
        this.startTime = data.start_time;
        this.duration = data.duration;
        this.status = data.status;
        this.createdAt = data.created_at;
}

    static async createAppointment({requesterId, receiverId, startTime, duration}){
        const result = await db.query(`INSERT INTO appointments (requester_id, receiver_id, start_time, duration)
        VALUES ($1, $2, $3, $4) RETURNING *`, [requesterId, receiverId, startTime, duration]);

        return new Appointment(result.rows[0])
    }

    static async findById(id){
        const result = await db.query(`SELECT * FROM appointments WHERE id = $1`, [id])
        if (!result.rows.length) return null;
        
        return new Appointment(result.rows[0])
    }

    static async getUserAppointments(userId){
        const result = await db.query(`SELECT * FROM appointments WHERE (requester_id = $1 OR receiver_id = $1) AND status = 'accepted'`, [userId]);
        return result.rows.map(row => new Appointment(row))
    }

    static async getPendingAppointments(userId){
        const result = await db.query(`SELECT id, requester_id, start_time, duration FROM appointments WHERE receiver_id = $1 AND status = 'pending'`,[userId])
        return result.rows.map(row => new Appointment(row))
    }

    async respond(status){
        const result = await db.query(`UPDATE appointments SET status = $1 WHERE id = $2 RETURNING *`, [status, this.id]);
        Object.assign(this, result.rows[0])
        return this
    }


}

module.exports = Appointment 