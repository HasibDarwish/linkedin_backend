import {Router} from "express";
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
					{$push: {experiences: newExperience}},
					{new: true}
				);
				res.send(request);
			} else {
				next(createError(404, `Username ${req.params.userName} is not found`));
			}
		} catch (error) {
			console.log(error);
		}

		// 	if (isProfile) {
		// 		const request = new experienceModel(req.body);
		// 		const newExp = await request.save();
		// 		res.status(201).send(newExp._id);
		// 	} else {
		// 		next(createError(400, "Bad request"));
		// 	}
		// } catch (error) {
		// 	if (error.name === "ValidationError") {
		// 		console.log(error.message);
		// 		next(createError(400, error.message));
		// 	} else {
		// 		console.log(error);
		// 		next(error);
		// 	}
		// }
	}
);

experienceRouter.get(
	"/profile/:userName/experiences/:id",
	async (req, res, next) => {
		try {
			const request = await experienceModel
				.findById(req.params.id)
				.populate("username");
			res.send(request);
		} catch (error) {
			console.log(error);
			next(error);
		}
	}
);

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
