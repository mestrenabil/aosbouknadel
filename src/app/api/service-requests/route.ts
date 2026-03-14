import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendNotification, notificationTemplates } from "@/lib/notifications";

// GET - Fetch all service requests
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const memberId = searchParams.get("memberId");
    
    const where = memberId ? { memberId } : {};
    
    const requests = await db.serviceRequest.findMany({
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
    
    return NextResponse.json(requests);
  } catch (error) {
    console.error("Error fetching service requests:", error);
    return NextResponse.json({ error: "Failed to fetch service requests" }, { status: 500 });
  }
}

// POST - Create new service request
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { memberId, serviceId, titleAr, titleFr, descriptionAr, descriptionFr, priority } = body;
    
    // Get member info for notification
    const member = await db.member.findUnique({
      where: { id: memberId },
      select: { id: true, nameAr: true, nameFr: true, whatsapp: true, phone: true },
    });
    
    if (!member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }
    
    const serviceRequest = await db.serviceRequest.create({
      data: {
        memberId,
        serviceId,
        titleAr,
        titleFr,
        descriptionAr,
        descriptionFr,
        priority: priority || "normal",
      },
    });
    
    // Send confirmation notification to member
    try {
      const template = notificationTemplates.newRequestConfirmed(
        member.nameAr,
        titleAr
      );
      await sendNotification({
        memberId: member.id,
        type: "new_request",
        title: template.title,
        message: template.message,
      });
    } catch (notifError) {
      console.error("Failed to send notification:", notifError);
      // Don't fail the request if notification fails
    }
    
    return NextResponse.json(serviceRequest);
  } catch (error) {
    console.error("Error creating service request:", error);
    return NextResponse.json({ error: "Failed to create service request" }, { status: 500 });
  }
}
