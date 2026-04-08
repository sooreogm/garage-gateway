import { NextRequest, NextResponse } from "next/server";
import { denyBucketKey } from "@/lib/garage/service";
import { toErrorResponse } from "@/lib/garage/errors";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = await denyBucketKey(body);
    return NextResponse.json(data);
  } catch (error) {
    const { status, body } = toErrorResponse(error);
    return NextResponse.json(body, { status });
  }
}
