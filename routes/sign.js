// routes/sign.js
import express from "express";
import { sendSignatureLink } from "../controllers/sendSignatureLink.js";
import { handleSignatureSubmit } from "../controllers/handleSignatureSubmit.js";
import { generateSignedPdf } from "../controllers/generateSignedPdf.js";
import logAudit from "../middleware/logAudit.js";
import { getIp } from "../middleware/getIp.js";
import { updateSignatureStatus } from "../controllers/updateSignatureStatus.js";

const router = express.Router();

// Existing route
router.post("/send-link", sendSignatureLink);

// New route with audit logging
router.post("/submit", logAudit, handleSignatureSubmit);

//  NEW: Generate signed PDF to disk
router.post("/:fileId", generateSignedPdf);

// Route to Accept/Reject Signature
router.put("/:signatureId/status", updateSignatureStatus);

router.post("/submit", getIp, handleSignatureSubmit);

router.put("/:signatureId/status", getIp, updateSignatureStatus);

export default router;
