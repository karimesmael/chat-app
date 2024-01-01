const asyncHandler = require("express-async-handler");
const User = require("../models/userSchema");
const HttpError = require("../models/httpError");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const generateToken = require("../util/generateToken");

exports.signup = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const msg = errors.array()[0].msg;
    throw new HttpError(msg, 422);
  }

  const { name, email, password } = req.body;
  if (name.trim() === "" || !email || !password) {
    throw new HttpError("please enter all feilds", 500);
  }
  const userExist = await User.findOne({ email });
  if (userExist) {
    console.log(userExist);
    throw new HttpError("Email already used", 500);
  }
  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  if (user) {
    return res.status(201).json({ user, token: generateToken(user._id) });
  }
});

exports.login = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const msg = errors.array()[0].msg;
    throw new HttpError(msg, 422);
  }
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new HttpError("Error in password or email", 401);
  }
  const comparedPassword = await bcrypt.compare(password, user.password);
  if (!comparedPassword) {
    throw new HttpError("Error in password or email", 401);
  }

  return res
    .status(201)
    .json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
});

//api/users?search=....
exports.getUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};
  const users = await User.find(keyword)
    .find({ _id: { $ne: req.userId } })
    .select("name email pic");
  return res.status(200).send(users);
});
