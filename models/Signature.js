import mongoose from "mongoose";

const signatureSchema = new mongoose.Schema({
  fileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Document",
    required: true,
  },
  signer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  page: { type: Number, default: 1 },

  // Signature status: pending, signed, rejected
  status: {
    type: String,
    enum: ["pending", "signed", "rejected"],
    default: "pending",
  },

  // Optional reason if rejected
  rejectionReason: {
    type: String,
    default: "",
  },
});

export default mongoose.model("Signature", signatureSchema);
