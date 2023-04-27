const express = require("express")
const cors = require('cors');
const dotenv = require("dotenv").config()
const {errorHandler} = require("./middleware/errorMiddleware.js")
const connectDB = require("./config/db.js");
const PORT = process.env.PORT || 5001

connectDB();

const app = express()

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors());
// app.use(cors({ origin: 'http://localhost:3000' , credentials :  true}));
app.use("/users", require("./routes/usersRoute.js"));
app.use("/orders", require("./routes/ordersRoute.js"));
app.use(errorHandler)

app.listen(PORT, () => console.log(`Server running: ${PORT}`))