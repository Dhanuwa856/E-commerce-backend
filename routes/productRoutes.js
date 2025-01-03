import experss from "express";
import {
  createProduct,
  deleteProductById,
  getLatestProducts,
  getProductById,
  getProducts,
  getProductsByCategory,
  updateProductById,
} from "../controllers/productController.js";
import {
  checkAdmin,
  checkCustomer,
  checkLoggedIn,
} from "../controllers/userController.js";

const productRouter = experss.Router();

productRouter.post("/", checkLoggedIn, checkAdmin, createProduct);
productRouter.get("/", getProducts);
productRouter.get("/latest-products", getLatestProducts);
productRouter.get("/category/", getProductsByCategory);
productRouter.put("/:productId", checkLoggedIn, checkAdmin, updateProductById);
productRouter.delete(
  "/:productId",
  checkLoggedIn,
  checkAdmin,
  deleteProductById
);
productRouter.get("/:productId", getProductById);

export default productRouter;
