import { NextRequest, NextResponse } from "next/server";
import {
  getAdminTokenInfo,
  updateAdminToken,
  deleteAdminToken,
} from "@/lib/garage/service";
import { toErrorResponse } from "@/lib/garage/errors";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const data = await getAdminTokenInfo(id);
    return NextResponse.json(data);
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
    const requestBody = await request.json();
    const data = await updateAdminToken(id, requestBody);
    return NextResponse.json(data);
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
    await deleteAdminToken(id);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    const { status, body } = toErrorResponse(error);
    return NextResponse.json(body, { status });
  }
}
