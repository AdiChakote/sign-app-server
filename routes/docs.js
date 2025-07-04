// routes/docs.js
import express from "express";
import Document from "../models/Document.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();
router.get("/all", async (req, res) => {
  const allDocs = await Document.find();
  res.json(allDocs);
});

// GET /api/docs - Get all documents for the logged-in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const documents = await Document.find({ uploadedBy: req.user.id }); //.sort({uploadedAt: -1, });// ✅ match your schema field
    res.json(documents);
  } catch (err) {
    console.error("Server Error:", err.message);
    res.status(500).json({ msg: "Server Error" });
  }
});

export default router;
