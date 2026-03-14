import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET - Fetch single stat
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const stat = await db.stat.findUnique({
      where: { id },
    });
    
    if (!stat) {
      return NextResponse.json({ error: "Stat not found" }, { status: 404 });
    }
    
    return NextResponse.json(stat);
  } catch (error) {
    console.error("Error fetching stat:", error);
    return NextResponse.json({ error: "Failed to fetch stat" }, { status: 500 });
  }
}

// PUT - Update stat
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { key, value, labelAr, labelFr, icon, order, active } = body;
    
    const stat = await db.stat.update({
      where: { id },
      data: {
        key,
        value,
        labelAr,
        labelFr,
        icon,
        order,
        active,
      },
    });
    
    return NextResponse.json(stat);
  } catch (error) {
    console.error("Error updating stat:", error);
    return NextResponse.json({ error: "Failed to update stat" }, { status: 500 });
  }
}

// DELETE - Delete stat
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await db.stat.delete({
      where: { id },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting stat:", error);
    return NextResponse.json({ error: "Failed to delete stat" }, { status: 500 });
  }
}
