import {Router} from "express";
import tokenModel from "../schema/token.js";
import {v4 as uid} from "uuid";
import createErorr from "http-errors";

const tokenRouter = Router();

tokenRouter.post("/generateToken", async (req, res, next) => {
	try {
		const payload = req.body;
		if (payload.email && payload.password) {
			const user = {
				...payload,
				token: uid(),
			};
			const register = await tokenModel(user);
			const newUser = await register.save();
			res.send(newUser);
		} else {
			next(createErorr(400, "Bad Request"));
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

tokenRouter.put("/generateToken", async (req, res, next) => {
	try {
		const payload = req.body;
		if (payload.email && payload.password) {
			const check = await tokenModel.find({
				email: payload.email,
			});
			try {
				if (
					check &&
					check[0].email === payload.email &&
					check[0].password === payload.password
				) {
					const update = await tokenModel.findByIdAndUpdate(
						check[0]._id,
						{token: uid()},
						{runValidator: true, new: true}
					);
					res.send(update.token);
				} else {
					next(createErorr(401, "Unauthorized Access"));
				}
			} catch (error) {
				next(createErorr(401, "Unauthorized Access"));
			}
		} else {
			next(createErorr(400, "Bad Request"));
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

export default tokenRouter;
