export const badRequestHandler = function (error, req, res, next) {
  try {
    if (error.statusCode === 400) {
      res.send(error.message || "Bad Request");
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
      res.send(error.message || "Unauthorized");
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
      res.send(error.message || "Forbidden");
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
      res.send(error.message || "Not Found");
    } else {
      next(error);
    }
  } catch (error) {
    next(error);
  }
};

export const catchAllHandler = function (error, req, res, next) {
  if (error.status === 500 || error.status !== 500) console.log(error.message);
  res.status(500).send("SERVER ERROR");
};
