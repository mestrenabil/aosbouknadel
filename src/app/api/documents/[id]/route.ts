import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET - جلب مستند واحد
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const document = await db.document.findUnique({
      where: { id }
    });

    if (!document) {
      return NextResponse.json({ error: "المستند غير موجود" }, { status: 404 });
    }

    // Increment download count
    await db.document.update({
      where: { id },
      data: { downloadCount: { increment: 1 } }
    });

    return NextResponse.json(document);
  } catch (error) {
    console.error("Error fetching document:", error);
    return NextResponse.json({ error: "خطأ في جلب المستند" }, { status: 500 });
  }
}

// PUT - تحديث مستند
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const document = await db.document.update({
      where: { id },
      data: body
    });

    return NextResponse.json(document);
  } catch (error) {
    console.error("Error updating document:", error);
    return NextResponse.json({ error: "خطأ في تحديث المستند" }, { status: 500 });
  }
}

// DELETE - حذف مستند
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await db.document.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting document:", error);
    return NextResponse.json({ error: "خطأ في حذف المستند" }, { status: 500 });
  }
}
