import { S3Client } from "@aws-sdk/client-s3";

let client: S3Client | null = null;

export function getS3Client(): S3Client {
  if (client) {
    return client;
  }

  const endpoint = process.env.GARAGE_S3_API_URL;
  const accessKeyId = process.env.GARAGE_S3_ACCESS_KEY_ID;
  const secretAccessKey = process.env.GARAGE_S3_SECRET_ACCESS_KEY;

  if (!endpoint || !accessKeyId || !secretAccessKey) {
    throw new Error(
      "Missing GARAGE_S3_API_URL, GARAGE_S3_ACCESS_KEY_ID, or GARAGE_S3_SECRET_ACCESS_KEY environment variables.",
    );
  }

  client = new S3Client({
    endpoint,
    region: "garage",
    credentials: { accessKeyId, secretAccessKey },
    forcePathStyle: true,
  });

  return client;
}
