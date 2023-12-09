import express from "express";
import { addMessage, getAllMessages } from "../controllers/messagesContoller.mjs";

const router = express.Router();

router.post("/addMessage/", addMessage);
router.post("/getMessage/", getAllMessages);

export default router;
