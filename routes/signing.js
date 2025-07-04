// routes/docs.js (or new routes/sign.js)
import fs from "fs";
import path from "path";
import express from "express";
import { PDFDocument, rgb } from "pdf-lib";
import Document from "../models/Document.js";
import Signature from "../models/Signature.js";
import auth from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/sign/:fileId", auth, async (req, res) => {
  try {
    const fileId = req.params.fileId;
    const doc = await Document.findById(fileId);
    const signatures = await Signature.find({ fileId });

    if (!doc) return res.status(404).json({ msg: "Document not found" });

    const filePath = path.join("uploads", doc.filename);
    const existingPdfBytes = fs.readFileSync(filePath);

    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    // Embed all signatures
    for (const sig of signatures) {
      firstPage.drawText("Signed by user", {
        x: sig.x,
        y: firstPage.getHeight() - sig.y,
        size: 16,
        color: rgb(0, 0.5, 1),
      });
    }

    const signedPdfBytes = await pdfDoc.save();
    const outputPath = `uploads/signed-${doc.filename}`;
    fs.writeFileSync(outputPath, signedPdfBytes);

    res.json({ msg: "Signed PDF generated", file: outputPath });
  } catch (err) {
    console.error("❌ Signing error:", err);
    res
      .status(500)
      .json({ msg: "Failed to generate signed PDF", error: err.message });
  }
});

export default router;
