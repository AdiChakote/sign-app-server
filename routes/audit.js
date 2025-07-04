import express from "express";
import AuditLog from "../models/AuditLog.js";

const router = express.Router();

// GET /api/audit/:fileId → shows all audit logs for a file
router.get("/:fileId", async (req, res) => {
  try {
    const logs = await AuditLog.find({ fileId: req.params.fileId }).sort({
      createdAt: -1, // ✅ Fix: use createdAt instead of timestamp
    });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: "Error fetching audit logs" });
  }
});

export default router;
