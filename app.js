const cors = require("cors");
const express = require("express");
const app = express();
var path = require("path");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

global.__basedir = __dirname;

var corsOptions = {
  origin: "http://localhost:5000",
  origin: "http://localhost:3000",
};

app.use(cors(corsOptions));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "frontend", "build")));

const initRoutes = require("./mvc/routes");

app.use(express.urlencoded({ extended: true }));
initRoutes(app);

app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "frontend", "build", "index.html"));
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
