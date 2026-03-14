import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// Change member password
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { memberId, newPassword } = body;
    
    if (!memberId || !newPassword) {
      return NextResponse.json({ error: "معرف العضو وكلمة المرور الجديدة مطلوبان" }, { status: 400 });
    }
    
    if (newPassword.length < 6) {
      return NextResponse.json({ error: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" }, { status: 400 });
    }
    
    const member = await db.member.findUnique({
      where: { id: memberId },
    });
    
    if (!member) {
      return NextResponse.json({ error: "العضو غير موجود" }, { status: 404 });
    }
    
    // Update password and mark as not needing to change password
    await db.member.update({
      where: { id: memberId },
      data: {
        password: newPassword,
        mustChangePassword: false,
        firstLogin: false,
      },
    });
    
    return NextResponse.json({
      success: true,
      message: "تم تغيير كلمة المرور بنجاح",
    });
  } catch (error) {
    console.error("Error changing password:", error);
    return NextResponse.json({ error: "حدث خطأ في تغيير كلمة المرور" }, { status: 500 });
  }
}
