import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

// Fix all admin passwords to be hashed
export async function GET() {
  try {
    const admins = await db.admin.findMany();
    const results = [];
    
    for (const admin of admins) {
      // Skip if password is already hashed
      if (admin.password.startsWith("$2")) {
        results.push({ username: admin.username, status: "already hashed" });
        continue;
      }
      
      // Hash the password
      const hashedPassword = await bcrypt.hash(admin.password, 10);
      
      // Update the admin
      await db.admin.update({
        where: { id: admin.id },
        data: { password: hashedPassword }
      });
      
      results.push({ username: admin.username, status: "updated", plainPassword: admin.password });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: "All passwords have been hashed",
      results 
    });
  } catch (error) {
    console.error("Error fixing passwords:", error);
    return NextResponse.json({ error: "Failed to fix passwords" }, { status: 500 });
  }
}
