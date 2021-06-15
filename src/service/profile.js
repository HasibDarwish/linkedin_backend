import { Router } from "express";
import profileModel from "../schema/profile.js";
import createError from "http-errors";
import multer from "multer";
import {v2 as cloudinary} from "cloudinary";
import {CloudinaryStorage} from "multer-storage-cloudinary";

const profileRouter = Router();

profileRouter.get("/profile", async (req, res, next) => {
	try {
		const request = await profileModel.find();
		if (request && request.length > 0) {
			res.send(request);
		} else {
			next(createError(404, "Not Found"));
		}
	} catch (error) {
		next(createError(400, "Bad Request"));
	}
});

profileRouter.get("/profile/:id", async (req, res, next) => {
	try {
		const _id = req.params.id;
		const request = await profileModel.findById(_id);
		if (request) {
			res.send(request);
		} else {
			next(createError(404, `Profile with ${req.params.id} Id Not Found`));
		}
	} catch (error) {
		if (error.name === "CastError") {
			next(createError(404, `Profile with ${req.params.id} Id Not Found`));
		} else {
			next(createError(400, "Bad Request"));
		}
	}
});

profileRouter.post("/profile", async (req, res, next) => {
	try {
		const request = await profileModel(req.body);
		const newProfile = await request.save();
		if (newProfile) {
			res.send(newProfile._id);
		} else {
			next(createError(400, "Bad Request"));
		}
	} catch (error) {
		if (error.name === "ValidationError") {
			const Error = {
				message: error._message,
				field: error.message,
			};
			res.send(Error);
		} else if (error.name === "MongoError") {
			const id = Object.keys(error.keyValue);
			const Error = {
				id: error.keyValue[id],
				Code: error.code,
				ErrorType: "Duplicating Value",
				Advice: "Change Key Value",
			};
			res.send(Error);
		} else {
			next(createError(500, "Generic Internal Server Error"));
		}
	}
});

profileRouter.put("/profile/:id", async (req, res, next) => {
	try {
		const _id = req.params.id;
		const request = await profileModel.findByIdAndUpdate(_id, req.body, {
			runValidator: true,
			new: true,
		});
		if (request) {
			const response = await { _id, Operation: "updated" };
			res.send(response);
		} else {
			next(createError(404, `Profile with ${req.params.id} Id Not Found`));
		}
	} catch (error) {
		if (error.name === "ValidationError") {
			next(createError(400, { error }));
		} else {
			next(createError(500, "Genric Internal Server Error"));
		}
	}
});

profileRouter.delete("/profile/:id", async (req, res, next) => {
	try {
		const _id = req.params.id;
		const getProfile = await findById(_id);
		await cloudinary.uploader.destroy(
			`${getProfile.image}`,
			() => "IMG Deleted"
		);
		const request = await profileModel.findByIdAndDelete(_id);
		if (request) {
			const response = await { _id, Operation: "Deleted" };
			res.send(response);
		} else {
			next(createError(404, `Profile with ${req.params.id} Id Not Found`));
		}
	} catch (error) {
		next(createError(404, `Profile with ${req.params.id} Id Not Found`));
	}
});

const cloudinaryStorage = new CloudinaryStorage({
	cloudinary,
	params: {
		folder: "Profile_Picture",
	},
});

const upload = multer({storage: cloudinaryStorage}).single("profile");

profileRouter.post("/profile/:id/picture", upload, async (req, res, next) => {
	try {
		const _id = req.params.id;
		const request = await profileModel.findByIdAndUpdate(
			_id,
			{image: req.file.path},
			{new: true}
		);
		if (request) {
			const response = await {
				_id: _id,
				Link: req.file.path,
				Operation: "image updated",
			};
			res.send(response);
		} else {
			next(createError(404, `Profile With ${_id} _id Not Found`));
		}
	} catch (error) {
		next(createError(500, "Server is on Fire"));
	}
});

export default profileRouter;
