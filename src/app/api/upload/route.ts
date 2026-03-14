import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

// Allowed file types
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const ALLOWED_DOCUMENT_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "text/plain",
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const type = formData.get("type") as string || "general"; // image, document, general

    if (!file) {
      return NextResponse.json(
        { error: "لم يتم العثور على ملف" },
        { status: 400 }
      );
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "حجم الملف يتجاوز الحد المسموح (10MB)" },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = type === "image" 
      ? ALLOWED_IMAGE_TYPES 
      : type === "document" 
        ? [...ALLOWED_DOCUMENT_TYPES, ...ALLOWED_IMAGE_TYPES]
        : [...ALLOWED_IMAGE_TYPES, ...ALLOWED_DOCUMENT_TYPES];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: `نوع الملف غير مسموح به: ${file.type}` },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const fileName = `${timestamp}_${randomString}_${originalName}`;

    // Determine upload directory
    let uploadDir = "uploads/general";
    if (type === "image" || ALLOWED_IMAGE_TYPES.includes(file.type)) {
      uploadDir = "uploads/images";
    } else if (ALLOWED_DOCUMENT_TYPES.includes(file.type)) {
      uploadDir = "uploads/documents";
    }

    // Create full path
    const publicDir = path.join(process.cwd(), "public", uploadDir);
    
    // Ensure directory exists
    if (!existsSync(publicDir)) {
      await mkdir(publicDir, { recursive: true });
    }

    // Write file
    const filePath = path.join(publicDir, fileName);
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Return public URL
    const publicUrl = `/${uploadDir}/${fileName}`;

    // Determine file type for response
    let fileType = "other";
    if (ALLOWED_IMAGE_TYPES.includes(file.type)) {
      fileType = "image";
    } else if (file.type === "application/pdf") {
      fileType = "pdf";
    } else if (file.type.includes("word") || file.type.includes("document")) {
      fileType = "word";
    } else if (file.type.includes("excel") || file.type.includes("spreadsheet")) {
      fileType = "excel";
    } else if (file.type.includes("powerpoint") || file.type.includes("presentation")) {
      fileType = "powerpoint";
    }

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName: file.name,
      fileType,
      mimeType: file.type,
      fileSize: file.size,
    });

  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء رفع الملف" },
      { status: 500 }
    );
  }
}

// Handle file deletion
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fileUrl = searchParams.get("url");

    if (!fileUrl) {
      return NextResponse.json(
        { error: "لم يتم تحديد الملف" },
        { status: 400 }
      );
    }

    // Security check - only allow deleting files from uploads directory
    if (!fileUrl.startsWith("/uploads/")) {
      return NextResponse.json(
        { error: "غير مسموح بحذف هذا الملف" },
        { status: 403 }
      );
    }

    const filePath = path.join(process.cwd(), "public", fileUrl);
    
    // Check if file exists
    if (!existsSync(filePath)) {
      return NextResponse.json(
        { error: "الملف غير موجود" },
        { status: 404 }
      );
    }

    // Delete file
    const { unlink } = await import("fs/promises");
    await unlink(filePath);

    return NextResponse.json({ success: true, message: "تم حذف الملف بنجاح" });

  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء حذف الملف" },
      { status: 500 }
    );
  }
}
