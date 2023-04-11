const express = require("express")
const dotenv = require("dotenv").config()
const {errorHandler} = require("./middleware/errorMiddleware.js")
const PORT = process.env.PORT || 5001

const app = express()

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use("/users", require("./routes/usersRoute.js"));``
app.use(errorHandler)

app.listen(PORT, () => console.log(`Server running: ${PORT}`))