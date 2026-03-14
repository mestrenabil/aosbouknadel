"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { 
  Heart, 
  Users, 
  Building2, 
  GraduationCap, 
  Stethoscope, 
  Plane, 
  Gift, 
  Phone, 
  Mail, 
  MapPin, 
  Clock,
  ChevronDown,
  Menu,
  X,
  Calendar,
  Newspaper,
  Handshake,
  Shield,
  Award,
  Globe,
  Facebook,
  MessageCircle,
  Settings,
  Loader2,
  CheckCircle,
  User,
  UserCog
} from "lucide-react";

// Types
interface Partner {
  id: string;
  nameAr: string;
  nameFr: string;
  descriptionAr?: string;
  descriptionFr?: string;
  logo?: string;
  website?: string;
}

interface News {
  id: string;
  titleAr: string;
  titleFr: string;
  contentAr: string;
  contentFr: string;
  date: string;
  image?: string;
  featured: boolean;
}

interface Service {
  id: string;
  titleAr: string;
  titleFr: string;
  descriptionAr: string;
  descriptionFr: string;
  icon: string;
  color: string;
}

interface Stat {
  id: string;
  key: string;
  value: string;
  labelAr: string;
  labelFr: string;
  icon: string;
}

interface BoardMember {
  id: string;
  nameAr: string;
  nameFr: string;
  titleAr: string;
  titleFr: string;
  photo?: string;
  bioAr?: string;
  bioFr?: string;
  email?: string;
  phone?: string;
}

interface CommitteeMember {
  id: string;
  nameAr: string;
  nameFr: string;
  titleAr?: string;
  titleFr?: string;
}

interface Committee {
  id: string;
  nameAr: string;
  nameFr: string;
  descriptionAr?: string;
  descriptionFr?: string;
  icon: string;
  color: string;
  members: CommitteeMember[];
}

// Icon mapping
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Users,
  Heart,
  Award,
  Building2,
  Stethoscope,
  GraduationCap,
  Gift,
  Plane,
  Calendar,
};

