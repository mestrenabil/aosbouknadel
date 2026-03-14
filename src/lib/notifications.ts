import { db } from "@/lib/db";

// WhatsApp notification service using TextMeBot API
// Documentation: https://textmebot.com/documentation-api/

interface NotificationPayload {
  memberId: string;
  type: "request_update" | "message_reply" | "new_request" | "account_update";
  title: string;
  message: string;
  data?: Record<string, string>;
}

interface WhatsAppConfig {
  enabled: boolean;
  apiKey: string;
  baseUrl: string;
}

// Check if notification models are available
function hasNotificationModels(): boolean {
  return !!(db.notificationSetting && db.notificationLog);
}

// Get notification settings from database
async function getWhatsAppConfig(): Promise<WhatsAppConfig> {
  if (!hasNotificationModels()) {
    return { enabled: false, apiKey: "", baseUrl: "" };
  }
  
  try {
    const settings = await db.notificationSetting.findMany();
    const config: WhatsAppConfig = {
      enabled: false,
      apiKey: "",
      baseUrl: "https://api.textmebot.com/send.php",
    };
    
    for (const setting of settings) {
      if (setting.key === "whatsapp_enabled" && setting.value === "true") {
        config.enabled = true;
      }
      if (setting.key === "whatsapp_api_key") {
        config.apiKey = setting.value || "";
      }
      if (setting.key === "whatsapp_base_url") {
        config.baseUrl = setting.value || config.baseUrl;
      }
    }
    
    return config;
  } catch (error) {
    console.error("Error getting WhatsApp config:", error);
    return { enabled: false, apiKey: "", baseUrl: "" };
  }
}

