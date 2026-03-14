import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET - Fetch all services
export async function GET() {
  try {
    const services = await db.service.findMany({
      where: { active: true },
      orderBy: { order: "asc" },
    });
    return NextResponse.json(services);
  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 });
  }
}

// POST - Create new service
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { titleAr, titleFr, descriptionAr, descriptionFr, icon, color, order } = body;
    
    const service = await db.service.create({
      data: {
        titleAr,
        titleFr,
        descriptionAr,
        descriptionFr,
        icon: icon || "Heart",
        color: color || "emerald",
        order: order || 0,
      },
    });
    
    return NextResponse.json(service);
  } catch (error) {
    console.error("Error creating service:", error);
    return NextResponse.json({ error: "Failed to create service" }, { status: 500 });
  }
}
