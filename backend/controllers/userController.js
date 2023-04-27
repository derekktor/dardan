const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler")
const User = require("../models/userModel.js");

const createUser = asyncHandler(async (req, res) => {
    const {name, password, role} = req.body;

    if (!name || !password || !role) {
        res.status(400);
        throw new Error("Please fill all fields!");
    }

    // check if user exists
    const userExists = await User.findOne({name});

    if (userExists) {
        throw new Error(`${name} nertei hereglegch burtgeltei bn!`);
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create user
    const user = await User.create({
        name,
        password: hashedPassword,
        role,
        token: generateToken(user._id)
    })

    res.status(200).json({message: "creating user", user})
})

const getMe = asyncHandler(async (req, res) => {
    res.status(200).json({message: req.user})
})

const loginUser = asyncHandler(async (req, res) => {
    const {name, password} = req.body;

    const user = await User.findOne({name});

    if (!user) {
        res.status(400);
        throw new Error("Iim ner deer burtgel baihgui bn!")
    }

    if (await bcrypt.compare(password, user.password)) {
        res.json({
            _id: user.id,
            name: user.name,
            role: user.role,
            token: generateToken(user.id) 
        })
    } else {
        res.status(400);
        throw new Error("Password buruu bn!")
    }

    res.status(200).json({message: "logging in user"})
})

const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find();
    res.status(200).json({message: "showing users", users})
})

const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        res.status(400);
        throw new Error("User not found!");
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {new: true});

    res.status(200).json({message: `updating user ${req.params.id}`, updatedUser})
})

const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findByIdAndDelete(req.params.id);

    res.status(200).json({message: `successfully deleted user ${req.params.id}`})
})

const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: "30d"
    })
}

module.exports = {getUsers, getMe, createUser, loginUser, updateUser, deleteUser}