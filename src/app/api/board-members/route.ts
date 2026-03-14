import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// Board Members API - GET - Fetch all board members
export async function GET() {
  try {
    const members = await db.boardMember.findMany({
      where: { active: true },
      orderBy: { order: "asc" },
    });
    return NextResponse.json(members);
  } catch (error) {
    console.error("Error fetching board members:", error);
    return NextResponse.json({ error: "Failed to fetch board members" }, { status: 500 });
  }
}

// POST - Create new board member
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nameAr, nameFr, titleAr, titleFr, photo, bioAr, bioFr, email, phone, order } = body;
    
    const member = await db.boardMember.create({
      data: {
        nameAr,
        nameFr,
        titleAr,
        titleFr,
        photo,
        bioAr,
        bioFr,
        email,
        phone,
        order: order || 0,
      },
    });
    
    return NextResponse.json(member);
  } catch (error) {
    console.error("Error creating board member:", error);
    return NextResponse.json({ error: "Failed to create board member" }, { status: 500 });
  }
}
