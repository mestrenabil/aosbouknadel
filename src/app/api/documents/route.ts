import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET - جلب جميع المستندات
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const visibilityType = searchParams.get("visibilityType");

    const where: Record<string, unknown> = { active: true };
    
    if (category) {
      where.category = category;
    }
    
    if (visibilityType) {
      where.visibilityType = visibilityType;
    }

    const documents = await db.document.findMany({
      where,
      orderBy: [
        { order: "asc" },
        { createdAt: "desc" }
      ]
    });

    return NextResponse.json(documents);
  } catch (error) {
    console.error("Error fetching documents:", error);
    return NextResponse.json({ error: "خطأ في جلب المستندات" }, { status: 500 });
  }
}

// POST - إضافة مستند جديد
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      titleAr,
      titleFr,
      descriptionAr,
      descriptionFr,
      category,
      fileUrl,
      fileType,
      fileSize,
      visibilityType,
      visibleToMemberIds,
      visibleToAdminIds,
      visibleToCommitteeIds,
      uploadedBy,
      order
    } = body;

    const document = await db.document.create({
      data: {
        titleAr,
        titleFr,
        descriptionAr,
        descriptionFr,
        category: category || "general",
        fileUrl,
        fileType: fileType || "pdf",
        fileSize,
        visibilityType: visibilityType || "all",
        visibleToMemberIds,
        visibleToAdminIds,
        visibleToCommitteeIds,
        uploadedBy,
        order: order || 0
      }
    });

    return NextResponse.json(document);
  } catch (error) {
    console.error("Error creating document:", error);
    return NextResponse.json({ error: "خطأ في إنشاء المستند" }, { status: 500 });
  }
}
