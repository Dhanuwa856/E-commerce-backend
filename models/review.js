import mongoose from "mongoose";

const reviewSchema = mongoose.Schema(
  {
    product_id: {
      type: Number,
      required: true,
      ref: "Product", // Reference to the Product model
    },
    user_name: {
      type: String,
      required: true,
      trim: true,
    },
    user_image: {
      type: String,
      required: true,
    },
    product_images: [
      {
        type: String,
        required: false,
      },
    ],
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
