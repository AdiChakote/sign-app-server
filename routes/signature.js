import express from "express";
import auth from "../middleware/authMiddleware.js";
import Signature from "../models/Signature.js";

const router = express.Router();

// POST /api/signature/save
router.post("/save", auth, async (req, res) => {
  const { fileId, x, y, page = 1 } = req.body;

  try {
    const signature = new Signature({
      fileId,
      x,
      y,
      page,
      signer: req.user.id,
    });

    await signature.save();
    res.status(201).json({ msg: "Signature saved", signature });
  } catch (err) {
    res
      .status(500)
      .json({ msg: "Failed to save signature", error: err.message });
  }
});

export default router;
