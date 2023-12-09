import jwt from "jsonwebtoken";
import userModel from "../model/userModel.mjs";

export const protect = async (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  console.log("yes ! verify");

  if (typeof bearerHeader !== "undefined") {
    try {
      const bearer = bearerHeader.split(" ");
      const token = bearer[1].trim();

      const decoded = await jwt.verify(token, process.env.JWT_SECRETE);
      const userId = decoded.user;

      const user = await userModel.findById(userId).select("-password");

      if (!user) {
        return res.status(401).json({ result: "User not found" });
      }

      req.user = user;
      next();
    } catch (error) {
      console.log(error);
      res.status(401).json({ result: "Token is not valid" });
    }
  } else {
    res.status(401).json({ result: "Authorization header is missing" });
  }
};
