import Order from "../models/order.js";

// Create order
export const createOrder = async (req, res) => {
  const { products, total_price, shipping_address, payment_method } = req.body;

  try {
    // Extract user email from the token (assuming middleware attaches user info to req.user)
    const user_email = req.user?.email;
    if (!user_email) {
      return res
        .status(401)
        .json({ message: "Unauthorized. User email is missing." });
    }

    // Generate a unique order_id
    const lastOrder = await Order.findOne().sort({ order_id: -1 });
    const order_id = lastOrder ? lastOrder.order_id + 1 : 100001;

    // Validate the products array
    if (!products || products.length === 0) {
      return res.status(400).json({ message: "Products cannot be empty." });
    }

    // Create a new order
    const newOrder = new Order({
      order_id,
      user_email,
      products,
      total_price,
      shipping_address,
      payment_method,
    });

    // Save the order to the database
    const savedOrder = await newOrder.save();

    res.status(201).json({
      message: "Order created successfully.",
      order: savedOrder,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create order.",
      error: error.message,
    });
  }
};

// Get orders by email
export const getOrdersByEmail = async (req, res) => {
  const { email } = req.params;
  const { page = 1, pageSize = 10 } = req.query; // Default page = 1, pageSize = 10

  try {
    // Validate page and pageSize inputs
    const pageNumber = parseInt(page, 10);
    const size = parseInt(pageSize, 10);

    if (isNaN(pageNumber) || isNaN(size) || pageNumber <= 0 || size <= 0) {
      return res
        .status(400)
        .json({ message: "Invalid page or pageSize value." });
    }

    // Find the total number of orders for the user
    const totalOrders = await Order.countDocuments({ user_email: email });

    if (totalOrders === 0) {
      return res
        .status(404)
        .json({ message: "No orders found for this email." });
    }

    // Calculate pagination details
    const totalPages = Math.ceil(totalOrders / size);
    if (pageNumber > totalPages) {
      return res
        .status(404)
        .json({ message: "Page number exceeds total pages." });
    }

    // Fetch paginated orders
    const orders = await Order.find({ user_email: email })
      .skip((pageNumber - 1) * size)
      .limit(size);

    res.status(200).json({
      message: "Orders retrieved successfully.",
      orders,
      pagination: {
        totalOrders,
        totalPages,
        currentPage: pageNumber,
        pageSize: size,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve orders.",
      error: error.message,
    });
  }
};

// Get all orders
export const getAllOrders = async (req, res) => {
  try {
    // Fetch all orders
    const orders = await Order.find(); // Add await to ensure orders are fetched

    res.status(200).json({
      message: "Orders retrieved successfully.",
      orders,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to retrieve orders.",
      error: err.message,
    });
  }
};

// update order status
export const updateOrderStatus = async (req, res) => {
  const { order_id } = req.params; // Get the order_id from the request parameters
  const { order_status } = req.body; // Get the new status from the request body

  try {
    // Validate the provided order_status
    const validStatuses = ["Processing", "Shipped", "Delivered", "Cancelled"];
    if (!validStatuses.includes(order_status)) {
      return res.status(400).json({
        message: `Invalid order_status. Valid values are: ${validStatuses.join(
          ", "
        )}.`,
      });
    }

    // Find and update the order by order_id
    const updatedOrder = await Order.findOneAndUpdate(
      { order_id }, // Find order by order_id
      { order_status }, // Update the order_status
      { new: true, runValidators: true } // Return the updated document and validate inputs
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found." });
    }

    res.status(200).json({
      message: "Order status updated successfully.",
      order: updatedOrder,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update order status.",
      error: error.message,
    });
  }
};
