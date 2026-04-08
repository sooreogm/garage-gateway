import { NextResponse } from "next/server";
import { getClusterHealth } from "@/lib/garage/service";
import { toErrorResponse } from "@/lib/garage/errors";

export async function GET() {
  try {
    const data = await getClusterHealth();
    return NextResponse.json(data);
  } catch (error) {
    const { status, body } = toErrorResponse(error);
    return NextResponse.json(body, { status });
  }
}
