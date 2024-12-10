import argon2 from "argon2";
import User from "../models/user.js";
import jwt from "jsonwebtoken";

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

// get all users
export async function getUsers(req, res) {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// User login
export async function loginUser(req, res) {
  const { input, password } = req.body;

  try {
    const query = input.includes("@") ? { email: input } : { userName: input };

    const user = await User.findOne(query);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare the provided password with the hashed password
    const isMatch = await argon2.verify(user.password, password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid password",
      });
    }

    const payLoad = {
      email: user.email,
      userName: user.userName,
      disabled: user.disabled,
      type: user.type,
      emailVerified: user.emailVerified,
      image: user.image,
    };

    // Generate JWT token
    const token = jwt.sign(payLoad, process.env.JWT_KEY);

    res.json({
      message: "User authenticated successfully",
      token,
    });
  } catch (err) {
    console.log("Error logging in", err.message);
    res.status(500).json({ message: "sever error while loggging in" });
  }
}

// Middleware to check if the user is logged in
export const checkLoggedIn = (req, res, next) => {
  const user = req.user;

  if (!user) {
    return res.status(403).json({
      message: "Please LogIn",
    });
  }
  next(); // Proceed to the next middleware or controller function
};

// Middleware to check if the user is an admin
export const checkAdmin = (req, res, next) => {
  const user = req.user;

  if (user?.type !== "admin") {
    return res.status(403).json({
      message: "You do not have permission to perform this action",
    });
  }

  next(); // Proceed if the user is an admin
};

// Middleware to check if the user is an customer
export const checkCustomer = (req, res, next) => {
  const user = req.user;

  if (user?.type !== "customer") {
    return res.status(403).json({
      message: "You do not have permission to perform this action",
    });
  }

  next(); // Proceed if the user is an customer
};

// Middleware to check if the user is an verified the email
export const checkEmailVerified = (req, res, next) => {
  const user = req.user;

  // Check if the user's email is verified
  if (!user.emailVerified) {
    return res.status(403).json({
      message:
        "Your email is not verified. Please verify your email to proceed.",
    });
  }

  next(); // Proceed if the user's email is verified
};

export const disableAndChangeUserType = async (req, res) => {
  const { userEmail } = req.params; // Get the user ID from URL params
  const { type, disabled } = req.body; // Get type and disabled status from the request body

  try {
    // Find the user by ID
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the user's type if provided
    if (type) {
      user.type = type;
    }

    // Update the disabled status if provided
    if (typeof disabled === "boolean") {
      user.disabled = disabled;
    }

    // Save the updated user
    const updatedUser = await user.save();

    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
