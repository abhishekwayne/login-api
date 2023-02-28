const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
var path = require("path");

const userRouter = require("./routes/user");

const app = express();
app.use(cors());
app.use(morgan("short"));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/", userRouter);

app.all("*", (req, res, next) => {
  res.status(404).json({
    status: "fail",
    message: `Can't find ${req.originalUrl} on this server`,
  });
  next();
});

module.exports = app;
