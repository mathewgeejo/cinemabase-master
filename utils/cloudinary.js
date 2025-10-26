import * as cloudinary from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import fs from 'fs';
import path from 'path';

import dotenv from "dotenv";
dotenv.config();

console.log("--- Cloudinary Configuration ---");
console.log("Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME ? "Loaded" : "Missing");
console.log("API Key:", process.env.CLOUDINARY_API_KEY ? "Loaded" : "Missing");
console.log("API Secret:", process.env.CLOUDINARY_API_SECRET ? "Loaded" : "Missing");
console.log("-----------------------------");

// Check if Cloudinary is properly configured
const isCloudinaryConfigured = process.env.CLOUDINARY_CLOUD_NAME && 
                               process.env.CLOUDINARY_API_KEY && 
                               process.env.CLOUDINARY_API_SECRET;

let upload;

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  const storage = new CloudinaryStorage({
    cloudinary: cloudinary.v2,
    params: {
      folder: "Movies",
      allowedFormats: ["jpeg", "png", "jpg"],
      transformation: [
        { width: 300, height: 450, crop: "limit" }
      ]
    },
  });

  upload = multer({ 
    storage,
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
      // Accept image files only
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed!'), false);
      }
    }
  });
} else {
  console.log("Cloudinary not configured, using local file storage");
  
  // Create uploads directory if it doesn't exist
  const uploadsDir = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  
  // Use local disk storage as fallback
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
      // Generate unique filename with original extension
      const uniqueName = `movie_${Date.now()}_${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
      cb(null, uniqueName);
    }
  });
  
  upload = multer({ 
    storage,
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
      // Accept image files only
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed!'), false);
      }
    }
  });
}

export { upload };
