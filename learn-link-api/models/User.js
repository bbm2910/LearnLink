const db = require("../database/connect");

class User {
  constructor({
    user_id,
    first_name,
    last_name,
    email,
    password,
    postcode,
    image_url,
  }) {
    this.user_id = user_id;
    this.first_name = first_name;
    this.last_name = last_name;
    this.email = email;
    this.password = password;
    this.postcode = postcode; // TODO: Decide how location will be used in the app
    this.image_url = image_url;
  }

  static async create(data) {
    const { first_name, last_name, email, password, postcode, image_url } =
      data;
    let response = await db.query(
      "INSERT INTO dim_user (first_name, last_name, email, password, postcode, image_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING user_id;",
      [first_name, last_name, email, password, postcode, image_url]
    );
    const newId = response.rows[0].user_id;
    const newUser = await User.getOneById(newId);
    return newUser;
  }

  static getOneById = async (user_id) => {
    const response = await db.query(
      "SELECT * FROM dim_user WHERE user_id = $1;",
      [user_id]
    );
    if (response.rows.length != 1) {
      throw Error("Unable to locate user");
    }
    return new User(response.rows[0]);
  };

  static getOneUserByEmail = async (email) => {
    const response = await db.query(
      "SELECT * FROM dim_user WHERE email = $1;",
      [email]
    );
    if (response.rows.length != 1) {
      throw new Error("Unable to locate user");
    }
    return new User(response.rows[0]);
  };

  // TODO?: Add update user details methods - Decide which details can be updated.
}

module.exports = {
  User,
};
