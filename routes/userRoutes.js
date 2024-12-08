import express from "express";
import {
  checkAdmin,
  checkLoggedIn,
  createUser,
  getUsers,
  loginUser,
} from "../controllers/userController.js";

const userRouter = express.Router();
userRouter.post("/", createUser);
userRouter.get("/", checkLoggedIn, checkAdmin, getUsers);
userRouter.post("/login", loginUser);

export default userRouter;
