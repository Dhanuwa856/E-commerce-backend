import express from "express";
import {
  createOrder,
  getAllOrders,
  getChartData,
  getDashboardMetrics,
  getOrdersByEmail,
  getTopOrderedProducts,
  updateOrderStatus,
} from "../controllers/orderController.js";
import {
  checkAdmin,
  checkCustomer,
  checkEmailVerified,
  checkLoggedIn,
} from "../controllers/userController.js";

const orderRouter = express.Router();

orderRouter.post(
  "/",
  // checkLoggedIn,
  // checkCustomer,
  // checkEmailVerified,
  createOrder
);
orderRouter.get(
  "/by-email/:email/",
  checkLoggedIn,
  checkCustomer,
  getOrdersByEmail
);
orderRouter.get("/all", getAllOrders);
orderRouter.put(
  "/:order_id/status",
  checkLoggedIn,
  checkAdmin,
  updateOrderStatus
);
orderRouter.get("/dashboard-metrics", getDashboardMetrics);
orderRouter.get("/get-dash-chart", getChartData);
orderRouter.get("/top-ordered-products", getTopOrderedProducts);

export default orderRouter;
