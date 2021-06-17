import { Router } from "express";
import createError from "http-errors";

import experienceModel from "../schema/experience.js";
import profileModel from "../schema/profile.js";

const experienceRouter = Router();

experienceRouter.post(
  "/profile/:userName/experiences",
  async (req, res, next) => {
    try {
      const newExperience = req.body;
      const isProfile = await profileModel.find({
        username: req.params.userName,
      });
      if (isProfile[0]._id) {
        const request = await profileModel.findByIdAndUpdate(
          isProfile[0]._id,
          { $push: { experiences: newExperience } },
          { new: true }
        );
        res
          .status(201)
          .send(request.experiences[request.experiences.length - 1]._id);
      } else {
        next(createError(404, `Username ${req.params.userName} is not found`));
      }
    } catch (error) {
      next(eror);
    }
  }
);
experienceRouter.get(
  "/profile/:userName/experiences",
  async (req, res, next) => {
    try {
      const isProfile = await profileModel.findOne({
        username: req.params.userName,
      });

      isProfile
        ? isProfile.experiences.length > 0
          ? res.send(isProfile.experiences)
          : res.status(404).send("exp not found")
        : res.status(404).send("profile not here");
    } catch (error) {
      next(error);
    }
  }
);

experienceRouter.get(
  "/profile/:userName/experiences/:expId",
  async (req, res, next) => {
    try {
      const isProfile = await profileModel.findOne({
        username: req.params.userName,
        "experiences._id": req.params.expId,
      });

      if (isProfile) {
        const experiences = isProfile.experiences;
        const experience = experiences.filter(
          (exp) => exp._id.toString() === req.params.expId
        )[0];
        res.send(experience);
      } else {
        next(
          createError(
            404,
            `Experience with ID: ${req.params.expId} is not found`
          )
        );
      }
    } catch (error) {
      // console.log(error);
      next(error);
    }
  }
);

experienceRouter.put(
  "/profile/:userName/experiences/:expId",
  async (req, res, next) => {
    try {
      const isProfile = await profileModel.findOne({
        username: req.params.userName,
        "experiences._id": req.params.expId,
      });

      if (isProfile) {
        const { experiences } = isProfile;
        let oldExp = experiences.find(
          (exp) => exp._id.toString() === req.params.expId
        );
        const { body } = req;
        const newObject = oldExp.toObject();
        const newExp = { ...newObject, ...body };
        console.log("NEW EXP", newExp);
        res.send(newExp);
      } else {
        const error = new Error("No Profile");
        next(error);
      }
    } catch (error) {
      next(error);
    }
  }
);

experienceRouter.delete(
  "/profile/:userName/experiences/:expId",
  async (req, res, next) => {
    try {
      const isProfile = await profileModel.findOne({
        username: req.params.userName,
        "experiences._id": req.params.expId,
      });
      console.log(isProfile);

      if (isProfile) {
        const profile = await profileModel.findOneAndUpdate(
          { username: req.params.userName },
          { $pull: { experiences: { _id: req.params.expId } } }
        );

        if (profile) {
          res.status(204).send(profile);
        } else {
          res.status(404).send("could not delete");
        }
      } else {
        next(
          createError(
            404,
            `Experience with ID: ${req.params.expId} is not found`
          )
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

export default experienceRouter;
