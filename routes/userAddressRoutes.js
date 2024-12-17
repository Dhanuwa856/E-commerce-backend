import express from "express";
import {
  addAddress,
  getAddressByEmail,
  updateAddress,
} from "../controllers/userAddressController.js";
import { checkCustomer, checkLoggedIn } from "../controllers/userController.js";

const addressRouter = express.Router();

addressRouter.post("/", checkLoggedIn, checkCustomer, addAddress);
addressRouter.put("/update/", checkLoggedIn, checkCustomer, updateAddress);
addressRouter.get(
  "/get-address",
  checkLoggedIn,
  checkCustomer,
  getAddressByEmail
);

export default addressRouter;
