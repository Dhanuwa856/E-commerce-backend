import mongoose from "mongoose";

const categorySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  offer_percentage: {
    type: Number,
    default: 0,
    min: [0, "Offer percentage cannot be negative"],
    max: [100, "Offer percentage cannot exceed 100"],
  },
  price_adjustment: {
    type: Number,
    default: 0, // Default adjustment factor is 0 (no change)
  },
});

const Category = mongoose.model("category01", categorySchema);
export default Category;
