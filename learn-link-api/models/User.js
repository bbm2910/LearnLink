const db = require('../database/connect');

class User {
    constructor({ user_id, first_name, last_name, email, password, location, image_url }) {
        this.user_id = user_id;
        this.first_name = first_name;
        this.last_name = last_name;
        this.email = email;
        this.password = password;
        this.location = location; // Check type - varchar(255)
        this.image_url = image_url;
    }

    static async create(data) {
        const { email, password } = data;
        let response = await db.query(
            "INSERT INTO user_account (username, password) VALUES ($1, $2) RETURNING user_id;",
            [email, password]
        );
        const newId = response.rows[0].user_id;
        const newUser = await User.getOneById(newId);
        return newUser;
    }

    static getOneUserById = async (user_id) => {
        const response = await db.query("SELECT * FROM potters WHERE potters_id = $1;", [user_id])
        if (response.rows.length != 1) {
            throw Error("Unable to locate user")
        }
        return new User(response.rows[0])
    }
    
    static getOneUserByEmail = async (email) => {
        const response = await db.query("SELECT * FROM potters WHERE username = $1;", [email])
        if (response.rows.length != 1) {
            throw new Error("Unable to locate user")
        }
        return new User(response.rows[0])
    }
    
    // Add update user details methods - ?

}

module.exports = {
    User
};