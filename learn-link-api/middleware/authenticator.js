const jwt = require("jsonwebtoken");

function authenticator(req, res, next) {
  //Had to change slightly change the way the JWT token was read (Khav)
  const authHeader = req.headers["authorization"]; // lowercase key access
  const token = authHeader?.replace("Bearer ", "");

  // const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(403).json({ error: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_TOKEN);

    //Had to change to normalise user info to allow easier authentication in router requests (khav)
    req.user = {
      user_id: decoded.user_id,
      email: decoded.email,
    };

    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid or expired token" });
  }
}

module.exports = authenticator;
