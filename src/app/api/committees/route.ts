import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET - Fetch all committees with members
export async function GET() {
  try {
    const committees = await db.committee.findMany({
      where: { active: true },
      orderBy: { order: "asc" },
      include: {
        members: {
          orderBy: { order: "asc" },
        },
      },
    });
    return NextResponse.json(committees);
  } catch (error) {
    console.error("Error fetching committees:", error);
    return NextResponse.json({ error: "Failed to fetch committees" }, { status: 500 });
  }
}

// POST - Create new committee
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nameAr, nameFr, descriptionAr, descriptionFr, icon, color, order } = body;
    
    const committee = await db.committee.create({
      data: {
        nameAr,
        nameFr,
        descriptionAr,
        descriptionFr,
        icon: icon || "Users",
        color: color || "emerald",
        order: order || 0,
      },
    });
    
    return NextResponse.json(committee);
  } catch (error) {
    console.error("Error creating committee:", error);
    return NextResponse.json({ error: "Failed to create committee" }, { status: 500 });
  }
}
