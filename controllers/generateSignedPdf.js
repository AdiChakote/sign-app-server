// controllers/generateSignedPdf.js
import fs from "fs";
import path from "path";
import { PDFDocument } from "pdf-lib";
import Document from "../models/Document.js";
import Signature from "../models/Signature.js";

export const generateSignedPdf = async (req, res) => {
  console.log("📥 Received request to generate signed PDF");
  try {
    const { fileId } = req.params;
    console.log("📥 Generating PDF for:", fileId);

    // 1. Validate Document
    const doc = await Document.findById(fileId);
    if (!doc || !doc.filename) {
      console.log("❌ Document not found for:", fileId);
      return res.status(404).json({ message: "Document not found" });
    }

    // 2. Validate Signature
    const sig = await Signature.findOne({ fileId });
    if (!sig || !sig.signature || typeof sig.signature !== "string") {
      console.log("❌ Invalid or missing signature for:", fileId);
      return res
        .status(404)
        .json({ message: "Signature not found or invalid" });
    }

    // 3. Load Original PDF
    const pdfPath = path.join("uploads", doc.filename);
    const pdfBytes = fs.readFileSync(pdfPath);
    const pdfDoc = await PDFDocument.load(pdfBytes);

    // 4. Embed Signature Image
    const base64Data = sig.signature.replace(/^data:image\/png;base64,/, "");
    const pngImageBytes = Buffer.from(base64Data, "base64");
    const pngImage = await pdfDoc.embedPng(pngImageBytes);

    // 5. Draw Image on the PDF
    const page = pdfDoc.getPages()[sig.page - 1];
    page.drawImage(pngImage, {
      x: sig.x,
      y: sig.y,
      width: 150,
      height: 50,
    });

    const finalPdfBytes = await pdfDoc.save();

    // 6. Ensure 'signed' folder exists
    const signedDir = path.join("signed");
    if (!fs.existsSync(signedDir)) {
      fs.mkdirSync(signedDir, { recursive: true });
    }

    // 7. Save and return signed PDF
    const signedFilename = `${path.parse(doc.filename).name}-signed.pdf`;
    const signedPath = path.join(signedDir, signedFilename);
    fs.writeFileSync(signedPath, finalPdfBytes);

    console.log("✅ Signed PDF saved at:", signedPath);
    res.status(200).json({ file: `signed/${signedFilename}` });
  } catch (err) {
    console.error("❌ Failed to generate signed PDF:", err);
    res.status(500).json({ message: "Error generating signed PDF" });
  }
};
