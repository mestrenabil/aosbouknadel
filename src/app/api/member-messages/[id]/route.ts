import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendNotification, notificationTemplates } from "@/lib/notifications";

// PUT - Reply to message or mark as read
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { reply, read } = body;
    
    // Get current message with member info
    const currentMessage = await db.memberMessage.findUnique({
      where: { id },
      include: {
        member: {
          select: {
            id: true,
            nameAr: true,
            nameFr: true,
            whatsapp: true,
            phone: true,
          },
        },
      },
    });
    
    if (!currentMessage) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }
    
    const updateData: { reply?: string; read?: boolean; replied?: boolean } = {};
    
    if (reply !== undefined) {
      updateData.reply = reply;
      updateData.replied = true;
    }
    
    if (read !== undefined) {
      updateData.read = read;
    }
    
    const message = await db.memberMessage.update({
      where: { id },
      data: updateData,
    });
    
    // Send WhatsApp notification when a reply is sent
    if (reply && !currentMessage.replied) {
      try {
        const template = notificationTemplates.messageReply(
          currentMessage.member.nameAr,
          currentMessage.subject,
          reply
        );
        
        await sendNotification({
          memberId: currentMessage.member.id,
          type: "message_reply",
          title: template.title,
          message: template.message,
        });
      } catch (notifError) {
        console.error("Failed to send notification:", notifError);
        // Don't fail the request if notification fails
      }
    }
    
    return NextResponse.json(message);
  } catch (error) {
    console.error("Error updating member message:", error);
    return NextResponse.json({ error: "Failed to update member message" }, { status: 500 });
  }
}

// DELETE - Delete member message
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await db.memberMessage.delete({
      where: { id },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting member message:", error);
    return NextResponse.json({ error: "Failed to delete member message" }, { status: 500 });
  }
}
