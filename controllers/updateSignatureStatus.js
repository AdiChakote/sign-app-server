import Signature from "../models/Signature.js";
import AuditLog from "../models/AuditLog.js"; // ✅ Add this import

export const updateSignatureStatus = async (req, res) => {
  const { signatureId } = req.params;
  const { status, rejectionReason } = req.body;

  if (!["Signed", "Rejected", "signed", "rejected"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    const updated = await Signature.findByIdAndUpdate(
      signatureId,
      {
        status: status.toLowerCase(),
        rejectionReason:
          status.toLowerCase() === "rejected" ? rejectionReason : "",
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Signature not found" });
    }

    // ✅ Log to AuditLog if rejected
    if (status.toLowerCase() === "rejected") {
      await AuditLog.create({
        fileId: updated.fileId,
        signerEmail: updated.signerEmail || "unknown", // you can fetch from user if needed
        action: "rejected",
        ipAddress: req.ipAddress,
        rejectionReason,
      });
    }

    res.json({ message: "Status updated", signature: updated });
  } catch (error) {
    console.error("Error updating signature status:", error);
    res.status(500).json({ message: "Server error" });
  }
};
