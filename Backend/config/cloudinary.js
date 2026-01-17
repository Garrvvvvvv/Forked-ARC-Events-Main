import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// 1. Resolve the path to your .env file explicitly
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// This forces dotenv to look for .env in the root Backend folder
dotenv.config({ path: path.join(__dirname, "../.env") });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;