import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET - Fetch single board member
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const member = await db.boardMember.findUnique({
      where: { id },
    });
    
    if (!member) {
      return NextResponse.json({ error: "Board member not found" }, { status: 404 });
    }
    
    return NextResponse.json(member);
  } catch (error) {
    console.error("Error fetching board member:", error);
    return NextResponse.json({ error: "Failed to fetch board member" }, { status: 500 });
  }
}

// PUT - Update board member
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const member = await db.boardMember.update({
      where: { id },
      data: body,
    });
    
    return NextResponse.json(member);
  } catch (error) {
    console.error("Error updating board member:", error);
    return NextResponse.json({ error: "Failed to update board member" }, { status: 500 });
  }
}

// DELETE - Delete board member
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await db.boardMember.delete({
      where: { id },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting board member:", error);
    return NextResponse.json({ error: "Failed to delete board member" }, { status: 500 });
  }
}
