import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

// Create executive members (president, secretary, treasurer, deputy)
export async function GET() {
  try {
    // Check if executive members already exist
    const existingPresident = await db.admin.findUnique({
      where: { username: "president" }
    });

    if (existingPresident) {
      return NextResponse.json({ 
        message: "Executive members already exist",
        members: await db.admin.findMany({
          where: { role: { in: ["president", "general_secretary", "treasurer", "deputy"] } }
        })
      });
    }

    const hashedPassword = await bcrypt.hash("admin123", 10);

    // Create executive members
    const president = await db.admin.create({
      data: {
        username: "president",
        password: hashedPassword,
        name: "الرئيس",
        email: "president@aos-sidibouknadel.ma",
        role: "president",
        positionAr: "الرئيس",
        positionFr: "Président",
        permissions: "all",
        active: true
      }
    });

    const secretary = await db.admin.create({
      data: {
        username: "secretary",
        password: hashedPassword,
        name: "الكاتب العام",
        email: "secretary@aos-sidibouknadel.ma",
        role: "general_secretary",
        positionAr: "الكاتب العام",
        positionFr: "Secrétaire Général",
        permissions: "news,members,documents,messages",
        active: true
      }
    });

    const treasurer = await db.admin.create({
      data: {
        username: "treasurer",
        password: hashedPassword,
        name: "أمين المال",
        email: "treasurer@aos-sidibouknadel.ma",
        role: "treasurer",
        positionAr: "أمين المال",
        positionFr: "Trésorier",
        permissions: "finance,reports,members",
        active: true
      }
    });

    const deputy = await db.admin.create({
      data: {
        username: "deputy",
        password: hashedPassword,
        name: "النائب",
        email: "deputy@aos-sidibouknadel.ma",
        role: "deputy",
        positionAr: "النائب",
        positionFr: "Vice-Président",
        permissions: "news,members,messages",
        active: true
      }
    });

    // Update the default admin to have proper permissions
    await db.admin.updateMany({
      where: { username: "admin" },
      data: {
        name: "مدير الموقع",
        role: "admin",
        positionAr: "مدير النظام",
        positionFr: "Administrateur",
        permissions: "all"
      }
    });

    return NextResponse.json({ 
      message: "Executive members created successfully",
      credentials: [
        { username: "president", password: "admin123", role: "الرئيس" },
        { username: "secretary", password: "admin123", role: "الكاتب العام" },
        { username: "treasurer", password: "admin123", role: "أمين المال" },
        { username: "deputy", password: "admin123", role: "النائب" },
        { username: "admin", password: "admin123", role: "مدير النظام" }
      ],
      members: [president, secretary, treasurer, deputy]
    });
  } catch (error) {
    console.error("Error creating executive members:", error);
    return NextResponse.json({ error: "Failed to create executive members" }, { status: 500 });
  }
}
