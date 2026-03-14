import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

// Reset member password (for testing/admin purposes)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { memberNumber, newPassword } = body;

    const member = await db.member.findUnique({
      where: { memberNumber },
    });

    if (!member) {
      return NextResponse.json({ error: "المنخرط غير موجود" }, { status: 404 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db.member.update({
      where: { memberNumber },
      data: {
        password: hashedPassword,
        mustChangePassword: false,
      },
    });

    return NextResponse.json({
      success: true,
      message: `تم تحديث كلمة المرور للمنخرط ${memberNumber}`,
    });
  } catch (error) {
    console.error("Error resetting password:", error);
    return NextResponse.json({ error: "خطأ في تحديث كلمة المرور" }, { status: 500 });
  }
}
