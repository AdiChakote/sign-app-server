import AuditLog from "../models/AuditLog.js";

const logAudit = async (req, res, next) => {
  try {
    const { fileId, signerEmail } = req.body;
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    await AuditLog.create({
      fileId,
      signerEmail,
      ipAddress: ip,
    });

    console.log(
      `📝 Audit log saved for ${signerEmail} on file ${fileId} from IP ${ip}`
    );
    next();
  } catch (error) {
    console.error("❌ Failed to log audit trail:", error);
    next(); // continue even if logging fails
  }
};

export default logAudit;
