import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET - جلب الرسائل
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const type = searchParams.get("type");

    const where: Record<string, unknown> = {};

    // إذا كان هناك مستخدم محدد، جلب الرسائل المرسلة إليه أو منه
    if (userId) {
      where.OR = [
        { senderId: userId },
        { receiverId: userId },
        { receiverId: null } // الرسائل العامة
      ];
    }

    if (type) {
      where.type = type;
    }

    const messages = await db.executiveMessage.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 100
    });

    // جلب معلومات المرسلين
    const senderIds = [...new Set(messages.map(m => m.senderId))];
    const senders = await db.admin.findMany({
      where: { id: { in: senderIds } },
      select: { id: true, name: true, role: true, positionAr: true }
    });

    const senderMap = Object.fromEntries(senders.map(s => [s.id, s]));

    return NextResponse.json(messages.map(m => ({
      ...m,
      sender: senderMap[m.senderId] || null
    })));
  } catch (error) {
    console.error("Error fetching executive messages:", error);
    return NextResponse.json({ error: "خطأ في جلب الرسائل" }, { status: 500 });
  }
}

// POST - إرسال رسالة جديدة
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { senderId, receiverId, subject, message, type, fileUrl } = body;

    const newMessage = await db.executiveMessage.create({
      data: {
        senderId,
        receiverId: receiverId || null,
        subject,
        message,
        type: type || "message",
        fileUrl,
        read: false
      }
    });

    return NextResponse.json(newMessage);
  } catch (error) {
    console.error("Error creating executive message:", error);
    return NextResponse.json({ error: "خطأ في إرسال الرسالة" }, { status: 500 });
  }
}

// PUT - تحديث رسالة (تحديد كمقروءة)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, read } = body;

    const updated = await db.executiveMessage.update({
      where: { id },
      data: { read }
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating executive message:", error);
    return NextResponse.json({ error: "خطأ في تحديث الرسالة" }, { status: 500 });
  }
}

// DELETE - حذف رسالة
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "معرف الرسالة مطلوب" }, { status: 400 });
    }

    await db.executiveMessage.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting executive message:", error);
    return NextResponse.json({ error: "خطأ في حذف الرسالة" }, { status: 500 });
  }
}
