import { Router } from "express";
import { successResponse } from "../../Common/index.js";
import { productService } from "../index.js";
import { UnprocessableEntityException } from "../../Common/Exceptions/error.exceptions.js";

const productRouter = Router();

productRouter.get("/", async (req, res) => {
  res.json({ message: "Product route is working!" });
});

productRouter.patch("/:id", async (req, res) => {
  console.log({ params: req.params, body: req.body });
  const updatedProduct = await productService.updateProduct({
    id: req.params.id,
    ...req.body,
  });
  res.json({ message: "Product updated successfully!" });
  successResponse({ res, data: { message: "Product updated successfully!" } });
});

productRouter.post("/", async (req, res) => {
  //   console.log({ body: req.body });
  const result = await productService.createProduct(req.body);
  const { total, inserted, failed } = result.summary;

  if (failed === 0) {
    successResponse({
      res,
      status: 201,
      message: "All products created successfully!",
      data: result,
    });
  } else if (inserted === 0) {
    throw UnprocessableEntityException({
      message: "Validation failed !!!!",
      issues: result.failedDocs,
    });
  } else {
    successResponse({
      res,
      status: 207,
      message: `${inserted} of ${total} products created, ${failed} failed.`,
      data: result,
    });
  }
});

export default productRouter;
