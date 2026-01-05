import { Request, Response } from "express";
import { v2 as cloudinary } from "cloudinary";
import "dotenv/config";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const image = req.body.image;
    if (!image) {
      res.status(400).json({ message: "No image data provided." });
      return;
    }

    // Upload the image to Cloudinary
    const timestamp = Math.round(new Date().getTime() / 1000);
    console.log(`[Upload] Starting upload. Timestamp: ${timestamp}`);

    const result = await cloudinary.uploader.upload(image, {
      folder: "nordwear-products", // Optional: organize uploads in a specific folder
      timestamp: timestamp,
    });

    res.status(200).json({ url: result.secure_url });
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    const msg = error instanceof Error ? error.message : String(error);
    res.status(500).json({ message: "Error uploading image", error: msg });
  }
};
