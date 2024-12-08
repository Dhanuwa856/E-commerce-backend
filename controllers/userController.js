import argon2 from "argon2";
import User from "../models/user.js";

// Create User
export async function createUser(req, res) {
  const user = req.body;
  const password = req.body.password;

  try {
    const passwordHash = await argon2.hash(password);
    user.password = passwordHash;
    const newUser = await new User(user).save();

    res.status(201).json({
      message: "User created successfully!",
      user: newUser,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}
