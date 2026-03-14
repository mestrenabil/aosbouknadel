import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET - Fetch all member messages
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const memberId = searchParams.get("memberId");
    
    const where = memberId ? { memberId } : {};
    
    const messages = await db.memberMessage.findMany({
      where,
      include: {
        member: {
          select: {
            id: true,
            memberNumber: true,
            nameAr: true,
            nameFr: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    
    return NextResponse.json(messages);
  } catch (error) {
    console.error("Error fetching member messages:", error);
    return NextResponse.json({ error: "Failed to fetch member messages" }, { status: 500 });
  }
}

// POST - Create new member message
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { memberId, subject, message } = body;
    
    const memberMessage = await db.memberMessage.create({
      data: {
        memberId,
        subject,
        message,
      },
    });
    
    return NextResponse.json(memberMessage);
  } catch (error) {
    console.error("Error creating member message:", error);
    return NextResponse.json({ error: "Failed to create member message" }, { status: 500 });
  }
}
