import { Router } from "express";
import { userService } from "../index.js";
import { successResponse } from "../../Common/index.js";

const userRouter = Router();

userRouter.get("/", async (req, res) => {
  console.log(req.query);
  const users = await userService.getUsers(req.query);
  successResponse({ res, data: users });
});

userRouter.patch("/:id", async (req, res) => {
  console.log({ params: req.params, body: req.body });
  const updatedUser = await userService.updateUser(req.params.id, req.body);
  successResponse({ res, data: updatedUser });
});
export default userRouter;
