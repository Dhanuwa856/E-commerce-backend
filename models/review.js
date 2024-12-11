import mongoose from "mongoose";

const reviewSchema = mongoose.Schema(
  {
    product_id: {
      type: Number,
      required: true,
      ref: "Product", // Reference to the Product model
    },
    user: {
      type: String,
      required: true,
      trim: true,
    },
    rating: {
      type: Number,
      required: true,
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
    },
    comment: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt timestamps
  }
);

const Review = mongoose.model("Review", reviewSchema);
export default Review;
