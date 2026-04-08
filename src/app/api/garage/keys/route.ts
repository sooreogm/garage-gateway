import { NextRequest, NextResponse } from "next/server";
import { listKeys, createKey } from "@/lib/garage/service";
import { toErrorResponse } from "@/lib/garage/errors";

export async function GET() {
  try {
    const data = await listKeys();
    return NextResponse.json(data);
  } catch (error) {
    const { status, body } = toErrorResponse(error);
    return NextResponse.json(body, { status });
  }
}

export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json();
    const data = await createKey(requestBody);
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    const { status, body } = toErrorResponse(error);
    return NextResponse.json(body, { status });
  }
}
