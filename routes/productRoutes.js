import experss from "express";
import {
  createProduct,
  deleteProductById,
  getLatestProducts,
  getProducts,
  getProductsByCategory,
  updateProductById,
} from "../controllers/productController.js";
import { checkAdmin, checkLoggedIn } from "../controllers/userController.js";

const productRouter = experss.Router();

productRouter.post("/", checkLoggedIn, checkAdmin, createProduct);
productRouter.get("/", getProducts);
productRouter.get("/latest-products", getLatestProducts);
productRouter.get("/category/:categoryName", getProductsByCategory);
productRouter.put("/:productId", checkLoggedIn, checkAdmin, updateProductById);
productRouter.delete(
  "/:productId",
  checkLoggedIn,
  checkAdmin,
  deleteProductById
);

export default productRouter;
