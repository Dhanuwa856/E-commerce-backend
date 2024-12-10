import experss from "express";
import {
  createProduct,
  getProducts,
} from "../controllers/productController.js";
import { checkAdmin, checkLoggedIn } from "../controllers/userController.js";

const productRouter = experss.Router();

productRouter.post("/", checkLoggedIn, checkAdmin, createProduct);
productRouter.get("/", getProducts);
export default productRouter;
