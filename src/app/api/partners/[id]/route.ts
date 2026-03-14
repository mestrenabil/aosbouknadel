import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET - Fetch single partner
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const partner = await db.partner.findUnique({
      where: { id },
    });
    
    if (!partner) {
      return NextResponse.json({ error: "Partner not found" }, { status: 404 });
    }
    
    return NextResponse.json(partner);
  } catch (error) {
    console.error("Error fetching partner:", error);
    return NextResponse.json({ error: "Failed to fetch partner" }, { status: 500 });
  }
}

// PUT - Update partner
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { nameAr, nameFr, descriptionAr, descriptionFr, logo, website, order, active } = body;
    
    const partner = await db.partner.update({
      where: { id },
      data: {
        nameAr,
        nameFr,
        descriptionAr,
        descriptionFr,
        logo,
        website,
        order,
        active,
      },
    });
    
    return NextResponse.json(partner);
  } catch (error) {
    console.error("Error updating partner:", error);
    return NextResponse.json({ error: "Failed to update partner" }, { status: 500 });
  }
}

// DELETE - Delete partner
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await db.partner.delete({
      where: { id },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting partner:", error);
    return NextResponse.json({ error: "Failed to delete partner" }, { status: 500 });
  }
}
