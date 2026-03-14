import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

// Admin login
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;
    
    const admin = await db.admin.findUnique({
      where: { username },
    });
    
    if (!admin) {
      return NextResponse.json({ error: "بيانات الدخول غير صحيحة" }, { status: 401 });
    }
    
    // Check if password is hashed (starts with $2a$ or $2b$)
    let passwordMatch = false;
    if (admin.password.startsWith("$2")) {
      // Hashed password - use bcrypt
      passwordMatch = await bcrypt.compare(password, admin.password);
    } else {
      // Plain text password (legacy)
      passwordMatch = admin.password === password;
    }
    
    if (!passwordMatch) {
      return NextResponse.json({ error: "بيانات الدخول غير صحيحة" }, { status: 401 });
    }
    
    // Update last login
    await db.admin.update({
      where: { id: admin.id },
      data: { lastLogin: new Date() }
    });

    return NextResponse.json({ 
      success: true, 
      admin: { 
        id: admin.id, 
        username: admin.username, 
        name: admin.name,
        email: admin.email,
        role: admin.role,
        positionAr: admin.positionAr,
        positionFr: admin.positionFr,
        permissions: admin.permissions?.split(",").filter(Boolean) || [],
        photo: admin.photo,
        phone: admin.phone
      } 
    });
  } catch (error) {
    console.error("Error logging in:", error);
    return NextResponse.json({ error: "فشل تسجيل الدخول" }, { status: 500 });
  }
}

// Create initial admin (should be protected in production)
export async function GET() {
  try {
    const existingAdmin = await db.admin.findFirst();
    
    if (existingAdmin) {
      return NextResponse.json({ message: "Admin already exists", admin: existingAdmin.username });
    }
    
    const hashedPassword = await bcrypt.hash("admin123", 10);
    
    // Create default admin
    const admin = await db.admin.create({
      data: {
        username: "admin",
        password: hashedPassword,
        name: "مدير الموقع",
        email: "admin@aos-sidibouknadel.ma",
        role: "admin",
        positionAr: "مدير النظام",
        positionFr: "Administrateur",
        permissions: "all"
      },
    });
    
    return NextResponse.json({ 
      message: "Default admin created",
      credentials: { username: "admin", password: "admin123" }
    });
  } catch (error) {
    console.error("Error creating admin:", error);
    return NextResponse.json({ error: "Failed to create admin" }, { status: 500 });
  }
}
