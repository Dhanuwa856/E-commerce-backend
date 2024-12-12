import express from "express";
import {
  createReview,
  getAllReviews,
} from "../controllers/reviewController.js";
import { checkCustomer, checkLoggedIn } from "../controllers/userController.js";

const reviewRouter = express.Router();

reviewRouter.post("/:product_id", checkLoggedIn, checkCustomer, createReview);
reviewRouter.get("/", getAllReviews);

export default reviewRouter;
