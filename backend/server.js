const path = require("path");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config({path: "../.env"});
const {logger} = require("./middleware/logger");
const { errorHandler } = require("./middleware/errorMiddleware.js");
const connectDB = require("./config/db.js");
const PORT = process.env.PORT || 5001;

connectDB();

const app = express();

// MIDDLEWARES
// log every req sent to the server
app.use(logger);
// look for static files in folder called public
app.use("/", express.static(path.join(__dirname, "public")))
// send root.js file when client sends req
app.use("/", require("./routes/root.js"));
// parse any json so the server understands it
app.use(express.json());
// parse parameters sent request body
app.use(express.urlencoded({ extended: false }));
// enable cross origin stuff
app.use(cors());
// app.use(cors({ origin: 'http://localhost:3000' , credentials :  true}));

app.use("/users", require("./routes/usersRoute.js"));
app.use("/orders", require("./routes/ordersRoute.js"));
// send 404 page
app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ message: "404 Not Found"})
  } else {
    res.type("txt").send("404 Not Found")
  }
})

// serve frontend
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/build")));
  app.get("*", (req, res) =>
    res.sendFile(
      path.resolve(__dirname, "../", "frontend", "build", "index.html")
    )
  );
} else {
    app.get("/", (req, res) => res.send("Please set to production"))
}

// error handler middleware
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running: ${PORT}`));
