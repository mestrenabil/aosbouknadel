import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET - Fetch all partners
export async function GET() {
  try {
    const partners = await db.partner.findMany({
      where: { active: true },
      orderBy: { order: "asc" },
    });
    return NextResponse.json(partners);
  } catch (error) {
    console.error("Error fetching partners:", error);
    return NextResponse.json({ error: "Failed to fetch partners" }, { status: 500 });
  }
}

// POST - Create new partner
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nameAr, nameFr, descriptionAr, descriptionFr, logo, website, order } = body;
    
    const partner = await db.partner.create({
      data: {
        nameAr,
        nameFr,
        descriptionAr,
        descriptionFr,
        logo,
        website,
        order: order || 0,
      },
    });
    
    return NextResponse.json(partner);
  } catch (error) {
    console.error("Error creating partner:", error);
    return NextResponse.json({ error: "Failed to create partner" }, { status: 500 });
  }
}
