import Order from "../models/order.js";
import Product from "../models/product.js";
import moment from "moment";

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

// get dashboard data
export const getDashboardMetrics = async (req, res) => {
  try {
    // Get today's date range (start and end of the day)
    const startOfDay = moment().startOf("day").toDate();
    const endOfDay = moment().endOf("day").toDate();

    // Get the total product count
    const productCount = await Product.countDocuments();

    // Count the number of orders placed today
    const ordersToday = await Order.countDocuments({
      ordered_at: { $gte: startOfDay, $lt: endOfDay },
    });

    // Calculate total revenue from delivered orders
    const totalRevenueData = await Order.aggregate([
      { $match: { order_status: "Delivered" } }, // Filter only "Delivered" orders
      { $group: { _id: null, totalRevenue: { $sum: "$total_price" } } },
    ]);
    const totalRevenue = totalRevenueData[0]?.totalRevenue
      ? Math.round(totalRevenueData[0].totalRevenue)
      : 0; // Round to the nearest whole number

    // Return the combined metrics as a response
    res.status(200).json({
      productCount,
      ordersToday,
      totalRevenue,
    });
  } catch (error) {
    console.error("Error fetching dashboard metrics: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// getdashboard chart data
export const getChartData = async (req, res) => {
  try {
    const currentDate = moment(); // Get the current date
    const sixMonthsAgo = currentDate.clone().subtract(5, "months"); // Calculate six months ago

    // Sales Data for Line Chart (Last 6 Months)
    const salesData = await Order.aggregate([
      {
        $match: {
          order_status: "Delivered",
          ordered_at: {
            $gte: sixMonthsAgo.toDate(), // Include orders from 6 months ago
            $lte: currentDate.toDate(), // Up to the current date
          },
        },
      },
      {
        $group: {
          _id: { $month: "$ordered_at" }, // Group by month
          totalSales: { $sum: "$total_price" },
        },
      },
      { $sort: { _id: 1 } }, // Sort by month
    ]);

    const salesByMonth = Array(6).fill(0); // Initialize an array for 6 months
    salesData.forEach((entry) => {
      const monthIndex =
        currentDate.clone().subtract(5, "months").month() + entry._id - 1;
      if (monthIndex >= 0 && monthIndex < 6) {
        salesByMonth[monthIndex] = entry.totalSales;
      }
    });

    // Order Status for Bar Chart
    const orderStatusData = await Order.aggregate([
      {
        $group: {
          _id: "$order_status",
          count: { $sum: 1 },
        },
      },
    ]);

    const orderStatusCounts = {
      Pending: 0,
      Shipped: 0,
      Canceled: 0,
      Delivered: 0,
    };

    orderStatusData.forEach((entry) => {
      orderStatusCounts[entry._id] = entry.count;
    });

    // Category Performance for Doughnut Chart
    const categoryPerformanceData = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
    ]);

    const categories = [];
    const categoryCounts = [];
    categoryPerformanceData.forEach((entry) => {
      categories.push(entry._id);
      categoryCounts.push(entry.count);
    });

    // Send data to frontend
    res.status(200).json({
      sales: salesByMonth, // Return data for the last 6 months
      orderStatus: Object.values(orderStatusCounts),
      categories,
      categoryCounts,
    });
  } catch (error) {
    console.error("Error fetching chart data: ", error);
    res.status(500).json({ message: "Failed to fetch chart data" });
  }
};
