import mongoose from "mongoose"; // Correct import name

const orderListSchema = new mongoose.Schema(
  {
    order_id: {
      type: Number,
      required: true,
    },
    user_email: {
      type: String,
      required: true,
      trim: true,
    },
    product_id: {
      type: Number,
      required: true,
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
    total_price: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

const OrderList = mongoose.model("OrderList", orderListSchema);
export default OrderList;
