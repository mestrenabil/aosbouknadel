import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

// Complete setup - creates all necessary data
export async function GET() {
  try {
    const results = {
      database: "ok",
      admin: null as string | null,
      executiveMembers: [] as string[],
      partners: 0,
      services: 0,
      stats: 0,
      news: 0,
      boardMembers: 0,
      committees: 0,
      members: 0,
    };

    // Check if admin exists, if not create one
    const existingAdmin = await db.admin.findFirst();
    
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      
      await db.admin.create({
        data: {
          username: "admin",
          password: hashedPassword,
          name: "مدير الموقع",
          email: "admin@aos-sidibouknadel.ma",
          role: "admin",
          positionAr: "مدير النظام",
          positionFr: "Administrateur",
          permissions: "all",
          active: true
        },
      });
      
      results.admin = "created - username: admin, password: admin123";
    } else {
      results.admin = `exists - username: ${existingAdmin.username}`;
    }

    // Check executive members
    const executiveCount = await db.admin.count({
      where: { role: { in: ["president", "general_secretary", "treasurer", "deputy"] } }
    });

    if (executiveCount === 0) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      
      await db.admin.createMany({
        data: [
          {
            username: "president",
            password: hashedPassword,
            name: "الرئيس",
            email: "president@aos-sidibouknadel.ma",
            role: "president",
            positionAr: "الرئيس",
            positionFr: "Président",
            permissions: "all",
            active: true
          },
          {
            username: "secretary",
            password: hashedPassword,
            name: "الكاتب العام",
            email: "secretary@aos-sidibouknadel.ma",
            role: "general_secretary",
            positionAr: "الكاتب العام",
            positionFr: "Secrétaire Général",
            permissions: "news,members,documents,messages",
            active: true
          },
          {
            username: "treasurer",
            password: hashedPassword,
            name: "أمين المال",
            email: "treasurer@aos-sidibouknadel.ma",
            role: "treasurer",
            positionAr: "أمين المال",
            positionFr: "Trésorier",
            permissions: "finance,reports,members",
            active: true
          },
          {
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
        ]
      });
      
      results.executiveMembers = ["president", "secretary", "treasurer", "deputy"];
    } else {
      results.executiveMembers = [`${executiveCount} members already exist`];
    }

    // Count existing data
    results.partners = await db.partner.count();
    results.services = await db.service.count();
    results.stats = await db.stat.count();
    results.news = await db.news.count();
    results.boardMembers = await db.boardMember.count();
    results.committees = await db.committee.count();
    results.members = await db.member.count();

    // Create default stats if none exist
    if (results.stats === 0) {
      await db.stat.createMany({
        data: [
          { key: "members", value: "76+", labelAr: "عضو نشط", labelFr: "Membres Actifs", icon: "Users", order: 1 },
          { key: "beneficiaries", value: "300+", labelAr: "مستفيد", labelFr: "Bénéficiaires", icon: "Heart", order: 2 },
          { key: "years", value: "12+", labelAr: "سنة من الخدمة", labelFr: "Années de Service", icon: "Award", order: 3 },
          { key: "projects", value: "150+", labelAr: "مشروع منجز", labelFr: "Projets Réalisés", icon: "Building2", order: 4 },
        ]
      });
      results.stats = 4;
    }

    // Create default services if none exist
    if (results.services === 0) {
      await db.service.createMany({
        data: [
          { titleAr: "التغطية الصحية", titleFr: "Couverture Santé", descriptionAr: "دعم المصاريف الطبية والتغطية الصحية للأعضاء وأسرهم", descriptionFr: "Soutien des frais médicaux et couverture santé", icon: "Heart", color: "emerald", order: 1 },
          { titleAr: "القروض الاجتماعية", titleFr: "Prêts Sociaux", descriptionAr: "قروض بدون فائدة للأعضاء في الحالات الطارئة", descriptionFr: "Prêts sans intérêt pour les membres en cas d'urgence", icon: "Building2", color: "blue", order: 2 },
          { titleAr: "الدعم التعليمي", titleFr: "Soutien Éducatif", descriptionAr: "منح دراسية ومساعدات للأبناء", descriptionFr: "Bourses d'études et aides pour les enfants", icon: "GraduationCap", color: "purple", order: 3 },
          { titleAr: "الرحلات والنزهات", titleFr: "Voyages et Excursions", descriptionAr: "تنظيم رحلات ترفيهية للأعضاء وأسرهم", descriptionFr: "Organisation de voyages récréatifs", icon: "Plane", color: "teal", order: 4 },
          { titleAr: "المساعدات الاجتماعية", titleFr: "Aides Sociales", descriptionAr: "مساعدات مالية وعينية للحالات الاجتماعية الصعبة", descriptionFr: "Aide financière et matérielle", icon: "Gift", color: "amber", order: 5 },
          { titleAr: "الأنشطة الثقافية", titleFr: "Activités Culturelles", descriptionAr: "تنظيم ندوات ومحاضرات وأنشطة ثقافية", descriptionFr: "Organisation de conférences et activités culturelles", icon: "Calendar", color: "red", order: 6 },
        ]
      });
      results.services = 6;
    }

    // Create default partners if none exist
    if (results.partners === 0) {
      await db.partner.createMany({
        data: [
          { nameAr: "الجماعة الترابية سيدي أبي القنادل", nameFr: "Commune Sidi Bouknadel", descriptionAr: "شريك استراتيجي", descriptionFr: "Partenaire stratégique", order: 1 },
          { nameAr: "المبادرة الوطنية للتنمية البشرية", nameFr: "INDH", descriptionAr: "دعم المشاريع الاجتماعية", descriptionFr: "Soutien aux projets sociaux", order: 2 },
          { nameAr: "صندوق الضمان الاجتماعي", nameFr: "CNSS", descriptionAr: "تغطية اجتماعية", descriptionFr: "Couverture sociale", order: 3 },
          { nameAr: "الصندوق الوطني للضمان الاجتماعي", nameFr: "CNOPS", descriptionAr: "تغطية صحية", descriptionFr: "Couverture santé", order: 4 },
        ]
      });
      results.partners = 4;
    }

    // Create default board members if none exist
    if (results.boardMembers === 0) {
      await db.boardMember.createMany({
        data: [
          { nameAr: "محمد المصطفي", nameFr: "Mohamed El Mostafa", titleAr: "الرئيس", titleFr: "Président", order: 1 },
          { nameAr: "أحمد البركاني", nameFr: "Ahmed Barakani", titleAr: "الكاتب العام", titleFr: "Secrétaire Général", order: 2 },
          { nameAr: "فاطمة الزهراء", nameFr: "Fatima Zahra", titleAr: "أمينة المال", titleFr: "Trésorière", order: 3 },
          { nameAr: "يوسف العلوي", nameFr: "Youssef Alaoui", titleAr: "النائب الأول", titleFr: "Vice-Président 1", order: 4 },
          { nameAr: "خديجة البكري", nameFr: "Khadija Bekri", titleAr: "النائب الثاني", titleFr: "Vice-Présidente 2", order: 5 },
        ]
      });
      results.boardMembers = 5;
    }

    // Create default committees if none exist
    if (results.committees === 0) {
      const committee1 = await db.committee.create({
        data: {
          nameAr: "لجنة الشؤون الاجتماعية",
          nameFr: "Commission des Affaires Sociales",
          descriptionAr: "متابعة الشؤون الاجتماعية للأعضاء",
          descriptionFr: "Suivi des affaires sociales des membres",
          icon: "Heart",
          color: "emerald",
          order: 1,
        }
      });

      const committee2 = await db.committee.create({
        data: {
          nameAr: "لجنة الشؤون المالية",
          nameFr: "Commission des Affaires Financières",
          descriptionAr: "إدارة الشؤون المالية للجمعية",
          descriptionFr: "Gestion des affaires financières",
          icon: "Building2",
          color: "blue",
          order: 2,
        }
      });

      const committee3 = await db.committee.create({
        data: {
          nameAr: "لجنة الشؤون الثقافية",
          nameFr: "Commission des Affaires Culturelles",
          descriptionAr: "تنظيم الأنشطة الثقافية",
          descriptionFr: "Organisation des activités culturelles",
          icon: "Calendar",
          color: "purple",
          order: 3,
        }
      });

      const committee4 = await db.committee.create({
        data: {
          nameAr: "لجنة التواصل والعلاقات",
          nameFr: "Commission de Communication",
          descriptionAr: "التواصل مع الأعضاء والشركاء",
          descriptionFr: "Communication avec les membres et partenaires",
          icon: "Users",
          color: "teal",
          order: 4,
        }
      });

      results.committees = 4;
    }

    // Create test member if none exist
    if (results.members === 0) {
      const hashedPassword = await bcrypt.hash("member123", 10);
      
      await db.member.create({
        data: {
          memberNumber: "M001",
          nationalId: "AB123456",
          password: hashedPassword,
          nameAr: "أحمد محمد",
          nameFr: "Ahmed Mohamed",
          email: "ahmed@example.com",
          phone: "+212612345678",
          whatsapp: "+212661784248",
          department: "القسم الإداري",
          active: true,
          firstLogin: false,
          mustChangePassword: false
        }
      });
      
      results.members = 1;
    }

    return NextResponse.json({
      success: true,
      message: "Setup completed successfully!",
      data: results,
      credentials: {
        admin: { username: "admin", password: "admin123" },
        executive: [
          { username: "president", password: "admin123", role: "الرئيس" },
          { username: "secretary", password: "admin123", role: "الكاتب العام" },
          { username: "treasurer", password: "admin123", role: "أمين المال" },
          { username: "deputy", password: "admin123", role: "النائب" },
        ],
        member: { memberNumber: "M001", password: "member123" }
      }
    });
  } catch (error) {
    console.error("Setup error:", error);
    return NextResponse.json({ 
      error: "Setup failed", 
      details: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 });
  }
}
