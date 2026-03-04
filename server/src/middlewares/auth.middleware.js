const jwt = require("jsonwebtoken");
const User = require("../modules/auth/auth.model");
const config = require("../config/env");

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer")) {
      throw new Error("Not authorized");
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, config.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      throw new Error("User not found");
    }

    req.user = user;

    next();

  } catch (error) {
    next(error);
  }
};

module.exports = protect;