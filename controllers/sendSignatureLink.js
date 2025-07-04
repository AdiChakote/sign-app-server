// controllers/sendSignatureLink.js
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

export const sendSignatureLink = async (req, res) => {
  const { email, documentId } = req.body;

  // Create a secure token (valid for 24 hours)
  const token = jwt.sign({ email, documentId }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });

  const link = `http://localhost:5173/public-sign?token=${token}`; // or your domain

  // Setup nodemailer (use ethereal.email for dev or real SMTP)
  const transporter = nodemailer.createTransport({
    service: "gmail", // or use SMTP
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: '"DigiSign App" <no-reply@digisign.com>',
    to: email,
    subject: "Sign this document",
    html: `<p>Please sign the document using this link:</p><a href="${link}">${link}</a>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ msg: "Signature link sent", link });
  } catch (err) {
    res.status(500).json({ msg: "Failed to send email", error: err.message });
  }
};
