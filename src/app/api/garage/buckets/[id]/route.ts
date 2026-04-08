import { NextResponse } from "next/server";
import { getBucketInfo } from "@/lib/garage/service";
import { toErrorResponse } from "@/lib/garage/errors";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const data = await getBucketInfo(id);
    return NextResponse.json(data);
  } catch (error) {
    const { status, body } = toErrorResponse(error);
    return NextResponse.json(body, { status });
  }
}
