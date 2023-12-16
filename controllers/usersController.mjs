import userModel from "../model/userModel.mjs";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res, next) => {
  try {
    const { userName, email, password } = req.body;

    const userNameCheck = await userModel.findOne({ userName });
    if (userNameCheck)
      return res.json({ msg: "User name already in use!", status: false });
    const emailCheck = await userModel.findOne({ email });
    if (emailCheck)
      return res.json({ msg: "Email name already in use!", status: false });
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      userName,
      email,
      password: hashedPassword,
    });
    delete user.password;

    jwt.sign(
      { user: user._id },
      process.env.JWT_SECRETE,
      { expiresIn: "14d" },
      (err, token) => {
        res.json({
          token: `bearer ${token}`,
          status: true,
          user,
        });
      }
    );
  } catch (error) {
    next(error);
    console.log("erori", error);
    return res.json({ status: 401, msg: error });
  }
};

export const login = async (req, res, next) => {
  try {
    const { userName, password } = req.body;

    const user = await userModel.findOne({ userName });
    if (!user)
      return res.json({ msg: "Incorrect username or password", status: false });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.json({ msg: "Incorrect username or password", status: false });

    delete user.password;
    jwt.sign(
      { user: user._id },
      process.env.JWT_SECRETE,
      { expiresIn: "14d" },
      (err, token) => {
        res.json({
          token: `bearer ${token}`,
          status: true,
          user,
        });
      }
    );
    // return res.json({ status: true, user });
  } catch (error) {
    next(error);
    console.log("erori", error);
    return res.json({ status: 401, msg: error });
  }
};

export const setProfilePicture = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const profileImage = req.body.image;
    console.log(userId, profileImage);
    const userData = await userModel.findByIdAndUpdate(userId, {
      isAvatarImageSet: true,
      avatarImage: profileImage,
    });
    return res.json({
      isSet: true,
      image: profileImage,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await userModel
      .find({ _id: { $ne: req.params.id } })
      .select(["email", "userName", "avatarImage", "_id"]);
    // const fetchedUsers = res.json(users);
    // console.log(fetchedUsers);
    return res.json(users);
  } catch (error) {
    next(error);
  }
};

export const me = (req, res) => {
  res.json({ user: req.user });
};
