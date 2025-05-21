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
            email: user.email,
          },
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

    const user = await User.getUserById(userId);
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

async function getTopUsers(req, res) {
  try {
    const users = await User.getTopUsers();
    res.status(200).json(users);
  } catch (err) {
    console.error("Error fetching top users:", err);
    res.status(500).json({ error: "Failed to fetch top users." });
  }
}

async function getUserById(req, res) {
  try {
    const { userId } = req.params; // Extract userId from the request parameters
    const user = await User.getUserById(userId); // Assuming you have a method to fetch a user by ID

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json({
      id: user.user_id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      postcode: user.postcode,
      profession: user.profession || "N/A",
      location: user.location || "N/A",
      website: user.website || "N/A",
      github: user.github || "N/A",
      twitter: user.twitter || "N/A",
      instagram: user.instagram || "N/A",
      facebook: user.facebook || "N/A",
    });
  } catch (err) {
    console.error("Error fetching user by ID:", err);
    res.status(500).json({ error: "Failed to fetch user details." });
  }
  console.log("Received userId:", req.params.userId);
}

async function getUserByEmail(req, res) {
  try {
    const { email } = req.query;
    console.log(`User Controller, looking up email: ${email}`);
    const user = await User.getOneByEmail(email);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ id: user.user_id, email: user.email });
  } catch (error) {
    console.log(`UC, Catch error email: ${email}`);
    res.status(500).json({ error: "Failed to fetch email " });
  }
}

// async function getLastSessionSummary(req, res) {
//   try {
//     // const userId = req.user.user_id;
//     // const lastSessionSummary = await User.getLastSession();
//     const today = new Date();
//     const options = { day: "numeric", month: "long", year: "numeric" };
//     const formattedDate = today.toLocaleDateString("en-GB", options);
//     res.status(200).json({
//       skill: "Javascript",
//       date: formattedDate,
//     });
//   } catch (err) {
//     console.error("Error fetching last session summary:", err);
//     res.status(500).json({ error: "Failed to last session summary." });
//   }
// }

module.exports = {
  register,
  userLogin,
  getProfile,
  getTopUsers,
  getUserById,
  getUserByEmail,
};
