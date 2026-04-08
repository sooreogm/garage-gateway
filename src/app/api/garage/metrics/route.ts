import { NextResponse } from "next/server";
import { getMetrics } from "@/lib/garage/service";
import { toErrorResponse } from "@/lib/garage/errors";

export async function GET() {
  try {
    const data = await getMetrics();
    return new NextResponse(data, {
      headers: { "Content-Type": "text/plain" },
    });
  } catch (error) {
    const { status, body } = toErrorResponse(error);
    return NextResponse.json(body, { status });
  }
}