// Translation content
const translations = {
  ar: {
    nav: {
      home: "الرئيسية",
      about: "من نحن",
      services: "خدماتنا",
      board: "المكتب المسير",
      committees: "اللجن",
      partners: "شركاؤنا",
      news: "الأخبار",
      contact: "اتصل بنا",
      admin: "لوحة التحكم",
      memberPortal: "بوابة المنخرط",
    },
    hero: {
      title: "جمعية الأعمال الاجتماعية",
      subtitle: "لموظفي وأعوان جماعة سيدي أبي القنادل",
      description: "نخدم موظفي الجماعة وأسرهم منذ سنوات عديدة، نقدم الدعم والمساعدة في جميع المجالات الاجتماعية",
      cta: "اكتشف خدماتنا",
      contact: "تواصل معنا",
      memberPortal: "بوابة المنخرط",
    },
    board: {
      title: "المكتب المسير",
      subtitle: "أعضاء المكتب المسير للجمعية",
    },
    committees: {
      title: "اللجن",
      subtitle: "اللجن المكونة للجمعية",
      members: "الأعضاء",
    },
    partners: {
      title: "شركاؤنا",
      subtitle: "نتعاون مع أفضل المؤسسات لخدمتكم",
    },
    news: {
      title: "آخر الأخبار",
      subtitle: "تابع آخر مستجدات الجمعية",
      readMore: "اقرأ المزيد",
      allNews: "جميع الأخبار",
    },
    about: {
      title: "من نحن",
      subtitle: "تعرف على جمعيتنا",
      description: "تأسست جمعية الأعمال الاجتماعية لموظفي وأعوان جماعة سيدي أبي القنادل بهدف تقديم الدعم الاجتماعي والمالي للموظفين وأسرهم.",
      mission: "مهمتنا",
      missionText: "تحسين الظروف الاجتماعية والمعيشية لموظفي الجماعة وأسرهم.",
      vision: "رؤيتنا",
      visionText: "أن نكون المرجع الأول في الدعم الاجتماعي للموظفين العموميين.",
      values: "قيمنا",
      valuesList: ["الشفافية", "التضامن", "الاحترافية", "المصداقية"],
    },
    contact: {
      title: "اتصل بنا",
      subtitle: "نحن هنا لمساعدتك",
      name: "الاسم الكامل",
      email: "البريد الإلكتروني",
      phone: "رقم الهاتف",
      message: "رسالتك",
      send: "إرسال الرسالة",
      sending: "جاري الإرسال...",
      success: "تم إرسال رسالتك بنجاح!",
      address: "العنوان",
      addressText: "جماعة سيدي أبي القنادل، إقليم سلا، المملكة المغربية",
      phoneText: "+212 5XX XX XX XX",
      emailText: "contact@aos-sidibouknadel.ma",
      hours: "أوقات العمل",
      hoursText: "الإثنين - الجمعة: 8:30 - 16:30",
    },
    footer: {
      description: "جمعية الأعمال الاجتماعية لموظفي وأعوان جماعة سيدي أبي القنادل",
      quickLinks: "روابط سريعة",
      contactUs: "تواصل معنا",
      rights: "جميع الحقوق محفوظة",
    },
  },
  fr: {
    nav: {
      home: "Accueil",
      about: "À propos",
      services: "Nos Services",
      board: "Bureau Directeur",
      committees: "Commissions",
      partners: "Nos Partenaires",
      news: "Actualités",
      contact: "Contact",
      admin: "Administration",
      memberPortal: "Portail Membre",
    },
    hero: {
      title: "Association des Œuvres Sociales",
      subtitle: "des Fonctionnaires et Agents de la Commune de Sidi Bouknadel",
      description: "Au service des fonctionnaires de la commune et de leurs familles depuis de nombreuses années",
      cta: "Découvrir nos services",
      contact: "Contactez-nous",
      memberPortal: "Portail des Membres",
    },
    board: {
      title: "Bureau Directeur",
      subtitle: "Membres du Bureau Directeur de l'Association",
    },
    committees: {
      title: "Commissions",
      subtitle: "Les Commissions de l'Association",
      members: "Membres",
    },
    partners: {
      title: "Nos Partenaires",
      subtitle: "Nous collaborons avec les meilleures institutions",
    },
    news: {
      title: "Dernières Actualités",
      subtitle: "Suivez les dernières nouvelles de l'association",
      readMore: "Lire la suite",
      allNews: "Toutes les actualités",
    },
    about: {
      title: "À Propos",
      subtitle: "Découvrez notre association",
      description: "L'Association des Œuvres Sociales a été fondée pour fournir un soutien social et financier aux fonctionnaires et à leurs familles.",
      mission: "Notre Mission",
      missionText: "Améliorer les conditions sociales et de vie des fonctionnaires et de leurs familles.",
      vision: "Notre Vision",
      visionText: "Être la référence en matière de soutien social pour les fonctionnaires.",
      values: "Nos Valeurs",
      valuesList: ["Transparence", "Solidarité", "Professionnalisme", "Crédibilité"],
    },
    contact: {
      title: "Contactez-nous",
      subtitle: "Nous sommes là pour vous aider",
      name: "Nom Complet",
      email: "Adresse Email",
      phone: "Numéro de Téléphone",
      message: "Votre Message",
      send: "Envoyer le Message",
      sending: "Envoi en cours...",
      success: "Votre message a été envoyé avec succès!",
      address: "Adresse",
      addressText: "Commune de Sidi Bouknadel, Province de Salé, Maroc",
      phoneText: "+212 5XX XX XX XX",
      emailText: "contact@aos-sidibouknadel.ma",
      hours: "Heures d'Ouverture",
      hoursText: "Lundi - Vendredi: 8h30 - 16h30",
    },
    footer: {
      description: "Association des Œuvres Sociales des Fonctionnaires et Agents de la Commune de Sidi Bouknadel",
      quickLinks: "Liens Rapides",
      contactUs: "Nous Contacter",
      rights: "Tous droits réservés",
    },
  },
};

