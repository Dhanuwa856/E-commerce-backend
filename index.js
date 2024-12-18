import express from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import userRouter from "./routes/userRoutes.js";
import categoryRouter from "./routes/categoryRoutes.js";
import productRouter from "./routes/productRoutes.js";
import reviewRouter from "./routes/reviewRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import addressRouter from "./routes/userAddressRoutes.js";
import orderListRouter from "./routes/orderListRoutes.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json());

const connectionString = process.env.MONGO_URL;

app.use((req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (token != null) {
    jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
      if (decoded != null) {
        req.user = decoded;
        next();
      } else {
        next();
      }
    });
  } else {
    next();
  }
});

mongoose
  .connect(connectionString)
  .then(() => {
    console.log("conected to mongoDB");
  })
  .catch(() => {
    console.log("Conection Filed!");
  });

app.use("/api/users/", userRouter);
app.use("/api/category/", categoryRouter);
app.use("/api/products/", productRouter);
app.use("/api/reviews/", reviewRouter);
app.use("/api/orders/", orderRouter);
app.use("/api/user-address/", addressRouter);
app.use("/api/order-list", orderListRouter);

app.listen(5000, (req, res) => {
  console.log("Sever is runing on the port 5000");
});
