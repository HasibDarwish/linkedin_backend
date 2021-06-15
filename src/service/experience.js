import { Router } from "express";
import createError from "http-errors";

import experienceModel from "../schema/experience.js";

const experienceRouter = Router();

experienceRouter.post(
  "/profile/userName/experiences",
  async (req, res, next) => {
    try {
      const request = await experienceModel(req.body);
      const newExp = await request.save();
      newExp
        ? res.status(201).send(newExp._id)
        : next(createError(400, "Bad request"));
    } catch (error) {
      if (error.name === "ValidationError") {
        console.log(error.message);
        next(createError(400, error.message));
      } else {
        console.log(error);
        next(error);
      }
    }
  }
);

experienceRouter.get("/profile/experiences", async (req, res, next) => {
  try {
    const request = await experienceModel.find();
    res.send(request);
  } catch (error) {
    next(error);
  }
});

// experienceRouter.get(
//   "/profile/userName/experiences",
//   async (req, res, next) => {
//     try {
//     } catch (error) {
//       next(error);
//     }
//   }
// );
// experienceRouter.put(
//   "/profile/userName/experiences",
//   async (req, res, next) => {
//     try {
//     } catch (error) {
//       next(error);
//     }
//   }
// );
// experienceRouter.delete(
//   "/profile/userName/experiences",
//   async (req, res, next) => {
//     try {
//     } catch (error) {
//       next(error);
//     }
//   }
// );
export default experienceRouter;
