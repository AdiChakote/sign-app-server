// routes/email.js
import express from "express";
import { sendSignatureLink } from "../controllers/sendSignatureLink.js";

const router = express.Router();

router.post("/send-signature-link", sendSignatureLink);

export default router;
