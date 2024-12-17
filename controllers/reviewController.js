import Review from "../models/review.js"; // Assuming the Review model is in a separate file
import Product from "../models/product.js"; // Assuming the Product model is in a separate file

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

    // Auto-generate a unique review_id
    const lastReview = await Review.findOne().sort({ review_id: -1 });
    const review_id = lastReview ? lastReview.review_id + 1 : 2003;

    // Create a new review
    const review = new Review({
      product_id,
      user_name,
      user_image,
      review_id,
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

// Get all reviews with pagination
export const getAllReviews = async (req, res) => {
  const { page = 1, limit = 10 } = req.query; // Default to page 1, 10 reviews per page

  try {
    // Calculate the total number of reviews
    const totalReviews = await Review.countDocuments();

    // Fetch the reviews for the specified page
    const reviews = await Review.find()
      .skip((page - 1) * limit) // Skip reviews for previous pages
      .limit(parseInt(limit)) // Limit the number of reviews for the current page
      .sort({ createdAt: -1 }); // Sort reviews by most recent

    res.status(200).json({
      totalReviews,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalReviews / limit),
      reviews,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch reviews.", error: err.message });
  }
};

// update review
export const updateReview = async (req, res) => {
  const { review_id } = req.params; // Get review ID from the request parameters
  const { rating, comment, product_images } = req.body; // Get update data from the request body

  try {
    // Find the review by review_id
    const review = await Review.findOne({ review_id });
    if (!review) {
      return res.status(404).json({ message: "Review not found." });
    }

    // Check if the logged-in user is the owner of the review
    const { userName: user_name } = req.user; // Extract username from the token
    if (review.user_name !== user_name) {
      return res.status(403).json({
        message: "You are not authorized to update this review.",
      });
    }

    // Update the review with the provided data
    if (rating !== undefined) review.rating = rating;
    if (comment !== undefined) review.comment = comment;
    if (product_images !== undefined) review.product_images = product_images;

    const updatedReview = await review.save();

    res.status(200).json({
      message: "Review updated successfully.",
      review: updatedReview,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update the review.",
      error: error.message,
    });
  }
};

// delete review
export const deleteReview = async (req, res) => {
  const { review_id } = req.params; // Get the review ID from the request parameters

  try {
    // Find the review by review_id
    const review = await Review.findOne({ review_id });
    if (!review) {
      return res.status(404).json({ message: "Review not found." });
    }

    // Check if the logged-in user is the owner of the review
    const { userName: user_name } = req.user; // Extract username from the token
    if (review.user_name !== user_name) {
      return res.status(403).json({
        message: "You are not authorized to delete this review.",
      });
    }

    // Delete the review
    await Review.deleteOne({ review_id });

    res.status(200).json({
      message: "Review deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete the review.",
      error: error.message,
    });
  }
};
