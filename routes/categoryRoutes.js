import experss from "express";
import {
  adjustCategoryPrices,
  crateCategory,
  deleteCategory,
  getCategories,
  updateCategory,
  updateCategoryOffer,
} from "../controllers/categoryController.js";
import { checkAdmin, checkLoggedIn } from "../controllers/userController.js";

const categoryRouter = experss.Router();

categoryRouter.post("/", checkLoggedIn, checkAdmin, crateCategory);
categoryRouter.get("/", getCategories);
categoryRouter.put("/:name", checkLoggedIn, checkAdmin, updateCategory);
categoryRouter.delete("/:name", checkLoggedIn, checkAdmin, deleteCategory);
categoryRouter.patch(
  "/:categoryName",
  checkLoggedIn,
  checkAdmin,
  updateCategoryOffer
);
categoryRouter.post(
  "/:categoryName",
  checkLoggedIn,
  checkAdmin,
  adjustCategoryPrices
);

export default categoryRouter;
