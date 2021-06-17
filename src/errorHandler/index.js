export const badRequestHandler = function (error, req, res, next) {
	try {
		if (error.statusCode === 400) {
			res.status(400).send(error.message || "Bad Request");
		} else {
			next(error);
		}
	} catch (error) {
		next(error);
	}
};

export const unAuthorizedHandler = function (error, req, res, next) {
	try {
		if (error.status === 401) {
			res.status(401).send(error.message || "Unauthorized");
		} else {
			next(error);
		}
	} catch (error) {
		next(error);
	}
};

export const forBiddenHandler = function (error, req, res, next) {
	try {
		if (error.status === 403) {
			res.status(403).send(error.message || "Forbidden");
		} else {
			next(error);
		}
	} catch (error) {
		next(error);
	}
};

export const notFoundHandler = function (error, req, res, next) {
	try {
		if (error.status === 404) {
			res.status(404).send(error.message || "Not Found");
		} else {
			next(error);
		}
	} catch (error) {
		next(error);
	}
};

export const catchAllHandler = function (error, req, res, next) {
	if (error.status === 500 || error.status !== 500)
		res.status(500).send("Server on fire!");
};
