const AppError = require("./../utils/appError");

const sendErrorProd = (err, res) => {
  if (err.isOperational)
    res
      .status(err.statusCode)
      .json({ status: err.status, message: err.message });
  else
    res
      .status(err.statusCode)
      .json({ status: err.status, message: "Something went wrong!" });
};

const sendErrorDev = (err, res) => {
  res
    .status(err.statusCode)
    .json({ status: err.status, message: err.message, err });
};

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  // const value = err.errmsg.match(/(?:"[^"]*"|^[^"]*$)/)[0].replace(/"/g, "");
  // const message = `${value} is already used. Please use anoher email`;
  const message = "Email already used. Please use another email";
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const values = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data: ${values.join(" - ")}`;
  return new AppError(message, 400);
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = err;
    if (error.name === "CastError") error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === "ValidationError")
      error = handleValidationErrorDB(error);

    if (error.name === "JsonWebTokenError")
      error = new AppError("Invalid token. Please log in again", 401);

    if (error.name === "TokenExpiredError")
      error = new AppError("Expired token. Please log in again", 401);

    sendErrorProd(error, res);
  }
};