// Send WhatsApp message using TextMeBot API
async function sendWhatsAppMessage(phone: string, message: string): Promise<{ success: boolean; error?: string }> {
  try {
    const config = await getWhatsAppConfig();
    
    if (!config.enabled) {
      console.log("WhatsApp notifications are disabled");
      return { success: false, error: "WhatsApp notifications are disabled" };
    }
    
    if (!config.apiKey) {
      console.log("WhatsApp API key not configured");
      return { success: false, error: "WhatsApp API key not configured" };
    }
    
    // Clean phone number (remove spaces, dashes, and ensure it has country code)
    let cleanPhone = phone.replace(/[\s\-\(\)]/g, "");
    
    // Remove leading + if present
    if (cleanPhone.startsWith("+")) {
      cleanPhone = cleanPhone.substring(1);
    }
    
    // If number starts with 0, replace with Morocco country code
    if (cleanPhone.startsWith("0")) {
      cleanPhone = "212" + cleanPhone.substring(1);
    }
    
    // If no country code, assume Morocco
    if (!cleanPhone.startsWith("212") && cleanPhone.length <= 9) {
      cleanPhone = "212" + cleanPhone;
    }
    
    // TextMeBot API URL format
    // https://api.textmebot.com/send.php?recipient=212600000000&apikey=XXXX&text=Hello
    const baseUrl = config.baseUrl || "https://api.textmebot.com/send.php";
    
    // Build the API URL
    const url = new URL(baseUrl);
    url.searchParams.append("recipient", cleanPhone);
    url.searchParams.append("apikey", config.apiKey);
    url.searchParams.append("text", message);
    
    console.log("Sending WhatsApp to:", cleanPhone, "via TextMeBot");
    
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Accept": "application/json, text/plain, */*",
      },
    });
    
    const responseText = await response.text();
    console.log("TextMeBot API response:", response.status, responseText.substring(0, 300));
    
    // TextMeBot returns various success indicators
    if (
      response.ok || 
      responseText.includes("success") || 
      responseText.includes("queued") || 
      responseText.includes("sent") ||
      responseText.includes("OK") ||
      responseText.includes("Message sent")
    ) {
      return { success: true };
    } else {
      console.error("TextMeBot API error:", responseText);
      return { success: false, error: responseText.substring(0, 300) };
    }
  } catch (error) {
    console.error("Error sending WhatsApp message:", error);
    return { success: false, error: String(error) };
  }
}

// Log notification
async function logNotification(
  memberId: string | null,
  type: string,
  channel: string,
  status: string,
  message: string,
  error?: string
) {
  if (!hasNotificationModels()) return;
  
  try {
    await db.notificationLog.create({
      data: {
        memberId,
        type,
        channel,
        status,
        message,
        error,
      },
    });
  } catch (err) {
    console.error("Error logging notification:", err);
  }
}

// Main notification function
export async function sendNotification(payload: NotificationPayload): Promise<{ success: boolean; error?: string }> {
  try {
    // Get member info including WhatsApp number
    const member = await db.member.findUnique({
      where: { id: payload.memberId },
      select: {
        id: true,
        nameAr: true,
        nameFr: true,
        whatsapp: true,
        phone: true,
      },
    });
    
    if (!member) {
      return { success: false, error: "Member not found" };
    }
    
    // Use WhatsApp number if available, otherwise use phone
    const phone = member.whatsapp || member.phone;
    
    if (!phone) {
      console.log("No phone number found for member:", member.id);
      return { success: false, error: "No phone number found" };
    }
    
    // Format message
    const fullMessage = `🔔 *${payload.title}*\n\n${payload.message}\n\n━━━━━━━━━━━━━━━\nجمعية الأعمال الاجتماعية\nAssociation des Œuvres Sociales`;
    
    // Send WhatsApp message
    const result = await sendWhatsAppMessage(phone, fullMessage);
    
    // Log the notification
    await logNotification(
      member.id,
      payload.type,
      "whatsapp",
      result.success ? "sent" : "failed",
      fullMessage,
      result.error
    );
    
    return result;
  } catch (error) {
    console.error("Error in sendNotification:", error);
    return { success: false, error: String(error) };
  }
}

// Notification templates
export const notificationTemplates = {
  requestUpdate: (memberName: string, requestTitle: string, status: string, notes?: string) => ({
    title: "تحديث حالة الطلب",
    message: `مرحباً ${memberName}،\n\nتم تحديث حالة طلبك: "${requestTitle}"\n\n📊 الحالة الجديدة: ${status}${notes ? `\n\n📝 ملاحظات: ${notes}` : ""}\n\nيمكنك متابعة طلبك عبر بوابة المنخرط.`,
  }),
  
  messageReply: (memberName: string, subject: string, reply: string) => ({
    title: "رد على رسالتك",
    message: `مرحباً ${memberName}،\n\nتم الرد على رسالتك: "${subject}"\n\n💬 الرد:\n${reply}\n\nيمكنك عرض التفاصيل عبر بوابة المنخرط.`,
  }),
  
  newRequestConfirmed: (memberName: string, requestTitle: string) => ({
    title: "تم استلام طلبك",
    message: `مرحباً ${memberName}،\n\nتم استلام طلبك بنجاح: "${requestTitle}"\n\nسيتم مراجعة طلبك من قبل المكتب المسير.\n\nيمكنك متابعة حالة طلبك عبر بوابة المنخرط.`,
  }),
  
  accountActivated: (memberName: string, memberNumber: string) => ({
    title: "تفعيل الحساب",
    message: `مرحباً ${memberName}،\n\nتم تفعيل حسابك في بوابة المنخرط.\n\n🔑 رقم الانخراط: ${memberNumber}\n\nيمكنك الآن تسجيل الدخول واستخدام جميع الخدمات.`,
  }),
  
  accountDeactivated: (memberName: string) => ({
    title: "إيقاف الحساب",
    message: `مرحباً ${memberName}،\n\nتم إيقاف حسابك مؤقتاً.\n\nللمزيد من المعلومات، يرجى التواصل مع المكتب المسير.`,
  }),
};

// Initialize default notification settings (called only if models exist)
export async function initNotificationSettings() {
  if (!hasNotificationModels()) {
    console.log("Notification models not available, skipping initialization");
    return;
  }
  
  const defaultSettings = [
    { key: "whatsapp_enabled", value: "false", description: "تفعيل إرسال تنبيهات واتساب" },
    { key: "whatsapp_api_key", value: "", description: "مفتاح API من TextMeBot" },
    { key: "whatsapp_base_url", value: "https://api.textmebot.com/send.php", description: "رابط TextMeBot API" },
  ];
  
  for (const setting of defaultSettings) {
    const existing = await db.notificationSetting.findUnique({
      where: { key: setting.key },
    });
    
    if (!existing) {
      await db.notificationSetting.create({
        data: setting,
      });
    } else {
      // Update description and default URL if needed
      await db.notificationSetting.update({
        where: { key: setting.key },
        data: { description: setting.description },
      });
    }
  }
}
