import express from "express";
import {
  createReview,
  deleteReview,
  getAllReviews,
  updateReview,
} from "../controllers/reviewController.js";
import { checkCustomer, checkLoggedIn } from "../controllers/userController.js";

const reviewRouter = express.Router();

reviewRouter.post("/:product_id", checkLoggedIn, checkCustomer, createReview);
reviewRouter.get("/", getAllReviews);
reviewRouter.put("/:review_id", checkLoggedIn, checkCustomer, updateReview);
reviewRouter.delete("/:review_id", checkLoggedIn, checkCustomer, deleteReview);

export default reviewRouter;
