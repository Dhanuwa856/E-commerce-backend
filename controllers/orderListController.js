import OrderList from "../models/orderList.js"; // Importing the OrderList model

// add to orders to order list
export const addOrderToOrderList = async (req, res) => {
  try {
    // Extract order details from the request body
    const { order_id, product_id, quantity, price } = req.body;

    // Extract user_email from the token (assumed to be added by authentication middleware)
    const user_email = req.user?.email; // `req.user` should contain token-decoded user info

    // Validation for required fields
    if (!order_id || !user_email || !product_id || !quantity || !price) {
      return res.status(400).json({
        message:
          "All fields are required: order_id, user_email (from token), product_id, quantity, price.",
      });
    }

    // Calculate total price
    const total_price = quantity * price;

    // Create a new order in the order list
    const newOrder = new OrderList({
      order_id,
      user_email,
      product_id,
      quantity,
      price,
      total_price,
    });

    // Save the new order to the database
    await newOrder.save();

    res.status(201).json({
      message: "Order added successfully to the order list.",
      order: newOrder,
    });
  } catch (err) {
    if (err.code === 11000) {
      // Handle unique constraint error for duplicate order_id or other unique fields
      return res.status(400).json({
        message:
          "Duplicate entry: Make sure order_id and product_id are unique.",
      });
    }
    res.status(500).json({
      message: "Failed to add the order to the order list.",
      error: err.message,
    });
  }
};

// Delete all items with the same order_id and user_email
export const deleteOrdersByOrderId = async (req, res) => {
  try {
    const { order_id } = req.params; // Extract order_id from URL params
    const user_email = req.user.email; // Extract user_email from token

    // Validation for required fields
    if (!order_id || !user_email) {
      return res.status(400).json({
        message: "order_id and user_email are required to delete the orders.",
      });
    }

    // Find and delete all orders with the same order_id and user_email
    const deletedOrders = await OrderList.deleteMany({
      order_id: order_id,
      user_email: user_email,
    });

    if (deletedOrders.deletedCount === 0) {
      return res.status(404).json({
        message: "No orders found with the specified order_id for this user.",
      });
    }

    res.status(200).json({
      message:
        "All orders with the specified order ID have been deleted successfully.",
      deletedCount: deletedOrders.deletedCount,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to delete the orders.",
      error: err.message,
    });
  }
};
