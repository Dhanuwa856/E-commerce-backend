import experss from "express";
import {
  createProduct,
  getLatestProducts,
  getProducts,
  getProductsByCategory,
} from "../controllers/productController.js";
import { checkAdmin, checkLoggedIn } from "../controllers/userController.js";

const productRouter = experss.Router();

productRouter.post("/", checkLoggedIn, checkAdmin, createProduct);
productRouter.get("/", getProducts);
productRouter.get("/latest-products", getLatestProducts);
productRouter.get("/category/:categoryName", getProductsByCategory);

export default productRouter;
