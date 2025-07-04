import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import uploadRoutes from "./routes/upload.js";
import docsRoutes from "./routes/docs.js";
import signatureRoutes from "./routes/signature.js";
import signingRoutes from "./routes/signing.js";
import emailRoutes from "./routes/email.js";
import signRoutes from "./routes/sign.js";
import auditRoutes from "./routes/audit.js";
import { generateSignedPdf } from "./controllers/generateSignedPdf.js";
import userRoutes from "./routes/user.js";
dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
const __dirname = path.resolve();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use(
  "/uploads",
  express.static("uploads", {
    setHeaders: (res, path) => {
      if (path.endsWith(".pdf")) {
        res.setHeader("Content-Type", "application/pdf");
      }
    },
  })
);

// ✅ Route Mounts
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/docs", docsRoutes);
app.use("/api/signature", signatureRoutes);
app.use("/api/signing", signingRoutes);
app.use("/api/sign", signRoutes);
app.use("/api/email", emailRoutes);
app.use("/api/audit", auditRoutes);
app.use("/api/user", userRoutes);
app.use("/signed", express.static("signed"));
app.post("/api/sign/:fileId", generateSignedPdf);
app.get("/", (req, res) => {
  res.send("API is running...");
});
app.get("/api", (req, res) => {
  res.send("API is working");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
