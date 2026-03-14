import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

// GET - جلب جميع أعضاء المكتب المسير
export async function GET() {
  try {
    const members = await db.admin.findMany({
      where: {
        role: { in: ["president", "general_secretary", "treasurer", "deputy", "admin"] }
      },
      orderBy: [
        { role: "asc" }
      ]
    });

    return NextResponse.json(members.map(m => ({
      id: m.id,
      username: m.username,
      name: m.name,
      email: m.email,
      role: m.role,
      positionAr: m.positionAr,
      positionFr: m.positionFr,
      permissions: m.permissions?.split(",").filter(Boolean) || [],
      photo: m.photo,
      phone: m.phone,
      lastLogin: m.lastLogin,
      active: m.active,
      createdAt: m.createdAt
    })));
  } catch (error) {
    console.error("Error fetching executive members:", error);
    return NextResponse.json({ error: "خطأ في جلب أعضاء المكتب" }, { status: 500 });
  }
}

// POST - إضافة عضو جديد في المكتب
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password, name, email, role, positionAr, positionFr, permissions, phone } = body;

    // التحقق من عدم وجود المستخدم
    const existing = await db.admin.findUnique({
      where: { username }
    });

    if (existing) {
      return NextResponse.json({ error: "اسم المستخدم موجود مسبقاً" }, { status: 400 });
    }

    // تشفير كلمة المرور
    const hashedPassword = await bcrypt.hash(password || "admin123", 10);

    const member = await db.admin.create({
      data: {
        username,
        password: hashedPassword,
        name,
        email,
        role: role || "admin",
        positionAr,
        positionFr,
        permissions: permissions?.join(",") || "",
        phone,
        active: true
      }
    });

    return NextResponse.json({
      id: member.id,
      username: member.username,
      name: member.name,
      role: member.role,
      positionAr: member.positionAr,
      positionFr: member.positionFr,
      permissions: member.permissions?.split(",").filter(Boolean) || [],
      active: member.active
    });
  } catch (error) {
    console.error("Error creating executive member:", error);
    return NextResponse.json({ error: "خطأ في إنشاء العضو" }, { status: 500 });
  }
}

// PUT - تحديث عضو
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, email, role, positionAr, positionFr, permissions, phone, active, password } = body;

    const updateData: Record<string, unknown> = {
      name,
      email,
      role,
      positionAr,
      positionFr,
      permissions: permissions?.join(",") || "",
      phone,
      active
    };

    // تحديث كلمة المرور إذا تم تقديمها
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const member = await db.admin.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json({
      id: member.id,
      username: member.username,
      name: member.name,
      role: member.role,
      positionAr: member.positionAr,
      positionFr: member.positionFr,
      permissions: member.permissions?.split(",").filter(Boolean) || [],
      active: member.active
    });
  } catch (error) {
    console.error("Error updating executive member:", error);
    return NextResponse.json({ error: "خطأ في تحديث العضو" }, { status: 500 });
  }
}

// DELETE - حذف عضو
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "معرف العضو مطلوب" }, { status: 400 });
    }

    // لا يمكن حذف الرئيس
    const member = await db.admin.findUnique({ where: { id } });
    if (member?.role === "president") {
      return NextResponse.json({ error: "لا يمكن حذف الرئيس" }, { status: 400 });
    }

    await db.admin.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting executive member:", error);
    return NextResponse.json({ error: "خطأ في حذف العضو" }, { status: 500 });
  }
}
