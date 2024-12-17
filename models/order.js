import mongoose from "mongoose";

const orderSchema = mongoose.Schema(
  {
    order_id: {
      type: Number,
      required: true,
      unique: true,
    },
    user_email: {
      type: String,
      required: true,
      trim: true,
    },
    products: [
      {
        product_id: {
          type: Number,
          required: true,
          ref: "Product",
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    total_price: {
      type: Number,
      required: true,
    },
    payment_status: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },
    shipping_address: {
      address_line1: { type: String, required: true },
      address_line2: { type: String },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zip_code: { type: String, required: true },
      country: { type: String, required: true },
    },
    payment_method: {
      type: String,
      default: "COD", // Cash on Delivery or Online Payment
    },
    order_status: {
      type: String,
      enum: ["Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Processing",
    },
    ordered_at: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt
);

const Order = mongoose.model("Order01", orderSchema);
export default Order;
