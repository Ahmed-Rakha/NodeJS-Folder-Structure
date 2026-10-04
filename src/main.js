import express from "express";
import { bootstrapDB, DB } from "./DB/connection.db.js";
// import { successResponse } from "./Common/index.js";
import userRouter from "./Modules/User/user.controller.js";
import productRouter from "./Modules/Product/product.controller.js";
import { globalErrorHandler } from "./middleware/error.middleware.js";

const app = express();

//=================================MIDDLEWARES==================================
app.use(express.json());

//=================================ROUTES==================================

app.use("/user", userRouter);
app.use("/product", productRouter);

//=================================DB CONNECTION & SERVER==================================
await bootstrapDB(app);
//=================================NOT FOUND ROUTE==================================
app.all("/{*dummy}", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

//=================================ERROR HANDLER==================================
app.use(globalErrorHandler);
