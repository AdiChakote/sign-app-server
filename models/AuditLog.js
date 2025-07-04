// models/AuditLog.js
import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
    fileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Document",
      required: true,
    },
    signerEmail: {
      type: String,
      required: true,
    },
    signerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    action: {
      type: String,
      enum: ["signed", "rejected"],
      required: true,
    },
    ipAddress: {
      type: String,
      required: true,
    },
    rejectionReason: {
      type: String,
      default: "",
    },
  },
  { timestamps: true } // adds createdAt (like signedAt)
);

export default mongoose.model("AuditLog", auditLogSchema);
