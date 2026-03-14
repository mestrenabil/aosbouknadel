import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET - Fetch notification logs
export async function GET(request: NextRequest) {
  try {
    // Check if notificationLog model exists
    if (!db.notificationLog) {
      return NextResponse.json([]); // Return empty array if model doesn't exist
    }
    
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50");
    
    const logs = await db.notificationLog.findMany({
      take: limit,
      orderBy: { createdAt: "desc" },
    });
    
    return NextResponse.json(logs);
  } catch (error) {
    console.error("Error fetching notification logs:", error);
    return NextResponse.json({ error: "Failed to fetch notification logs" }, { status: 500 });
  }
}
