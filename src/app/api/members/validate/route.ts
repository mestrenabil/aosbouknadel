import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

// Member login validation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { memberNumber, password, nationalId } = body;
    
    // If nationalId is provided, it's a registration/first login attempt
    if (nationalId) {
      const member = await db.member.findFirst({
        where: { 
          memberNumber,
          nationalId,
        },
      });
      
      if (!member) {
        return NextResponse.json({ error: "رقم الانخراط أو رقم البطاقة الوطنية غير صحيح" }, { status: 401 });
      }
      
      if (!member.active) {
        return NextResponse.json({ error: "حسابك غير مفعل. يرجى التواصل مع الإدارة" }, { status: 403 });
      }
      
      return NextResponse.json({
        success: true,
        isFirstLogin: member.mustChangePassword,
        member: {
          id: member.id,
          memberNumber: member.memberNumber,
          nameAr: member.nameAr,
          nameFr: member.nameFr,
          email: member.email,
          phone: member.phone,
          whatsapp: member.whatsapp,
          department: member.department,
          joinDate: member.joinDate,
          mustChangePassword: member.mustChangePassword,
        },
      });
    }
    
    // Regular login with memberNumber and password
    const member = await db.member.findUnique({
      where: { memberNumber },
    });
    
    if (!member) {
      return NextResponse.json({ error: "رقم الانخراط أو كلمة المرور غير صحيحة" }, { status: 401 });
    }
    
    if (!member.active) {
      return NextResponse.json({ error: "حسابك غير مفعل. يرجى التواصل مع الإدارة" }, { status: 403 });
    }
    
    // Check password - support both hashed and plain text passwords
    let passwordMatch = false;
    if (member.password.startsWith("$2")) {
      // Hashed password - use bcrypt
      passwordMatch = await bcrypt.compare(password, member.password);
    } else {
      // Plain text password (legacy)
      passwordMatch = member.password === password;
    }
    
    if (!passwordMatch) {
      return NextResponse.json({ error: "رقم الانخراط أو كلمة المرور غير صحيحة" }, { status: 401 });
    }
    
    return NextResponse.json({
      success: true,
      isFirstLogin: member.mustChangePassword,
      member: {
        id: member.id,
        memberNumber: member.memberNumber,
        nameAr: member.nameAr,
        nameFr: member.nameFr,
        email: member.email,
        phone: member.phone,
        whatsapp: member.whatsapp,
        department: member.department,
        joinDate: member.joinDate,
        mustChangePassword: member.mustChangePassword,
      },
    });
  } catch (error) {
    console.error("Error validating member:", error);
    return NextResponse.json({ error: "حدث خطأ في الاتصال بالخادم" }, { status: 500 });
  }
}
