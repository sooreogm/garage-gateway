import { Readable } from "node:stream";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { GarageS3ConnectionError, GarageS3Error } from "./errors";
import { getS3Client } from "./s3-client";

export interface GarageFileObject {
  body: ReadableStream<Uint8Array>;
  contentType: string;
  contentLength?: number;
  cacheControl?: string;
  contentDisposition?: string;
  etag?: string;
  lastModified?: Date;
}

function toWebStream(body: unknown): ReadableStream<Uint8Array> {
  if (!body) {
    throw new GarageS3Error("Garage S3 returned an empty object body.", 502);
  }

  if (
    typeof body === "object" &&
    body !== null &&
    "transformToWebStream" in body &&
    typeof body.transformToWebStream === "function"
  ) {
    return body.transformToWebStream() as ReadableStream<Uint8Array>;
  }

  if (body instanceof ReadableStream) {
    return body;
  }

  if (body instanceof Blob) {
    return body.stream();
  }

  if (body instanceof Readable) {
    return Readable.toWeb(body) as ReadableStream<Uint8Array>;
  }

  throw new GarageS3Error("Garage S3 returned an unsupported object stream.", 502);
}

export async function getFileObject(
  bucket: string,
  key: string,
): Promise<GarageFileObject> {
  const client = getS3Client();

  try {
    const result = await client.send(
      new GetObjectCommand({
        Bucket: bucket,
        Key: key,
      }),
    );

    return {
      body: toWebStream(result.Body),
      contentType: result.ContentType ?? "application/octet-stream",
      contentLength: result.ContentLength,
      cacheControl: result.CacheControl,
      contentDisposition: result.ContentDisposition,
      etag: result.ETag,
      lastModified: result.LastModified,
    };
  } catch (error) {
    if (error instanceof GarageS3Error) {
      throw error;
    }

    const s3Error = error as {
      name?: string;
      message?: string;
      $metadata?: { httpStatusCode?: number };
    };
    const statusCode = s3Error.$metadata?.httpStatusCode;

    if (statusCode === 403 || s3Error.name === "AccessDenied") {
      throw new GarageS3Error(
        `Access denied for s3://${bucket}/${key}.`,
        403,
        s3Error.message,
      );
    }

    if (
      statusCode === 404 ||
      s3Error.name === "NoSuchKey" ||
      s3Error.name === "NotFound"
    ) {
      throw new GarageS3Error(
        `File not found: s3://${bucket}/${key}.`,
        404,
        s3Error.message,
      );
    }

    if (statusCode) {
      throw new GarageS3Error(
        `Garage S3 returned ${statusCode} for s3://${bucket}/${key}.`,
        statusCode,
        s3Error.message,
      );
    }

    throw new GarageS3ConnectionError(error);
  }
}
