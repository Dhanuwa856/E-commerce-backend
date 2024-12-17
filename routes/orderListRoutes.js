import experss from "express";
import {
  addOrderToOrderList,
  deleteOrdersByOrderId,
} from "../controllers/orderListController.js";
import { checkCustomer, checkLoggedIn } from "../controllers/userController.js";

const orderListRouter = experss.Router();

orderListRouter.post("/", checkLoggedIn, addOrderToOrderList);
orderListRouter.delete("/:order_id", deleteOrdersByOrderId);

export default orderListRouter;
