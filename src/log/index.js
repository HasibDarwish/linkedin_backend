export const logMiddleWare = (req, res, next) => {
	newLog = {
		Token: `${req.headers.Authorization}`,
		Method: `${req.method}`,
		URL: `${req.url}`,
		Time: `${new Date()}`,
	};
	next();
};
