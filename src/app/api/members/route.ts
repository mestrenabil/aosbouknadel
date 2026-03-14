import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET - Fetch all members
export async function GET() {
  try {
    const members = await db.member.findMany({
      orderBy: { nameAr: "asc" },
      select: {
        id: true,
        memberNumber: true,
        nationalId: true,
        nameAr: true,
        nameFr: true,
        email: true,
        phone: true,
        whatsapp: true,
        department: true,
        joinDate: true,
        active: true,
        firstLogin: true,
        mustChangePassword: true,
      },
    });
    return NextResponse.json(members);
  } catch (error) {
    console.error("Error fetching members:", error);
    return NextResponse.json({ error: "Failed to fetch members" }, { status: 500 });
  }
}

// POST - Register new member
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { memberNumber, nationalId, nameAr, nameFr, email, phone, whatsapp, department, active } = body;
    
    // Check if member number already exists
    const existingMember = await db.member.findUnique({
      where: { memberNumber },
    });
    
    if (existingMember) {
      return NextResponse.json({ error: "رقم الانخراط موجود مسبقاً" }, { status: 400 });
    }

    // Check if national ID already exists
    if (nationalId) {
      const existingNationalId = await db.member.findUnique({
        where: { nationalId },
      });
      
      if (existingNationalId) {
        return NextResponse.json({ error: "رقم البطاقة الوطنية مسجل مسبقاً" }, { status: 400 });
      }
    }
    
    // Create member with default password = memberNumber
    const member = await db.member.create({
      data: {
        memberNumber,
        nationalId: nationalId?.toUpperCase() || "",
        password: memberNumber, // Default password is member number
        nameAr,
        nameFr: nameFr || nameAr, // Use Arabic name if French not provided
        email,
        phone,
        whatsapp,
        department,
        active: active ?? true,
        firstLogin: true,
        mustChangePassword: true,
      },
    });
    
    return NextResponse.json({
      success: true,
      id: member.id,
      memberNumber: member.memberNumber,
      nameAr: member.nameAr,
      nameFr: member.nameFr,
      message: "تم إضافة المنخرط بنجاح. كلمة المرور الافتراضية هي رقم الانخراط.",
    });
  } catch (error) {
    console.error("Error creating member:", error);
    return NextResponse.json({ error: "حدث خطأ في إضافة المنخرط" }, { status: 500 });
  }
}
