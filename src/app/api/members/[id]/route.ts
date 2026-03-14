import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendNotification, notificationTemplates } from "@/lib/notifications";

// Member login
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { memberNumber, password } = body;
    
    const member = await db.member.findUnique({
      where: { memberNumber },
    });
    
    if (!member || member.password !== password) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }
    
    if (!member.active) {
      return NextResponse.json({ error: "Account is not active" }, { status: 403 });
    }
    
    return NextResponse.json({
      success: true,
      member: {
        id: member.id,
        memberNumber: member.memberNumber,
        nameAr: member.nameAr,
        nameFr: member.nameFr,
        email: member.email,
        phone: member.phone,
        whatsapp: member.whatsapp,
        department: member.department,
      },
    });
  } catch (error) {
    console.error("Error logging in:", error);
    return NextResponse.json({ error: "Failed to login" }, { status: 500 });
  }
}

// GET - Fetch single member
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const member = await db.member.findUnique({
      where: { id },
      select: {
        id: true,
        memberNumber: true,
        nameAr: true,
        nameFr: true,
        email: true,
        phone: true,
        whatsapp: true,
        department: true,
        joinDate: true,
        active: true,
      },
    });
    
    if (!member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }
    
    return NextResponse.json(member);
  } catch (error) {
    console.error("Error fetching member:", error);
    return NextResponse.json({ error: "Failed to fetch member" }, { status: 500 });
  }
}

// PUT - Update member
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    // Get current member state
    const currentMember = await db.member.findUnique({
      where: { id },
      select: { active: true, nameAr: true, memberNumber: true, whatsapp: true },
    });
    
    if (!currentMember) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    // Prepare update data
    const updateData: Record<string, unknown> = {};
    if (body.nameAr !== undefined) updateData.nameAr = body.nameAr;
    if (body.nameFr !== undefined) updateData.nameFr = body.nameFr;
    if (body.email !== undefined) updateData.email = body.email;
    if (body.phone !== undefined) updateData.phone = body.phone;
    if (body.whatsapp !== undefined) updateData.whatsapp = body.whatsapp;
    if (body.department !== undefined) updateData.department = body.department;
    if (body.active !== undefined) updateData.active = body.active;
    if (body.nationalId !== undefined) updateData.nationalId = body.nationalId.toUpperCase();
    
    const member = await db.member.update({
      where: { id },
      data: updateData,
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
      },
    });
    
    // Send notification if active status changed
    if (body.active !== undefined && body.active !== currentMember.active) {
      try {
        if (body.active) {
          // Account activated
          const template = notificationTemplates.accountActivated(
            member.nameAr,
            member.memberNumber
          );
          await sendNotification({
            memberId: member.id,
            type: "account_update",
            title: template.title,
            message: template.message,
          });
        } else {
          // Account deactivated
          const template = notificationTemplates.accountDeactivated(member.nameAr);
          await sendNotification({
            memberId: member.id,
            type: "account_update",
            title: template.title,
            message: template.message,
          });
        }
      } catch (notifError) {
        console.error("Failed to send notification:", notifError);
      }
    }
    
    return NextResponse.json(member);
  } catch (error) {
    console.error("Error updating member:", error);
    return NextResponse.json({ error: "Failed to update member" }, { status: 500 });
  }
}

// DELETE - Delete member
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await db.member.delete({
      where: { id },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting member:", error);
    return NextResponse.json({ error: "Failed to delete member" }, { status: 500 });
  }
}
