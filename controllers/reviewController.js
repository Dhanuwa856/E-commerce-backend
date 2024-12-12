import Review from "../models/review.js";
import Product from "../models/product.js";

// create review
export const createReview = async (req, res) => {
  const { product_id } = req.params; // Get product ID from the request parameters
  const { rating, comment, product_images } = req.body; // Get review data from the request body

  try {
    // Check if the product exists
    const product = await Product.findOne({ product_id });
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    // Extract user details from the token (assuming middleware has added user info to req.user)
    const { userName: user_name, image: user_image } = req.user;

    // Validate if the user has already reviewed the product (optional)
    const existingReview = await Review.findOne({ product_id, user_name });
    if (existingReview) {
      return res
        .status(400)
        .json({ message: "You have already reviewed this product." });
    }

    // Create a new review
    const review = new Review({
      product_id,
      user_name,
      user_image,
      rating,
      product_images,
      comment,
    });

    // Save the review to the database
    const savedReview = await review.save();

    res.status(201).json({
      message: "Review created successfully.",
      review: savedReview,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create review.",
      error: error.message,
    });
  }
};

// get all review

export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find();
    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
