import { NextRequest, NextResponse } from "next/server";
import { toErrorResponse } from "@/lib/garage/errors";
import { getFileObject } from "@/lib/garage/s3-files";

export const dynamic = "force-dynamic";

function getObjectKey(segments: string[] | undefined): string | null {
  if (!segments || segments.length === 0) {
    return null;
  }

  const key = segments.join("/");
  return key.length > 0 ? key : null;
}

function buildAttachmentDisposition(filename: string): string {
  return `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ bucket: string; key: string[] }> },
) {
  try {
    const { bucket, key } = await params;
    const objectKey = getObjectKey(key);

    if (!bucket || !objectKey) {
      return NextResponse.json(
        {
          error: "Bucket and object key are required.",
          code: "INVALID_FILE_PATH",
        },
        { status: 400 },
      );
    }

    const file = await getFileObject(bucket, objectKey);
    const headers = new Headers();
    const filename = objectKey.split("/").pop() || "download";
    const shouldDownload = request.nextUrl.searchParams.get("download") === "1";

    headers.set("Content-Type", file.contentType);
    headers.set("Cache-Control", file.cacheControl ?? "private, no-store");
    headers.set("X-Robots-Tag", "noindex, nofollow");

    if (file.contentLength !== undefined) {
      headers.set("Content-Length", String(file.contentLength));
    }

    if (file.etag) {
      headers.set("ETag", file.etag);
    }

    if (file.lastModified) {
      headers.set("Last-Modified", file.lastModified.toUTCString());
    }

    if (shouldDownload) {
      headers.set("Content-Disposition", buildAttachmentDisposition(filename));
    } else if (file.contentDisposition) {
      headers.set("Content-Disposition", file.contentDisposition);
    }

    return new Response(file.body, {
      status: 200,
      headers,
    });
  } catch (error) {
    const { status, body } = toErrorResponse(error);
    return NextResponse.json(body, { status });
  }
}
