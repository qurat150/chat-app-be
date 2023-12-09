import express from "express";
import {
  login,
  register,
  setProfilePicture,
  getAllUsers,
  me,
} from "../controllers/usersController.mjs";
import { protect } from "../middlewares/authentication.mjs";

const router = express.Router();

router.get("/me", protect, me);
router.get("/allUsers/:id", getAllUsers);
router.post("/register", register);
router.post("/login", login);
router.post("/setProfilePicture/:id", protect, setProfilePicture);

export default router;
