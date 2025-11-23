import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { isAuthenticated } from "@/lib/auth";

const s3Client = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
  },
});

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const bucketName = process.env.R2_BUCKET_NAME;
    if (!bucketName) {
      return NextResponse.json(
        { error: "R2_BUCKET_NAME not configured" },
        { status: 500 }
      );
    }

    // Parse FormData
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const slug = formData.get("slug") as string;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Slug is required for portfolio images
    if (!slug || typeof slug !== "string" || slug.trim() === "" || slug === "new") {
      return NextResponse.json(
        {
          error: "Portfolio slug is required and must be a valid string.",
        },
        { status: 400 }
      );
    }

    const filename = file.name || "image.jpg";

    // Generate unique filename
    const timestamp = Date.now();
    const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.-]/g, "_");

    // Create R2 key with structure: [dev/]portfolio/[slug]/[timestamp]-[filename]
    // Prefix with "dev/" in development environment
    const isDev = process.env.NODE_ENV === "development";
    const basePath = isDev ? "dev/portfolio" : "portfolio";
    const r2Key = `${basePath}/${slug}/${timestamp}-${sanitizedFilename}`;

    // Convert File to Buffer
    const bytes = await file.arrayBuffer();
    const fileBuffer = Buffer.from(bytes);

    // Upload to R2
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: r2Key,
      Body: fileBuffer,
      ContentType: file.type || "image/jpeg",
    });

    await s3Client.send(command);

    // Construct public URL
    const publicUrl = process.env.R2_PUBLIC_URL
      ? `${process.env.R2_PUBLIC_URL}/${r2Key}`
      : `https://${bucketName}/${r2Key}`;

    return NextResponse.json(
      {
        key: r2Key,
        publicUrl,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("[UPLOAD API] Error:", error);
    return NextResponse.json(
      {
        error: "Failed to upload file",
        details: error?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}

