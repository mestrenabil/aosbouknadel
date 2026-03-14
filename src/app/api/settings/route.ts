import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET - Fetch all settings
export async function GET() {
  try {
    const settings = await db.setting.findMany();
    const settingsMap: Record<string, { valueAr?: string; valueFr?: string; value?: string }> = {};
    settings.forEach((s) => {
      settingsMap[s.key] = {
        valueAr: s.valueAr || undefined,
        valueFr: s.valueFr || undefined,
        value: s.value || undefined,
      };
    });
    return NextResponse.json(settingsMap);
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

// POST - Update setting
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { key, valueAr, valueFr, value } = body;
    
    const setting = await db.setting.upsert({
      where: { key },
      update: { valueAr, valueFr, value },
      create: { key, valueAr, valueFr, value },
    });
    
    return NextResponse.json(setting);
  } catch (error) {
    console.error("Error updating setting:", error);
    return NextResponse.json({ error: "Failed to update setting" }, { status: 500 });
  }
}
