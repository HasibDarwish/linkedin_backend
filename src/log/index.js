import logModel from "../schema/log.js";
import tokenModel from "../schema/token.js";

export const trackEndpoints = async (req, res, next) => {
	const info = await tokenModel.findOne({token: req.headers.token});
	const token = req.headers.token;
	const client = {
		TOKEN: token ? token : "Anonymous@Unauthorized@Access",
		EMAIL: info ? info.email : "Anonymous@UnauthorizedAccess.com",
		REQUEST_METHOD: req.method,
		USER_AGENT: req.headers["user-agent"],
		ACCEPT_ENCODING: req.headers["accept-encoding"],
		BASE_URL: req.headers.host,
		ROUTE_URL: req.url,
	};
	const writeLog = await logModel(client);
	const saveLog = writeLog.save();
	next();
};
