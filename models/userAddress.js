import mongoose from "mongoose";

const userAddressSchema = mongoose.Schema(
  {
    user_email: {
      type: String,
      required: true,
      unique: true,
    },
    address_line1: {
      type: String,
      required: true,
    },
    address_line2: {
      type: String,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    zip_code: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt
);

const UserAddress = mongoose.model("user_address01", userAddressSchema);
export default UserAddress;
