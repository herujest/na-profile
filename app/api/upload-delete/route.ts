import { NextRequest, NextResponse } from "next/server";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { isAuthenticated } from "@/lib/auth";

const s3Client = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
  },
});

export async function DELETE(req: NextRequest) {
  try {
    // Check authentication
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const key = searchParams.get("key");

    if (!key || typeof key !== "string") {
      return NextResponse.json(
        { error: "key parameter is required" },
        { status: 400 }
      );
    }

    const bucketName = process.env.R2_BUCKET_NAME;
    if (!bucketName) {
      return NextResponse.json(
        { error: "R2_BUCKET_NAME not configured" },
        { status: 500 }
      );
    }

    // Delete object from R2
    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    await s3Client.send(command);

    return NextResponse.json({ success: true, key }, { status: 200 });
  } catch (error: any) {
    console.error("Error deleting image:", error);
    return NextResponse.json(
      {
        error: "Failed to delete image",
        details: error?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}

