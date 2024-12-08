import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  userName: {
    type: String,
    request: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    default: "customer",
  },
  disabled: {
    type: Boolean,
    required: true,
    default: false,
  },
  image: {
    type: String,
    required: false,
    default: "https://cdn-icons-png.flaticon.com/512/9187/9187604.png",
  },
  emailVerified: {
    type: Boolean,
    required: true,
    default: false,
  },
  verificationToken: {
    type: String,
    required: false, // Not required by default
  },

  verificationTokenExpires: {
    type: Date,
    required: false, // Not required by default
  },
});

const User = mongoose.model("User01", userSchema);
export default User;
