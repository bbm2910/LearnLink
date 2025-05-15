const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { User } = require("../models/User");

async function register(req, res) {
  try {
    const data = req.body;
    const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT_ROUNDS));
    data["password"] = await bcrypt.hash(data.password, salt);
    const result = await User.create(data);

    // Create token after user is created
    const payload = {
      user_id: result.user_id,
      email: result.email,
    };

    jwt.sign(
      payload,
      process.env.SECRET_TOKEN,
      { expiresIn: 3600 },
      (err, token) => {
        if (err) {
          return res.status(500).json({ error: "Token generation failed" });
        }

        res.status(201).json({ token: token });
      }
    );
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function userLogin(req, res) {
  const data = req.body;
  try {
    const user = await User.getOneByEmail(data.email);
    if (!user) {
      throw new Error("No user with this email");
    }
    const match = await bcrypt.compare(data.password, user.password);

    if (match) {
      const payload = {
        user_id: user.user_id,
        email: user.email,
      };
      const sendToken = (err, token) => {
        if (err) {
          throw new Error("Error in token generation");
        }
        res.status(200).json({
          success: true,
          token: token,
          user: {
            id: user.user_id,
            email: user.email
          }
        });
      };

      jwt.sign(
        payload,
        process.env.SECRET_TOKEN,
        { expiresIn: 3600 },
        sendToken
      );
    } else {
      throw new Error("User could not be authenticated");
    }
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
}

async function getProfile(req, res) {
  try {
    const userId = req.user.user_id;

    const user = await User.getOneById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      postcode: user.postcode,
    });
  } catch (err) {
    console.error("Error getting profile:", err);
    res.status(500).json({ error: "Failed to get user profile." });
  }
}

module.exports = {
  register,
  userLogin,
  getProfile,
};
