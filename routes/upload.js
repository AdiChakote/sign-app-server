import express from "express";
import multer from "multer";
import auth from "../middleware/authMiddleware.js";
import Document from "../models/Document.js";
import fs from "fs";

const router = express.Router();

// Ensure upload directory exists
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const originalName = file.originalname;
    const sanitized = originalName
      .replace(/\s+/g, "_") // Replace spaces with underscores
      .replace(/[^\w.-]/g, "") // Remove unsafe characters
      .replace(/_+/g, "_"); // Collapse multiple underscores
    cb(null, `${Date.now()}-${sanitized}`);
  },
});

const pdfFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") cb(null, true);
  else cb(new Error("Only PDFs are allowed"), false);
};

const uploadAll = multer({ storage });
const uploadPDF = multer({ storage, fileFilter: pdfFilter });

// Route 1: Authenticated PDF Upload
router.post("/upload", auth, uploadPDF.single("pdf"), async (req, res) => {
  try {
    console.log("✅ Authenticated user:", req.user);
    if (!req.file) return res.status(400).json({ msg: "No file uploaded" });
    if (!req.user || !req.user.id)
      return res.status(400).json({ msg: "User ID not found in token" });

    const doc = new Document({
      filename: req.file.filename,
      originalname: req.file.originalname,
      path: req.file.path,
      mimetype: req.file.mimetype,
      size: req.file.size,
      uploadedBy: req.user.id,
    });

    await doc.save();
    res.status(200).json({ msg: "PDF uploaded successfully", doc });
  } catch (error) {
    console.error("❌ Upload failed:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});

// ✅ Health check route
router.get("/ping", (req, res) => {
  res.send("✅ Upload route is active");
});

// ✅ Simple unauthenticated upload
router.post("/simple-upload", uploadAll.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: "No file uploaded" });
    }
    res.status(200).json({
      msg: "File uploaded successfully",
      file: req.file,
    });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});

// Debug Route to see uploaded file structure
router.post("/debug-upload", uploadAll.any(), (req, res) => {
  res.json({ files: req.files });
});

export default router;
