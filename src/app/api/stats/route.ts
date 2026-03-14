import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET - Fetch all stats
export async function GET() {
  try {
    const stats = await db.stat.findMany({
      where: { active: true },
      orderBy: { order: "asc" },
    });
    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}

// POST - Create new stat
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { key, value, labelAr, labelFr, icon, order } = body;
    
    const stat = await db.stat.create({
      data: {
        key,
        value,
        labelAr,
        labelFr,
        icon: icon || "Users",
        order: order || 0,
      },
    });
    
    return NextResponse.json(stat);
  } catch (error) {
    console.error("Error creating stat:", error);
    return NextResponse.json({ error: "Failed to create stat" }, { status: 500 });
  }
}
