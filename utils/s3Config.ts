import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";

const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

const client = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: accessKeyId || "",
    secretAccessKey: secretAccessKey || "",
  },
});

export interface R2File {
  key: string | undefined;
  size: number | undefined;
  lastModified: Date | undefined;
}

export async function listR2Files(bucketName: string, prefix = ""): Promise<R2File[]> {
  try {
    const command = new ListObjectsV2Command({
      Bucket: bucketName,
      Prefix: prefix,
    });

    const response = await client.send(command);

    if (response.Contents) {
      return response.Contents.map((file) => ({
        key: file.Key,
        size: file.Size,
        lastModified: file.LastModified,
      }));
    } else {
      return [];
    }
  } catch (err) {
    console.error("Failed to list R2 files:", err);
    throw err;
  }
}

