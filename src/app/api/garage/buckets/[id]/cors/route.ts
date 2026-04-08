import { NextRequest, NextResponse } from "next/server";
import { getBucketCors, putBucketCors, deleteBucketCors } from "@/lib/garage/s3-cors";
import { getBucketInfo } from "@/lib/garage/service";
import { toErrorResponse } from "@/lib/garage/errors";

async function resolveBucketAlias(id: string): Promise<string> {
  const bucket = await getBucketInfo(id);
  const alias = bucket.globalAliases[0];
  if (!alias) {
    throw new Error("Bucket has no global alias. CORS requires a bucket name.");
  }
  return alias;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const alias = await resolveBucketAlias(id);
    const rules = await getBucketCors(alias);
    return NextResponse.json({ corsRules: rules });
  } catch (error) {
    const { status, body } = toErrorResponse(error);
    return NextResponse.json(body, { status });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const alias = await resolveBucketAlias(id);
    const { corsRules } = await request.json();
    await putBucketCors(alias, corsRules);
    return NextResponse.json({ success: true });
  } catch (error) {
    const { status, body } = toErrorResponse(error);
    return NextResponse.json(body, { status });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const alias = await resolveBucketAlias(id);
    await deleteBucketCors(alias);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    const { status, body } = toErrorResponse(error);
    return NextResponse.json(body, { status });
  }
}
