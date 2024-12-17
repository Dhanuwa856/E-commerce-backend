import UserAddress from "../models/userAddress.js";

// create user address
export const addAddress = async (req, res) => {
  try {
    // Extract the user's email from the token (assumes middleware sets req.user)
    const { email: user_email } = req.user;

    // Destructure address details from the request body
    const { address_line1, address_line2, city, state, zip_code, country } =
      req.body;

    // Check if an address already exists for the user
    const existingAddress = await UserAddress.findOne({ user_email });
    if (existingAddress) {
      return res.status(400).json({
        message:
          "An address already exists for this email. Please update it instead.",
      });
    }

    // Create a new address
    const newAddress = new UserAddress({
      user_email,
      address_line1,
      address_line2,
      city,
      state,
      zip_code,
      country,
    });

    // Save the address to the database
    const savedAddress = await newAddress.save();

    res.status(201).json({
      message: "Address added successfully.",
      address: savedAddress,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to add address.",
      error: error.message,
    });
  }
};

// update user address
export const updateAddress = async (req, res) => {
  try {
    // Extract the user's email from the token (assumes middleware sets req.user)
    const { email: user_email } = req.user;

    // Destructure address details from the request body
    const { address_line1, address_line2, city, state, zip_code, country } =
      req.body;

    // Find the existing address by user_email
    const existingAddress = await UserAddress.findOne({ user_email });

    if (!existingAddress) {
      return res.status(404).json({
        message:
          "No address found for this email. Please add an address first.",
      });
    }

    // Update the address details
    existingAddress.address_line1 =
      address_line1 || existingAddress.address_line1;
    existingAddress.address_line2 =
      address_line2 || existingAddress.address_line2;
    existingAddress.city = city || existingAddress.city;
    existingAddress.state = state || existingAddress.state;
    existingAddress.zip_code = zip_code || existingAddress.zip_code;
    existingAddress.country = country || existingAddress.country;

    // Save the updated address
    const updatedAddress = await existingAddress.save();

    res.status(200).json({
      message: "Address updated successfully.",
      address: updatedAddress,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update address.",
      error: error.message,
    });
  }
};

// get address by email
export const getAddressByEmail = async (req, res) => {
  try {
    // Extract the user's email from the token (assumes middleware sets req.user)
    const { email: user_email } = req.user;

    // Find the address associated with the user's email
    const address = await UserAddress.findOne({ user_email });

    if (!address) {
      return res.status(404).json({
        message: "No address found for this email.",
      });
    }

    res.status(200).json({
      message: "Address retrieved successfully.",
      address,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve address.",
      error: error.message,
    });
  }
};
