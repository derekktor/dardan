const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

// @route     POST /auth
// @payload   { name, password }
// @response  { accessToken }
// @access    Public
// @desc      Login
const login = asyncHandler(async (req, res) => {
  const { name, password } = req.body;

  if (!name || !password) {
    return res.status(400).json({ message: "Нэр болон нууц үгээ оруулна уу" });
  }

  const foundUser = await User.findOne({ name }).exec();

  if (!foundUser) {
    return res.status(401).json({ message: "Нэвтрэх эрхгүй байна" });
  }

  const match = await bcrypt.compare(password, foundUser.password);

  if (!match) return res.status(401).json({ message: "Нууц үг буруу байна" });

  const accessToken = jwt.sign(
    {
      UserInfo: {
        name: foundUser.name,
        roles: foundUser.roles,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "1d",
    }
  );

  const refreshToken = jwt.sign(
    {
      name: foundUser.name,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "7d",
    }
  );

  res.cookie("jwt", refreshToken, {
    httpOnly: true, // accessible only by web server
    secure: true, // https
    sameSite: "None", // cross site cookie
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.json({ accessToken });
});

// @route     GET /auth/refresh
// @payload   { __cookie }
// @response  {  }
// @access    Public
// @desc      Refresh
const refresh = (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt)
    return res
      .status(401)
      .json({ message: "No Cookie: There's no jwt in cookie" });

  const refreshToken = cookies.jwt;

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    asyncHandler(async (err, decoded) => {
      if (err) return res.status(403).json({ message: "bad refresh token" });

      const foundUser = await User.findOne({ name: decoded.name });

      if (!foundUser)
        return res.status(401).json({ message: "user not found" });

      const accessToken = jwt.sign(
        {
          UserInfo: {
            name: foundUser.name,
            roles: foundUser.roles,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1d" }
      );

      res.json({ accessToken });
    })
  );
};

// @route     POST /auth/logout
// @payload   { __cookie }
// @response  {  }
// @access    Public
// @desc      Log out by clearing the cookie with jwt field(has refresh token)
const logout = (req, res) => {
  // check for cookies
  const cookies = req.cookies;
  // if the cookie doesn't have jwt field, then it was successful but no content
  if (!cookies?.jwt) return res.sendStatus(204);
  // if there is a cookie, clear the jwt cookie
  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: "None",
    secure: true,
  });
  res.json({ message: "Cookie cleared" });
};

module.exports = { login, refresh, logout };
