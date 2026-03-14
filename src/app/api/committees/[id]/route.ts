import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET - Fetch single committee
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const committee = await db.committee.findUnique({
      where: { id },
      include: {
        members: {
          orderBy: { order: "asc" },
        },
      },
    });
    
    if (!committee) {
      return NextResponse.json({ error: "Committee not found" }, { status: 404 });
    }
    
    return NextResponse.json(committee);
  } catch (error) {
    console.error("Error fetching committee:", error);
    return NextResponse.json({ error: "Failed to fetch committee" }, { status: 500 });
  }
}

// PUT - Update committee
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { nameAr, nameFr, descriptionAr, descriptionFr, icon, color, order, active, members } = body;
    
    // Update committee
    const committee = await db.committee.update({
      where: { id },
      data: {
        nameAr,
        nameFr,
        descriptionAr,
        descriptionFr,
        icon,
        color,
        order,
        active,
      },
    });
    
    // Update members if provided
    if (members) {
      // Delete existing members
      await db.committeeMember.deleteMany({
        where: { committeeId: id },
      });
      
      // Create new members
      if (members.length > 0) {
        await db.committeeMember.createMany({
          data: members.map((m: { nameAr: string; nameFr: string; titleAr?: string; titleFr?: string; order?: number }) => ({
            committeeId: id,
            nameAr: m.nameAr,
            nameFr: m.nameFr,
            titleAr: m.titleAr,
            titleFr: m.titleFr,
            order: m.order || 0,
          })),
        });
      }
    }
    
    return NextResponse.json(committee);
  } catch (error) {
    console.error("Error updating committee:", error);
    return NextResponse.json({ error: "Failed to update committee" }, { status: 500 });
  }
}

// DELETE - Delete committee
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await db.committee.delete({
      where: { id },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting committee:", error);
    return NextResponse.json({ error: "Failed to delete committee" }, { status: 500 });
  }
}
