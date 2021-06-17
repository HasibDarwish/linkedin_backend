import tokenModel from "../schema/token.js";
import createError from "http-errors";
import {response} from "express";

const AuthorizeUser = async (req, res, next) => {
	try {
		if (req.headers.token) {
			const check = await tokenModel.find({
				token: req.headers.token,
			});
			if (check && check[0].token === req.headers.token) {
				next();
			} else {
				res.status(401).send("Unauthorized Access");
			}
		} else {
			res.status(401).send("Unauthorized Access");
		}
	} catch (error) {
		res.status(401).send("Unauthorized Access");
	}
};
export default AuthorizeUser;