type Language = "ar" | "fr";

export default function Home() {
  const [lang, setLang] = useState<Language>("ar");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const t = translations[lang];
  const isArabic = lang === "ar";

  // Data states
  const [partners, setPartners] = useState<Partner[]>([]);
  const [news, setNews] = useState<News[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [stats, setStats] = useState<Stat[]>([]);
  const [boardMembers, setBoardMembers] = useState<BoardMember[]>([]);
  const [committees, setCommittees] = useState<Committee[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Contact form state
  const [contactForm, setContactForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Fetch all data
  useEffect(() => {
    setMounted(true);
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [partnersRes, newsRes, servicesRes, statsRes, boardRes, committeesRes] = await Promise.all([
          fetch("/api/partners"),
          fetch("/api/news"),
          fetch("/api/services"),
          fetch("/api/stats"),
          fetch("/api/board-members"),
          fetch("/api/committees"),
        ]);
        
        const [partnersData, newsData, servicesData, statsData, boardData, committeesData] = await Promise.all([
          partnersRes.json(),
          newsRes.json(),
          servicesRes.json(),
          statsRes.json(),
          boardRes.json(),
          committeesRes.json(),
        ]);
        
        setPartners(Array.isArray(partnersData) ? partnersData : []);
        setNews(Array.isArray(newsData) ? newsData : []);
        setServices(Array.isArray(servicesData) ? servicesData : []);
        setStats(Array.isArray(statsData) ? statsData : []);
        setBoardMembers(Array.isArray(boardData) ? boardData : []);
        setCommittees(Array.isArray(committeesData) ? committeesData : []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactForm),
      });
      
      if (res.ok) {
        setSubmitSuccess(true);
        setContactForm({ name: "", email: "", phone: "", message: "" });
        setTimeout(() => setSubmitSuccess(false), 5000);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col ${isArabic ? "rtl" : "ltr"}`} dir={isArabic ? "rtl" : "ltr"}>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center">
                <Handshake className="w-6 h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <p className="font-semibold text-sm text-foreground">جمعية الأعمال الاجتماعية</p>
                <p className="text-xs text-muted-foreground">Association des Œuvres Sociales</p>
              </div>
            </div>

            <nav className="hidden lg:flex items-center gap-4">
              {[
                { key: "home", id: "hero" },
                { key: "about", id: "about" },
                { key: "services", id: "services" },
                { key: "board", id: "board" },
                { key: "committees", id: "committees" },
                { key: "partners", id: "partners" },
                { key: "news", id: "news" },
                { key: "contact", id: "contact" },
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => scrollToSection(item.id)}
                  className="text-sm font-medium text-muted-foreground hover:text-emerald-600 transition-colors"
                >
                  {t.nav[item.key as keyof typeof t.nav]}
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={() => window.open("/member-portal", "_blank")}
                className="bg-emerald-600 hover:bg-emerald-700 text-white hidden sm:flex"
              >
                <User className="w-4 h-4 mr-2" />
                {t.nav.memberPortal}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => window.open("/admin", "_blank")}
                className="text-muted-foreground hover:text-emerald-600"
              >
                <Settings className="w-4 h-4" />
              </Button>
              <div className="flex items-center bg-muted rounded-lg p-1">
                <button onClick={() => setLang("ar")} className={`px-2 py-1 text-xs rounded-md transition-all ${lang === "ar" ? "bg-emerald-600 text-white" : "text-muted-foreground"}`}>العربية</button>
                <button onClick={() => setLang("fr")} className={`px-2 py-1 text-xs rounded-md transition-all ${lang === "fr" ? "bg-emerald-600 text-white" : "text-muted-foreground"}`}>Français</button>
              </div>
              <button className="lg:hidden p-2 hover:bg-muted rounded-lg" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <nav className="lg:hidden py-4 border-t border-border">
              {[
                { key: "home", id: "hero" },
                { key: "about", id: "about" },
                { key: "services", id: "services" },
                { key: "board", id: "board" },
                { key: "committees", id: "committees" },
                { key: "partners", id: "partners" },
                { key: "news", id: "news" },
                { key: "contact", id: "contact" },
              ].map((item) => (
                <button key={item.key} onClick={() => scrollToSection(item.id)} className="block w-full text-right py-2 text-muted-foreground hover:text-emerald-600">
                  {t.nav[item.key as keyof typeof t.nav]}
                </button>
              ))}
              <Separator className="my-2" />
              <Button size="sm" onClick={() => window.open("/member-portal", "_blank")} className="w-full bg-emerald-600 mt-2">
                <User className="w-4 h-4 mr-2" />
                {t.nav.memberPortal}
              </Button>
            </nav>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section id="hero" className="relative bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>
        <div className="container mx-auto px-4 py-20 md:py-32 relative">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-white/20 text-white border-white/30">
              <Award className="w-4 h-4 mr-2" />
              {isArabic ? "منذ أكثر من 20 سنة من الخدمة" : "Plus de 20 ans de service"}
            </Badge>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">{t.hero.title}</h1>
            <p className="text-xl md:text-2xl text-emerald-100 mb-6">{t.hero.subtitle}</p>
            <p className="text-lg text-emerald-50/90 mb-8 max-w-2xl mx-auto">{t.hero.description}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-emerald-700 hover:bg-emerald-50 font-semibold px-8" onClick={() => scrollToSection("services")}>
                {t.hero.cta}<ChevronDown className="w-4 h-4 ml-2 animate-bounce" />
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 font-semibold px-8" onClick={() => scrollToSection("contact")}>
                {t.hero.contact}
              </Button>
              <Button size="lg" variant="outline" className="border-emerald-300 text-emerald-100 hover:bg-emerald-600 font-semibold px-8" onClick={() => window.open("/member-portal", "_blank")}>
                <User className="w-4 h-4 mr-2" />{t.hero.memberPortal}
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" className="w-full"><path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H0Z" fill="white"/></svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {isLoading ? [1,2,3,4].map(i => <Skeleton key={i} className="h-28" />) : stats.map(stat => {
              const IconComponent = iconMap[stat.icon] || Users;
              return (
                <div key={stat.id} className="text-center p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100">
                  <IconComponent className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                  <p className="text-2xl md:text-3xl font-bold text-emerald-700">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{isArabic ? stat.labelAr : stat.labelFr}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">{t.about.subtitle}</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t.about.title}</h2>
            <Separator className="w-24 h-1 bg-emerald-600 mx-auto mb-6" />
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">{t.about.description}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <Card className="hover:shadow-lg transition-all"><CardHeader><div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4"><Shield className="w-6 h-6 text-emerald-600" /></div><CardTitle>{t.about.mission}</CardTitle></CardHeader><CardContent><p className="text-muted-foreground">{t.about.missionText}</p></CardContent></Card>
            <Card className="hover:shadow-lg transition-all"><CardHeader><div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4"><Globe className="w-6 h-6 text-teal-600" /></div><CardTitle>{t.about.vision}</CardTitle></CardHeader><CardContent><p className="text-muted-foreground">{t.about.visionText}</p></CardContent></Card>
            <Card className="hover:shadow-lg transition-all"><CardHeader><div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4"><Heart className="w-6 h-6 text-emerald-600" /></div><CardTitle>{t.about.values}</CardTitle></CardHeader><CardContent><div className="flex flex-wrap gap-2">{t.about.valuesList.map((v, i) => <Badge key={i} variant="secondary" className="bg-emerald-50 text-emerald-700">{v}</Badge>)}</div></CardContent></Card>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">{isArabic ? "ما نقدمه لأعضائنا" : "Ce que nous offrons"}</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{isArabic ? "خدماتنا" : "Nos Services"}</h2>
            <Separator className="w-24 h-1 bg-emerald-600 mx-auto" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {isLoading ? [1,2,3,4,5,6].map(i => <Card key={i}><CardHeader><Skeleton className="w-14 h-14 rounded-xl mb-4" /><Skeleton className="h-6 w-32" /></CardHeader><CardContent><Skeleton className="h-4 w-full" /></CardContent></Card>) : services.map(service => {
              const IconComponent = iconMap[service.icon] || Heart;
              const colorClass: Record<string, string> = { red: "from-red-100 to-red-200 text-red-600", blue: "from-blue-100 to-blue-200 text-blue-600", amber: "from-amber-100 to-amber-200 text-amber-600", emerald: "from-emerald-100 to-emerald-200 text-emerald-600", purple: "from-purple-100 to-purple-200 text-purple-600", teal: "from-teal-100 to-teal-200 text-teal-600" };
              return (
                <Card key={service.id} className="group hover:shadow-xl transition-all hover:-translate-y-1 hover:border-emerald-200">
                  <CardHeader>
                    <div className={`w-14 h-14 bg-gradient-to-br rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${colorClass[service.color] || colorClass.emerald}`}><IconComponent className="w-7 h-7" /></div>
                    <CardTitle className="text-lg">{isArabic ? service.titleAr : service.titleFr}</CardTitle>
                  </CardHeader>
                  <CardContent><CardDescription className="text-sm">{isArabic ? service.descriptionAr : service.descriptionFr}</CardDescription></CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Board Members Section */}
      <section id="board" className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">{t.board.subtitle}</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t.board.title}</h2>
            <Separator className="w-24 h-1 bg-emerald-600 mx-auto" />
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-12">
            {isLoading ? [1,2,3,4,5].map(i => <Card key={i}><CardContent className="pt-6 text-center"><Skeleton className="w-24 h-24 rounded-full mx-auto mb-4" /><Skeleton className="h-5 w-24 mx-auto mb-2" /><Skeleton className="h-4 w-20 mx-auto" /></CardContent></Card>) : boardMembers.map(member => (
              <Card key={member.id} className="group hover:shadow-xl transition-all text-center">
                <CardContent className="pt-6">
                  <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-emerald-100 group-hover:border-emerald-300 transition-colors">
                    <AvatarImage src={member.photo} alt={member.nameAr} />
                    <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-500 text-white text-2xl font-bold">
                      {member.nameAr.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <p className="font-semibold text-foreground">{isArabic ? member.nameAr : member.nameFr}</p>
                  <p className="text-sm text-emerald-600 font-medium">{isArabic ? member.titleAr : member.titleFr}</p>
                  {member.email && <p className="text-xs text-muted-foreground mt-2">{member.email}</p>}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Committees Section */}
      <section id="committees" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">{t.committees.subtitle}</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t.committees.title}</h2>
            <Separator className="w-24 h-1 bg-emerald-600 mx-auto" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {isLoading ? [1,2,3,4,5,6].map(i => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="w-14 h-14 rounded-xl mb-4" />
                  <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-4" />
                  <div className="space-y-2">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                  </div>
                </CardContent>
              </Card>
            )) : committees.map(committee => {
              const IconComponent = iconMap[committee.icon] || Users;
              const colorClass: Record<string, string> = {
                red: "from-red-100 to-red-200 text-red-600",
                blue: "from-blue-100 to-blue-200 text-blue-600",
                amber: "from-amber-100 to-amber-200 text-amber-600",
                emerald: "from-emerald-100 to-emerald-200 text-emerald-600",
                purple: "from-purple-100 to-purple-200 text-purple-600",
                teal: "from-teal-100 to-teal-200 text-teal-600"
              };
              return (
                <Card key={committee.id} className="group hover:shadow-xl transition-all hover:-translate-y-1 hover:border-emerald-200">
                  <CardHeader>
                    <div className={`w-14 h-14 bg-gradient-to-br rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${colorClass[committee.color] || colorClass.emerald}`}>
                      <IconComponent className="w-7 h-7" />
                    </div>
                    <CardTitle className="text-lg">{isArabic ? committee.nameAr : committee.nameFr}</CardTitle>
                    <CardDescription className="text-sm">
                      {isArabic ? committee.descriptionAr : committee.descriptionFr}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <h4 className="font-semibold mb-3 text-muted-foreground text-sm">{t.committees.members}</h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {committee.members.slice(0, 4).map(m => (
                        <div key={m.id} className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg text-sm">
                          <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
                            <UserCog className="w-4 h-4 text-emerald-600" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium truncate">{isArabic ? m.nameAr : m.nameFr}</p>
                            {m.titleAr && (
                              <p className="text-xs text-muted-foreground truncate">{isArabic ? m.titleAr : m.titleFr}</p>
                            )}
                          </div>
                        </div>
                      ))}
                      {committee.members.length > 4 && (
                        <p className="text-xs text-center text-muted-foreground pt-1">
                          +{committee.members.length - 4} {isArabic ? "أعضاء آخرين" : "autres membres"}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section id="partners" className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">{t.partners.subtitle}</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t.partners.title}</h2>
            <Separator className="w-24 h-1 bg-emerald-600 mx-auto" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            {partners.map(partner => (
              <Card key={partner.id} className="group hover:shadow-lg transition-all text-center">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    {partner.logo ? <img src={partner.logo} alt={partner.nameAr} className="w-12 h-12 object-contain" /> : <Building2 className="w-8 h-8 text-emerald-600" />}
                  </div>
                  <p className="font-semibold">{isArabic ? partner.nameAr : partner.nameFr}</p>
                  <p className="text-xs text-muted-foreground">{isArabic ? partner.nameFr : partner.nameAr}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* News Section */}
      <section id="news" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">{t.news.subtitle}</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t.news.title}</h2>
            <Separator className="w-24 h-1 bg-emerald-600 mx-auto" />
          </div>
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            {news.slice(0, 3).map(item => (
              <Card key={item.id} className="group hover:shadow-xl transition-all overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-emerald-500 to-teal-500"></div>
                <CardHeader>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Calendar className="w-4 h-4" />
                    <span suppressHydrationWarning>{new Date(item.date).toLocaleDateString(isArabic ? "ar-MA" : "fr-FR")}</span>
                  </div>
                  <CardTitle className="text-lg group-hover:text-emerald-600 transition-colors">{isArabic ? item.titleAr : item.titleFr}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm mb-4">{isArabic ? item.contentAr : item.contentFr}</p>
                  <Button variant="ghost" className="text-emerald-600 p-0">{t.news.readMore}<ChevronDown className="w-4 h-4 mr-2 rotate-[-90deg]" /></Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">{t.contact.subtitle}</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t.contact.title}</h2>
            <Separator className="w-24 h-1 bg-emerald-600 mx-auto" />
          </div>
          <div className="grid lg:grid-cols-2 gap-8 mt-12">
            <Card className="shadow-lg">
              <CardHeader><CardTitle>{t.contact.send}</CardTitle></CardHeader>
              <CardContent>
                <form onSubmit={handleContactSubmit} className="space-y-4" suppressHydrationWarning>
                  <div className="space-y-2"><Label>{t.contact.name}</Label><Input value={contactForm.name} onChange={e => setContactForm({...contactForm, name: e.target.value})} required autoComplete="name" /></div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>{t.contact.email}</Label><Input type="email" value={contactForm.email} onChange={e => setContactForm({...contactForm, email: e.target.value})} required autoComplete="email" /></div>
                    <div className="space-y-2"><Label>{t.contact.phone}</Label><Input type="tel" value={contactForm.phone} onChange={e => setContactForm({...contactForm, phone: e.target.value})} autoComplete="tel" /></div>
                  </div>
                  <div className="space-y-2"><Label>{t.contact.message}</Label><Textarea value={contactForm.message} onChange={e => setContactForm({...contactForm, message: e.target.value})} rows={4} required /></div>
                  {submitSuccess && <div className="flex items-center gap-2 text-emerald-600 text-sm bg-emerald-50 p-3 rounded-lg"><CheckCircle className="w-4 h-4" />{t.contact.success}</div>}
                  <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={isSubmitting}>{isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />{t.contact.sending}</> : t.contact.send}</Button>
                </form>
              </CardContent>
            </Card>
            <div className="space-y-4">
              <Card className="border-2 border-emerald-100 bg-gradient-to-br from-emerald-50 to-teal-50"><CardHeader><CardTitle className="flex items-center gap-2 text-base"><MapPin className="w-5 h-5 text-emerald-600" />{t.contact.address}</CardTitle></CardHeader><CardContent><p className="text-muted-foreground">{t.contact.addressText}</p></CardContent></Card>
              <Card className="border-2 border-emerald-100 bg-gradient-to-br from-emerald-50 to-teal-50"><CardHeader><CardTitle className="flex items-center gap-2 text-base"><Phone className="w-5 h-5 text-emerald-600" />{t.contact.phone}</CardTitle></CardHeader><CardContent><p className="text-muted-foreground" dir="ltr">{t.contact.phoneText}</p></CardContent></Card>
              <Card className="border-2 border-emerald-100 bg-gradient-to-br from-emerald-50 to-teal-50"><CardHeader><CardTitle className="flex items-center gap-2 text-base"><Mail className="w-5 h-5 text-emerald-600" />{t.contact.email}</CardTitle></CardHeader><CardContent><p className="text-muted-foreground">{t.contact.emailText}</p></CardContent></Card>
              <Card className="border-2 border-emerald-100 bg-gradient-to-br from-emerald-50 to-teal-50"><CardHeader><CardTitle className="flex items-center gap-2 text-base"><Clock className="w-5 h-5 text-emerald-600" />{t.contact.hours}</CardTitle></CardHeader><CardContent><p className="text-muted-foreground">{t.contact.hoursText}</p></CardContent></Card>
              <div className="flex gap-4 justify-center"><Button variant="outline" size="icon" className="rounded-full border-emerald-200 hover:bg-emerald-50"><Facebook className="w-5 h-5 text-emerald-600" /></Button><Button variant="outline" size="icon" className="rounded-full border-emerald-200 hover:bg-emerald-50"><MessageCircle className="w-5 h-5 text-emerald-600" /></Button></div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-12 mt-auto">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center"><Handshake className="w-6 h-6 text-white" /></div>
                <div><p className="font-semibold text-sm">جمعية الأعمال الاجتماعية</p><p className="text-xs text-gray-400">Association des Œuvres Sociales</p></div>
              </div>
              <p className="text-gray-400 text-sm">{t.footer.description}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">{t.footer.quickLinks}</h3>
              <ul className="space-y-2">
                {[{ key: "home", id: "hero" }, { key: "about", id: "about" }, { key: "services", id: "services" }, { key: "board", id: "board" }, { key: "committees", id: "committees" }, { key: "contact", id: "contact" }].map(item => (
                  <li key={item.key}><button onClick={() => scrollToSection(item.id)} className="text-gray-400 hover:text-emerald-400 text-sm">{t.nav[item.key as keyof typeof t.nav]}</button></li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">{t.footer.contactUs}</h3>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li className="flex items-start gap-2"><MapPin className="w-4 h-4 mt-1 text-emerald-400" /><span>{t.contact.addressText}</span></li>
                <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-emerald-400" /><span dir="ltr">{t.contact.phoneText}</span></li>
                <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-emerald-400" /><span>{t.contact.emailText}</span></li>
              </ul>
            </div>
          </div>
          <Separator className="bg-gray-700 mb-6" />
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
            <p suppressHydrationWarning>© {new Date().getFullYear()} {t.footer.rights}</p>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => window.open("/member-portal", "_blank")} className="text-gray-400 hover:text-emerald-400"><User className="w-4 h-4 mr-2" />{t.nav.memberPortal}</Button>
              <Button variant="ghost" size="sm" onClick={() => window.open("/admin", "_blank")} className="text-gray-400 hover:text-emerald-400"><Settings className="w-4 h-4 mr-2" />{t.nav.admin}</Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
