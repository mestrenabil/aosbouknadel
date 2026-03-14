import { db } from "@/lib/db";

async function seed() {
  console.log("Seeding database...");

  // Create default admin if not exists
  const existingAdmin = await db.admin.findFirst();
  if (!existingAdmin) {
    await db.admin.create({
      data: {
        username: "admin",
        password: "admin123",
        name: "مدير الموقع",
        email: "admin@aos-sidibouknadel.ma",
      },
    });
    console.log("Created default admin");
  }

  // Create stats
  const existingStats = await db.stat.findFirst();
  if (!existingStats) {
    await db.stat.createMany({
      data: [
        { key: "members", value: "500+", labelAr: "عضو نشط", labelFr: "Membres Actifs", icon: "Users", order: 1 },
        { key: "beneficiaries", value: "1200+", labelAr: "مستفيد", labelFr: "Bénéficiaires", icon: "Heart", order: 2 },
        { key: "years", value: "20+", labelAr: "سنة من الخدمة", labelFr: "Années de Service", icon: "Award", order: 3 },
        { key: "projects", value: "150+", labelAr: "مشروع منجز", labelFr: "Projets Réalisés", icon: "Building2", order: 4 },
      ],
    });
    console.log("Created stats");
  }

  // Create services
  const existingServices = await db.service.findFirst();
  if (!existingServices) {
    await db.service.createMany({
      data: [
        {
          titleAr: "التغطية الصحية",
          titleFr: "Couverture Santé",
          descriptionAr: "دعم المصاريف الطبية والتغطية الصحية للأعضاء وأسرهم",
          descriptionFr: "Soutien des frais médicaux et couverture santé pour les membres et leurs familles",
          icon: "Stethoscope",
          color: "red",
          order: 1,
        },
        {
          titleAr: "المنح الدراسية",
          titleFr: "Bourses d'Études",
          descriptionAr: "منح دراسية لأبناء الموظفين في مختلف المستويات التعليمية",
          descriptionFr: "Bourses d'études pour les enfants des fonctionnaires à tous les niveaux",
          icon: "GraduationCap",
          color: "blue",
          order: 2,
        },
        {
          titleAr: "القروض الاجتماعية",
          titleFr: "Prêts Sociaux",
          descriptionAr: "قروض ميسرة لمواجهة الظروف الطارئة والاحتياجات الملحة",
          descriptionFr: "Prêts avantageux pour faire face aux circonstances urgentes",
          icon: "Gift",
          color: "amber",
          order: 3,
        },
        {
          titleAr: "عمرة وحج",
          titleFr: "Omra et Hajj",
          descriptionAr: "دعم مالي وتنظيم رحلات العمرة والحج للموظفين",
          descriptionFr: "Soutien financier et organisation de voyages pour Omra et Hajj",
          icon: "Plane",
          color: "emerald",
          order: 4,
        },
        {
          titleAr: "المساعدات الاجتماعية",
          titleFr: "Aides Sociales",
          descriptionAr: "مساعدات مالية وعينية للحالات الاجتماعية الصعبة",
          descriptionFr: "Aides financières et matérielles pour les cas sociaux difficiles",
          icon: "Users",
          color: "purple",
          order: 5,
        },
        {
          titleAr: "الأنشطة والرحلات",
          titleFr: "Activités et Excursions",
          descriptionAr: "تنظيم رحلات ترفيهية وأنشطة ثقافية للأعضاء وعائلاتهم",
          descriptionFr: "Organisation d'excursions et d'activités culturelles pour les membres",
          icon: "Calendar",
          color: "teal",
          order: 6,
        },
      ],
    });
    console.log("Created services");
  }

  // Create news
  const existingNews = await db.news.findFirst();
  if (!existingNews) {
    await db.news.createMany({
      data: [
        {
          titleAr: "افتتاح باب التسجيل للرحلة السنوية",
          titleFr: "Ouverture des inscriptions pour l'excursion annuelle",
          contentAr: "يسر الجمعية الإعلان عن فتح باب التسجيل للرحلة السنوية المقررة خلال العطلة المقبلة.",
          contentFr: "L'association a le plaisir d'annoncer l'ouverture des inscriptions pour l'excursion annuelle prévue pendant les prochaines vacances.",
          date: new Date("2025-01-15"),
          featured: true,
        },
        {
          titleAr: "توزيع المنح الدراسية للسنة الجارية",
          titleFr: "Distribution des bourses d'études",
          contentAr: "تم توزيع المنح الدراسية على المستفيدين لسنة 2025 في حفل رسمي.",
          contentFr: "Les bourses d'études ont été distribuées aux bénéficiaires pour l'année 2025 lors d'une cérémonie officielle.",
          date: new Date("2025-01-10"),
        },
        {
          titleAr: "اجتماع الجمعية العمومية",
          titleFr: "Assemblée Générale Ordinaire",
          contentAr: "دعوة لحضور الجمعية العمومية العادية يوم السبت القادم على الساعة 10 صباحا.",
          contentFr: "Invitation à assister à l'assemblée générale ordinaire samedi prochain à 10h00.",
          date: new Date("2025-01-05"),
        },
      ],
    });
    console.log("Created news");
  }

  // Create partners
  const existingPartners = await db.partner.findFirst();
  if (!existingPartners) {
    await db.partner.createMany({
      data: [
        {
          nameAr: "جماعة سيدي أبي القنادل",
          nameFr: "Commune de Sidi Bouknadel",
          descriptionAr: "الجماعة الترابية لسيدي أبي القنادل",
          descriptionFr: "La commune territoriale de Sidi Bouknadel",
          order: 1,
        },
        {
          nameAr: "المندوبية السامية للتخطيط",
          nameFr: "Haut-Commissariat au Plan",
          descriptionAr: "المندوبية السامية للتخطيط",
          descriptionFr: "Haut-Commissariat au Plan",
          order: 2,
        },
        {
          nameAr: "صندوق الضمان الاجتماعي",
          nameFr: "CNSS",
          descriptionAr: "الصندوق الوطني للضمان الاجتماعي",
          descriptionFr: "Caisse Nationale de Sécurité Sociale",
          order: 3,
        },
        {
          nameAr: "المكتب الوطني للماء والكهرباء",
          nameFr: "ONEE",
          descriptionAr: "المكتب الوطني للكهرباء والماء الصالح للشرب",
          descriptionFr: "Office National de l'Électricité et de l'Eau Potable",
          order: 4,
        },
      ],
    });
    console.log("Created partners");
  }

  // Create board members
  const existingBoardMembers = await db.boardMember.findFirst();
  if (!existingBoardMembers) {
    await db.boardMember.createMany({
      data: [
        {
          nameAr: "محمد المصطفي",
          nameFr: "Mohamed El Mostafa",
          titleAr: "الرئيس",
          titleFr: "Président",
          bioAr: "رئيس الجمعية منذ 2020، ذو خبرة واسعة في العمل الجمعوي",
          bioFr: "Président de l'association depuis 2020, grande expérience dans le travail associatif",
          order: 1,
        },
        {
          nameAr: "فاطمة الزهراء",
          nameFr: "Fatima Ezzahra",
          titleAr: "نائب الرئيس",
          titleFr: "Vice-Présidente",
          bioAr: "نائب الرئيس المسؤولة عن الشؤون الاجتماعية",
          bioFr: "Vice-Présidente responsable des affaires sociales",
          order: 2,
        },
        {
          nameAr: "أحمد الإدريسي",
          nameFr: "Ahmed Idrissi",
          titleAr: "الكاتب العام",
          titleFr: "Secrétaire Général",
          bioAr: "مسؤول عن الإدارة والتنظيم",
          bioFr: "Responsable de l'administration et de l'organisation",
          order: 3,
        },
        {
          nameAr: "خديجة العلوي",
          nameFr: "Khadija Alaoui",
          titleAr: "أمين المال",
          titleFr: "Trésorière",
          bioAr: "مسؤولة عن الشؤون المالية",
          bioFr: "Responsable des affaires financières",
          order: 4,
        },
        {
          nameAr: "عبدالله الفاسي",
          nameFr: "Abdellah Fassi",
          titleAr: "مستشار",
          titleFr: "Conseiller",
          bioAr: "مستشار في الشؤون القانونية",
          bioFr: "Conseiller aux affaires juridiques",
          order: 5,
        },
      ],
    });
    console.log("Created board members");
  }

  // Create committees with members
  const existingCommittees = await db.committee.findFirst();
  if (!existingCommittees) {
    // Create committees
    const socialCommittee = await db.committee.create({
      data: {
        nameAr: "لجنة الشؤون الاجتماعية",
        nameFr: "Commission des Affaires Sociales",
        descriptionAr: "تتكفل بالمساعدات الاجتماعية ودعم الحالات المحتاجة",
        descriptionFr: "S'occupe des aides sociales et du soutien des cas nécessiteux",
        icon: "Heart",
        color: "red",
        order: 1,
      },
    });

    const culturalCommittee = await db.committee.create({
      data: {
        nameAr: "اللجنة الثقافية والترفيهية",
        nameFr: "Commission Culturelle et Récréative",
        descriptionAr: "تنظم الأنشطة الثقافية والرحلات والملتقيات",
        descriptionFr: "Organise les activités culturelles, les excursions et les rencontres",
        icon: "Calendar",
        color: "blue",
        order: 2,
      },
    });

    const financeCommittee = await db.committee.create({
      data: {
        nameAr: "لجنة الشؤون المالية",
        nameFr: "Commission des Affaires Financières",
        descriptionAr: "تدير الموارد المالية للجمعية وتدرس ملفات القروض",
        descriptionFr: "Gère les ressources financières de l'association et étudie les dossiers de prêts",
        icon: "Gift",
        color: "emerald",
        order: 3,
      },
    });

    const sportCommittee = await db.committee.create({
      data: {
        nameAr: "اللجنة الرياضية",
        nameFr: "Commission Sportive",
        descriptionAr: "تنظم الأنشطة الرياضية والمسابقات",
        descriptionFr: "Organise les activités sportives et les compétitions",
        icon: "Users",
        color: "teal",
        order: 4,
      },
    });

    const religiousCommittee = await db.committee.create({
      data: {
        nameAr: "اللجنة الدينية",
        nameFr: "Commission Religieuse",
        descriptionAr: "تتكفل بتنظيم رحلات العمرة والحج والأنشطة الدينية",
        descriptionFr: "S'occupe de l'organisation des voyages Omra et Hajj et des activités religieuses",
        icon: "Plane",
        color: "purple",
        order: 5,
      },
    });

    // Add members to committees
    await db.committeeMember.createMany({
      data: [
        // Social committee members
        { committeeId: socialCommittee.id, nameAr: "فاطمة الزهراء", nameFr: "Fatima Ezzahra", titleAr: "رئيسة اللجنة", titleFr: "Présidente", order: 1 },
        { committeeId: socialCommittee.id, nameAr: "عائشة بنموسى", nameFr: "Aïcha Benmoussa", titleAr: "عضو", titleFr: "Membre", order: 2 },
        { committeeId: socialCommittee.id, nameAr: "حسن الطاهري", nameFr: "Hassan Tahiri", titleAr: "عضو", titleFr: "Membre", order: 3 },
        
        // Cultural committee members
        { committeeId: culturalCommittee.id, nameAr: "مريم السلهامي", nameFr: "Myriam Selhami", titleAr: "رئيسة اللجنة", titleFr: "Présidente", order: 1 },
        { committeeId: culturalCommittee.id, nameAr: "يوسف الحسني", nameFr: "Youssef El Hassani", titleAr: "عضو", titleFr: "Membre", order: 2 },
        
        // Finance committee members
        { committeeId: financeCommittee.id, nameAr: "خديجة العلوي", nameFr: "Khadija Alaoui", titleAr: "رئيسة اللجنة", titleFr: "Présidente", order: 1 },
        { committeeId: financeCommittee.id, nameAr: "محمد الشرقاوي", nameFr: "Mohamed Cherkaoui", titleAr: "عضو", titleFr: "Membre", order: 2 },
        
        // Sport committee members
        { committeeId: sportCommittee.id, nameAr: "كريم العمراني", nameFr: "Karim Amrani", titleAr: "رئيس اللجنة", titleFr: "Président", order: 1 },
        { committeeId: sportCommittee.id, nameAr: "سعيد بوجمعة", nameFr: "Saïd Boujemaa", titleAr: "عضو", titleFr: "Membre", order: 2 },
        
        // Religious committee members
        { committeeId: religiousCommittee.id, nameAr: "عبدالرحمن الفاسي", nameFr: "Abderrahmane Fassi", titleAr: "رئيس اللجنة", titleFr: "Président", order: 1 },
        { committeeId: religiousCommittee.id, nameAr: "مصطفى الكتاني", nameFr: "Mostafa Kettani", titleAr: "عضو", titleFr: "Membre", order: 2 },
      ],
    });
    console.log("Created committees with members");
  }

  // Create a test member
  const existingMember = await db.member.findFirst();
  if (!existingMember) {
    await db.member.create({
      data: {
        memberNumber: "M001",
        nationalId: "AB123456",
        password: "member123",
        nameAr: "أحمد محمد",
        nameFr: "Ahmed Mohamed",
        email: "ahmed@example.com",
        phone: "+212612345678",
        department: "القسم الإداري",
      },
    });
    console.log("Created test member (M001 / member123)");
  }

  console.log("Seeding completed!");
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
