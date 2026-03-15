const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./auth.model");
const config = require("../../config/env");

const registerUser = async (data) => {
  const { name, email, password, role, department } = data;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(
    password,
    config.BCRYPT_SALT
  );

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role,
    department
  });

  return user;
};

const loginUser = async (data) => {
  const { email, password } = data;

  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign(
    { id: user._id, role: user.role, department: user.department },
    config.JWT_SECRET,
    { expiresIn: config.JWT_EXPIRES_IN }
  );

  return { user, token };
};

module.exports = {
  registerUser,
  loginUser
};