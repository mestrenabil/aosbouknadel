import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET - جلب التفويضات
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fromUserId = searchParams.get("fromUserId");
    const toUserId = searchParams.get("toUserId");

    const where: Record<string, unknown> = {};

    if (fromUserId) {
      where.fromUserId = fromUserId;
    }

    if (toUserId) {
      where.toUserId = toUserId;
    }

    const delegations = await db.delegation.findMany({
      where,
      orderBy: { createdAt: "desc" }
    });

    // جلب معلومات المستخدمين
    const userIds = [...new Set([...delegations.map(d => d.fromUserId), ...delegations.map(d => d.toUserId)])];
    const users = await db.admin.findMany({
      where: { id: { in: userIds } },
      select: { id: true, name: true, role: true, positionAr: true }
    });

    const userMap = Object.fromEntries(users.map(u => [u.id, u]));

    return NextResponse.json(delegations.map(d => ({
      ...d,
      fromUser: userMap[d.fromUserId] || null,
      toUser: userMap[d.toUserId] || null
    })));
  } catch (error) {
    console.error("Error fetching delegations:", error);
    return NextResponse.json({ error: "خطأ في جلب التفويضات" }, { status: 500 });
  }
}

// POST - إنشاء تفويض جديد
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fromUserId, toUserId, permission } = body;

    // التحقق من عدم وجود تفويض مماثل نشط
    const existing = await db.delegation.findFirst({
      where: {
        fromUserId,
        toUserId,
        permission,
        active: true
      }
    });

    if (existing) {
      return NextResponse.json({ error: "التفويض موجود مسبقاً" }, { status: 400 });
    }

    const delegation = await db.delegation.create({
      data: {
        fromUserId,
        toUserId,
        permission,
        active: true
      }
    });

    return NextResponse.json(delegation);
  } catch (error) {
    console.error("Error creating delegation:", error);
    return NextResponse.json({ error: "خطأ في إنشاء التفويض" }, { status: 500 });
  }
}

// PUT - تحديث تفويض (تفعيل/إلغاء)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, active } = body;

    const updated = await db.delegation.update({
      where: { id },
      data: { active }
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating delegation:", error);
    return NextResponse.json({ error: "خطأ في تحديث التفويض" }, { status: 500 });
  }
}

// DELETE - حذف تفويض
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "معرف التفويض مطلوب" }, { status: 400 });
    }

    await db.delegation.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting delegation:", error);
    return NextResponse.json({ error: "خطأ في حذف التفويض" }, { status: 500 });
  }
}
