import express from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";

dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json());

const connectionString = process.env.MONGO_URL;

mongoose
  .connect(connectionString)
  .then(() => {
    console.log("conected to mongoDB");
  })
  .catch(() => {
    console.log("Conection Filed!");
  });

app.listen(5000, (req, res) => {
  console.log("Sever is runing on the port 5000");
});
