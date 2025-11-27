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
    const partnerId = formData.get("partnerId") as string;
    const partnerName = formData.get("partnerName") as string;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Partner ID or name is required for partner avatar
    if (!partnerId && !partnerName) {
      return NextResponse.json(
        {
          error: "Partner ID or name is required.",
        },
        { status: 400 }
      );
    }

    const filename = file.name || "avatar.jpg";

    // Generate unique filename
    const timestamp = Date.now();
    const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.-]/g, "_");

    // Generate slug from partner name or use ID
    let folderName: string;
    if (partnerName) {
      // Generate slug from name: lowercase, replace spaces with hyphens, remove special chars
      folderName = partnerName
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "") // Remove special chars except spaces and hyphens
        .replace(/\s+/g, "-") // Replace spaces with hyphens
        .replace(/-+/g, "-") // Replace multiple hyphens with single
        .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens

      // If slug is empty after sanitization, use partnerId
      if (!folderName) {
        folderName = partnerId || "unknown";
      }
    } else {
      folderName = partnerId || "unknown";
    }

    // Create R2 key with structure: [dev/]partners/[slug]/avatar/[timestamp]-[filename]
    // Prefix with "dev/" in development environment
    const isDev = process.env.NODE_ENV === "development";
    const basePath = isDev ? "dev/partners" : "partners";
    const r2Key = `${basePath}/${folderName}/avatar/${timestamp}-${sanitizedFilename}`;

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
    const r2PublicBase =
      process.env.NEXT_PUBLIC_R2_PUBLIC_BASE || process.env.R2_PUBLIC_URL;
    const publicUrl = r2PublicBase
      ? `${r2PublicBase.replace(/\/$/, "")}/${r2Key}`
      : `https://${bucketName}/${r2Key}`;

    return NextResponse.json(
      {
        key: r2Key,
        publicUrl,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("[UPLOAD PARTNER AVATAR API] Error:", error);
    return NextResponse.json(
      {
        error: "Failed to upload file",
        details: error?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
