import experss from "express";
import {
  crateCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../controllers/categoryController.js";
import { checkAdmin, checkLoggedIn } from "../controllers/userController.js";

const categoryRouter = experss.Router();

categoryRouter.post("/", checkLoggedIn, checkAdmin, crateCategory);
categoryRouter.get("/", getCategories);
categoryRouter.put("/:name", checkLoggedIn, checkAdmin, updateCategory);
categoryRouter.delete("/:name", checkLoggedIn, checkAdmin, deleteCategory);

export default categoryRouter;
