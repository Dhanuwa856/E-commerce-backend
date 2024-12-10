import mongoose from "mongoose";

const productSchema = mongoose.Schema(
  {
    product_id: {
      type: Number,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },
    category: {
      type: String,
      required: true,
    },
    stock: {
      type: Number,
      required: [true, "Product stock is required"],
      min: [0, "Stock cannot be negative"],
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    brand: {
      type: String,
      trim: true,
    },
    ratings: {
      type: Number,
      default: 0,
      min: [0, "Rating cannot be less than 0"],
      max: [5, "Rating cannot exceed 5"],
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    offer_percentage: {
      type: Number,
      default: 0,
      min: [0, "Offer percentage cannot be negative"],
      max: [100, "Offer percentage cannot exceed 100"],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }, // Include virtuals in JSON output
    toObject: { virtuals: true }, // Include virtuals in Object output
  }
);

// Virtual field for final price
productSchema.virtual("finalPrice").get(function () {
  const discountedPrice =
    this.price - (this.price * this.offer_percentage) / 100;
  return parseFloat(discountedPrice.toFixed(2)); // Round to two decimal places and convert back to number
});

const Product = mongoose.model("Product", productSchema);
export default Product;
