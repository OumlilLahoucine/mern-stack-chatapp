const express = require("express");
const app = express();
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");
const invitationRouter = require("./routes/invitationRoutes");
const messageRouter = require("./routes/messageRoutes");
const globalErrorHandler = require("./controllers/errorController");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");

const limiter = rateLimit({
  max: 20,
  windowMs: 60 * 60 * 1000,
  handler: (req, res) => {
    res.status(429).json({
      status: 429,
      message: "Too many requests, please try again after 1 hour.",
    });
  },
});

// MiddleWares
app.use(helmet());
app.use(morgan("tiny"));
app.use(
  cors({
    origin: "https://mern-stack-chatapp-ten.vercel.app",
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use("/api/v1/auth", limiter);
app.use(express.json());
app.use(mongoSanitize());
app.use(xss());
app.use(express.static("public"));

// Route MiddleWares
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/invitations", invitationRouter);
app.use("/api/v1/messages", messageRouter);

// Unhandled Route
app.all("*", (req, res, next) => {
  res
    .status(404)
    .json({ status: "fail", message: `${req.originalUrl} not found` });
});

app.use(globalErrorHandler);

module.exports = app;
