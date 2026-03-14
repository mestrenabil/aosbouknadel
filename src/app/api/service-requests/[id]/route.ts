import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendNotification, notificationTemplates } from "@/lib/notifications";

// Status labels in Arabic
const statusLabelsAr: Record<string, string> = {
  pending: "قيد المراجعة",
  approved: "تمت الموافقة",
  rejected: "مرفوض",
  completed: "مكتمل",
};

// PUT - Update service request status
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, notes } = body;
    
    // Get the current request with member info
    const currentRequest = await db.serviceRequest.findUnique({
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
    
    if (!currentRequest) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }
    
    // Update the request
    const serviceRequest = await db.serviceRequest.update({
      where: { id },
      data: { status, notes },
      include: {
        member: {
          select: {
            id: true,
            nameAr: true,
            nameFr: true,
          },
        },
      },
    });
    
    // Send WhatsApp notification if status changed
    if (status && status !== currentRequest.status) {
      try {
        const template = notificationTemplates.requestUpdate(
          currentRequest.member.nameAr,
          currentRequest.titleAr,
          statusLabelsAr[status] || status,
          notes
        );
        
        await sendNotification({
          memberId: currentRequest.member.id,
          type: "request_update",
          title: template.title,
          message: template.message,
        });
      } catch (notifError) {
        console.error("Failed to send notification:", notifError);
        // Don't fail the request if notification fails
      }
    }
    
    return NextResponse.json(serviceRequest);
  } catch (error) {
    console.error("Error updating service request:", error);
    return NextResponse.json({ error: "Failed to update service request" }, { status: 500 });
  }
}

// DELETE - Delete service request
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await db.serviceRequest.delete({
      where: { id },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting service request:", error);
    return NextResponse.json({ error: "Failed to delete service request" }, { status: 500 });
  }
}
