import fs from "fs";
import multer from "multer";
import path from "path";

const uploadDir = path.join(process.cwd(), "uploads");

console.log("=== MULTER V2 LOADED ===");
console.log("process.cwd() =", process.cwd());
console.log("uploadDir =", uploadDir);
console.log("uploadDir exists at startup =", fs.existsSync(uploadDir));
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  },
});

export const upload = multer({ storage });
