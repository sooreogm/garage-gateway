import { NextResponse } from "next/server";
import { getClusterStatus } from "@/lib/garage/service";
import { toErrorResponse } from "@/lib/garage/errors";

export async function GET() {
  try {
    const data = await getClusterStatus();
    return NextResponse.json(data);
  } catch (error) {
    const { status, body } = toErrorResponse(error);
    return NextResponse.json(body, { status });
  }
}
