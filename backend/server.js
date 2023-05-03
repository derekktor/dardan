// if starting server from backend folder
// const dotenv = require("dotenv").config({ path: "../.env" });
// if starting server from root folder
const dotenv = require("dotenv").config();
const path = require("path");
const express = require("express");
const { logger, logEvents } = require("./middleware/logger");
const { errorHandler } = require("./middleware/errorMiddleware.js");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const corsOptions = require("./config/corsOptions");
const connectDB = require("./config/db.js");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 5001;

connectDB();

const app = express();

// MIDDLEWARES
// log every req sent to the server
app.use(logger);
// enable cross origin resource sharing, so others can access the server's resources`
// app.use(cors(corsOptions));
app.use(cors());
// parse cookies
app.use(cookieParser());
// look for static files in folder called public
app.use("/", express.static(path.join(__dirname, "public")));
// parse any json so the server understands it
app.use(express.json());
// parse parameters sent request body
app.use(express.urlencoded({ extended: false }));

// ROUTES
// send root.js file when client sends req
app.use("/", require("./routes/root.js"));
app.use("/users", require("./routes/usersRoute.js"));
app.use("/orders", require("./routes/ordersRoute.js"));
// send 404 page
app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ message: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

// serve frontend
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/build")));
  app.get("*", (req, res) =>
    res.sendFile(
      path.resolve(__dirname, "../", "frontend", "build", "index.html")
    )
  );
} else {
  app.get("/", (req, res) => res.send("Please set to production"));
}

// error handler middleware
app.use(errorHandler);

mongoose.connection.once("open", () => {
  console.log(`MongoDB connected`);
  app.listen(PORT, () => console.log(`Server running: ${PORT}`));
});

mongoose.connection.on("error", (err) => {
  console.log("MongoDB Error:\n", err);
  logEvents(
    `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
    "mongoErrLog.log"
  );
});
