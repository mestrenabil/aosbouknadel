import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// Default notification settings
const defaultSettings = [
  { key: "whatsapp_enabled", value: "false", description: "تفعيل إرسال تنبيهات واتساب" },
  { key: "whatsapp_api_key", value: "", description: "المفتاح الذي حصلت عليه من TextMeBot" },
  { key: "whatsapp_base_url", value: "https://api.textmebot.com/send.php", description: "رابط TextMeBot API الافتراضي" },
];

// Initialize settings only if they don't exist (no updates on GET)
async function ensureSettingsExist() {
  for (const setting of defaultSettings) {
    const existing = await db.notificationSetting.findUnique({
      where: { key: setting.key },
    });
    
    if (!existing) {
      await db.notificationSetting.create({
        data: setting,
      });
    }
    // Removed automatic updates on GET to prevent state instability
  }
}

// GET - Fetch all notification settings
export async function GET() {
  try {
    // Check if the model exists
    if (!db.notificationSetting) {
      console.error("notificationSetting model not available on db");
      return NextResponse.json({ 
        error: "Notification settings not initialized. Please restart the server.",
        availableModels: Object.keys(db).filter(k => !k.startsWith('_') && !k.startsWith('$'))
      }, { status: 500 });
    }
    
    // Ensure settings exist with correct defaults
    await ensureSettingsExist();
    
    const settings = await db.notificationSetting.findMany({
      orderBy: { key: "asc" },
    });
    
    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error fetching notification settings:", error);
    return NextResponse.json({ error: "Failed to fetch notification settings" }, { status: 500 });
  }
}

// PUT - Update notification settings
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { settings } = body as { settings: { key: string; value: string }[] };
    
    if (!db.notificationSetting) {
      return NextResponse.json({ error: "Notification settings not initialized" }, { status: 500 });
    }
    
    for (const setting of settings) {
      await db.notificationSetting.update({
        where: { key: setting.key },
        data: { value: setting.value },
      });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating notification settings:", error);
    return NextResponse.json({ error: "Failed to update notification settings" }, { status: 500 });
  }
}
