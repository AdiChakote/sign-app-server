import Document from "../models/Document.js";
import Signature from "../models/Signature.js";
import AuditLog from "../models/AuditLog.js";

export const handleSignatureSubmit = async (req, res) => {
  try {
    console.log("✅ Signature route hit");

    const { fileId, signerEmail, signatureData, x, y, page } = req.body;
    console.log("📦 Saving signature for:", fileId, signatureData);

    const document = await Document.findById(fileId);
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    // Mark document signed
    document.isSigned = true;
    document.signedBy = signerEmail;
    await document.save();

    // ✅ Save to Signature model
    await Signature.create({
      fileId,
      signer: signerEmail,
      signature: signatureData, // required for PDF
      x,
      y,
      page,
      status: "pending",
    });

    // Log audit
    await AuditLog.create({
      fileId,
      signerEmail,
      action: "signed",
      ipAddress: req.ipAddress,
    });

    res.status(200).json({ message: "Document signed successfully" });
  } catch (error) {
    console.error("Signature submission failed:", error);
    res.status(500).json({ message: "Server error" });
  }
};
