"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  User,
  LogIn,
  LogOut,
  Send,
  FileText,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  Handshake,
  Briefcase,
  Stethoscope,
  GraduationCap,
  Gift,
  Plane,
  Calendar,
  Users,
  Heart,
  Key,
  UserPlus,
  Lock
} from "lucide-react";

// Types
interface Member {
  id: string;
  memberNumber: string;
  nameAr: string;
  nameFr: string;
  email: string;
  phone: string;
  whatsapp?: string;
  department: string;
  joinDate: string;
  mustChangePassword?: boolean;
}

interface Service {
  id: string;
  titleAr: string;
  titleFr: string;
  descriptionAr: string;
  descriptionFr: string;
  icon: string;
}

interface ServiceRequest {
  id: string;
  titleAr: string;
  titleFr: string;
  descriptionAr: string;
  descriptionFr?: string;
  status: string;
  priority: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface MemberMessage {
  id: string;
  subject: string;
  message: string;
  reply?: string;
  read: boolean;
  replied: boolean;
  createdAt: string;
}

// Icon mapping
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Users,
  Heart,
  Stethoscope,
  GraduationCap,
  Gift,
  Plane,
  Calendar,
};

const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  approved: "bg-emerald-100 text-emerald-700",
  rejected: "bg-red-100 text-red-700",
  completed: "bg-blue-100 text-blue-700",
};

const statusLabels: Record<string, { ar: string; fr: string }> = {
  pending: { ar: "قيد المراجعة", fr: "En attente" },
  approved: { ar: "تمت الموافقة", fr: "Approuvé" },
  rejected: { ar: "مرفوض", fr: "Rejeté" },
  completed: { ar: "مكتمل", fr: "Terminé" },
};

type AuthScreen = "login" | "register" | "changePassword";

export default function MemberPortal() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [member, setMember] = useState<Member | null>(null);
  const [lang, setLang] = useState<"ar" | "fr">("ar");
  const [mounted, setMounted] = useState(false);
  const [authScreen, setAuthScreen] = useState<AuthScreen>("login");
  const isArabic = lang === "ar";
  
  const [loginForm, setLoginForm] = useState({ memberNumber: "", password: "", nationalId: "" });
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const [changePasswordForm, setChangePasswordForm] = useState({ newPassword: "", confirmPassword: "" });
  const [changePasswordError, setChangePasswordError] = useState("");
  
  const [services, setServices] = useState<Service[]>([]);
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [messages, setMessages] = useState<MemberMessage[]>([]);
  
  const [newRequestDialog, setNewRequestDialog] = useState(false);
  const [newMessageDialog, setNewMessageDialog] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  
  const [newRequest, setNewRequest] = useState({
    titleAr: "",
    titleFr: "",
    descriptionAr: "",
    descriptionFr: "",
    priority: "normal",
  });
  
  const [newMessage, setNewMessage] = useState({
    subject: "",
    message: "",
  });

  // Check if already logged in
  useEffect(() => {
    setMounted(true);
    const savedMember = localStorage.getItem("member");
    if (savedMember) {
      const memberData = JSON.parse(savedMember);
      setMember(memberData);
      // If must change password, show change password screen
      if (memberData.mustChangePassword) {
        setAuthScreen("changePassword");
      } else {
        setIsLoggedIn(true);
      }
    }
  }, []);

  // Fetch data when logged in
  useEffect(() => {
    if (isLoggedIn && member) {
      fetchServices();
      fetchRequests();
      fetchMessages();
    }
  }, [isLoggedIn, member]);

  const fetchServices = async () => {
    try {
      const res = await fetch("/api/services");
      const data = await res.json();
      setServices(data);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  const fetchRequests = async () => {
    if (!member) return;
    try {
      const res = await fetch(`/api/service-requests?memberId=${member.id}`);
      const data = await res.json();
      setRequests(data);
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };

  const fetchMessages = async () => {
    if (!member) return;
    try {
      const res = await fetch(`/api/member-messages?memberId=${member.id}`);
      const data = await res.json();
      setMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const markMessageAsRead = async (msgId: string) => {
    try {
      await fetch(`/api/member-messages/${msgId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: true }),
      });
      setMessages(prev => prev.map(m => m.id === msgId ? { ...m, read: true } : m));
    } catch (error) {
      console.error("Error marking message as read:", error);
    }
  };

  // Handle first-time registration with member number and national ID
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setIsLoading(true);
    
    try {
      const res = await fetch("/api/members/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          memberNumber: loginForm.memberNumber,
          nationalId: loginForm.nationalId,
          password: loginForm.memberNumber, // Default password is member number
        }),
      });
      
      const data = await res.json();
      
      if (data.success) {
        setMember(data.member);
        localStorage.setItem("member", JSON.stringify(data.member));
        
        if (data.isFirstLogin) {
          setAuthScreen("changePassword");
        } else {
          setIsLoggedIn(true);
          setLoginForm({ memberNumber: "", password: "", nationalId: "" });
        }
      } else {
        setLoginError(data.error || (isArabic ? "خطأ في التحقق" : "Erreur de vérification"));
      }
    } catch {
      setLoginError(isArabic ? "خطأ في الاتصال بالخادم" : "Erreur de connexion au serveur");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle regular login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setIsLoading(true);
    
    try {
      const res = await fetch("/api/members/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginForm),
      });
      
      const data = await res.json();
      
      if (data.success) {
        setMember(data.member);
        localStorage.setItem("member", JSON.stringify(data.member));
        
        if (data.isFirstLogin) {
          setAuthScreen("changePassword");
        } else {
          setIsLoggedIn(true);
          setLoginForm({ memberNumber: "", password: "", nationalId: "" });
        }
      } else {
        setLoginError(data.error || (isArabic ? "خطأ في تسجيل الدخول" : "Erreur de connexion"));
      }
    } catch {
      setLoginError(isArabic ? "خطأ في الاتصال بالخادم" : "Erreur de connexion au serveur");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle password change
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setChangePasswordError("");
    
    if (changePasswordForm.newPassword.length < 6) {
      setChangePasswordError(isArabic ? "كلمة المرور يجب أن تكون 6 أحرف على الأقل" : "Le mot de passe doit contenir au moins 6 caractères");
      return;
    }
    
    if (changePasswordForm.newPassword !== changePasswordForm.confirmPassword) {
      setChangePasswordError(isArabic ? "كلمات المرور غير متطابقة" : "Les mots de passe ne correspondent pas");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const res = await fetch("/api/members/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          memberId: member?.id,
          newPassword: changePasswordForm.newPassword,
        }),
      });
      
      const data = await res.json();
      
      if (data.success) {
        const updatedMember = { ...member, mustChangePassword: false };
        setMember(updatedMember);
        localStorage.setItem("member", JSON.stringify(updatedMember));
        setIsLoggedIn(true);
        setChangePasswordForm({ newPassword: "", confirmPassword: "" });
      } else {
        setChangePasswordError(data.error || (isArabic ? "خطأ في تغيير كلمة المرور" : "Erreur lors du changement de mot de passe"));
      }
    } catch {
      setChangePasswordError(isArabic ? "خطأ في الاتصال بالخادم" : "Erreur de connexion au serveur");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setMember(null);
    setAuthScreen("login");
    localStorage.removeItem("member");
  };

  const submitServiceRequest = async () => {
    if (!member || !selectedService) return;
    setIsLoading(true);
    
    try {
      await fetch("/api/service-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          memberId: member.id,
          serviceId: selectedService.id,
          ...newRequest,
        }),
      });
      
      fetchRequests();
      setNewRequestDialog(false);
      setNewRequest({ titleAr: "", titleFr: "", descriptionAr: "", descriptionFr: "", priority: "normal" });
      setSelectedService(null);
    } catch (error) {
      console.error("Error submitting request:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const submitMessage = async () => {
    if (!member) return;
    setIsLoading(true);
    
    try {
      await fetch("/api/member-messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          memberId: member.id,
          ...newMessage,
        }),
      });
      
      fetchMessages();
      setNewMessageDialog(false);
      setNewMessage({ subject: "", message: "" });
    } catch (error) {
      console.error("Error submitting message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state until mounted (prevents hydration mismatch)
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-700 flex items-center justify-center p-4">
        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
          <User className="w-8 h-8 text-white" />
        </div>
      </div>
    );
  }

  // Auth screens
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-700 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
              {authScreen === "register" ? (
                <UserPlus className="w-8 h-8 text-white" />
              ) : authScreen === "changePassword" ? (
                <Key className="w-8 h-8 text-white" />
              ) : (
                <User className="w-8 h-8 text-white" />
              )}
            </div>
            <CardTitle className="text-2xl">
              {authScreen === "register" 
                ? (isArabic ? "تسجيل منخرط جديد" : "Nouvelle Inscription")
                : authScreen === "changePassword"
                ? (isArabic ? "تغيير كلمة المرور" : "Changer le Mot de Passe")
                : (isArabic ? "بوابة المنخرط" : "Portail des Membres")
              }
            </CardTitle>
            <CardDescription>
              {authScreen === "register" 
                ? (isArabic ? "أدخل رقم الانخراط ورقم البطاقة الوطنية" : "Entrez votre numéro d'adhésion et CIN")
                : authScreen === "changePassword"
                ? (isArabic ? "قم بتعيين كلمة مرور جديدة" : "Définissez un nouveau mot de passe")
                : (isArabic ? "مساحة خاصة لأعضاء الجمعية" : "Espace réservé aux membres de l'association")
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Registration Screen */}
            {authScreen === "register" && (
              <form onSubmit={handleRegister} className="space-y-4" suppressHydrationWarning>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800 mb-4">
                  <p className="font-semibold">{isArabic ? "ℹ️ معلومات:" : "ℹ️ Information:"}</p>
                  <p className="text-xs mt-1">
                    {isArabic 
                      ? "رقم الانخراط يُمنح لك من الجمعية. كلمة المرور الافتراضية هي نفس رقم الانخراط."
                      : "Votre numéro d'adhésion vous est fourni par l'association. Le mot de passe par défaut est votre numéro d'adhésion."
                    }
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>{isArabic ? "رقم الانخراط" : "Numéro d'adhésion"}</Label>
                  <Input
                    value={loginForm.memberNumber}
                    onChange={(e) => setLoginForm({ ...loginForm, memberNumber: e.target.value })}
                    placeholder="M001"
                    required
                    autoComplete="username"
                  />
                </div>
                <div className="space-y-2">
                  <Label>{isArabic ? "رقم البطاقة الوطنية" : "Numéro CIN"}</Label>
                  <Input
                    value={loginForm.nationalId}
                    onChange={(e) => setLoginForm({ ...loginForm, nationalId: e.target.value })}
                    placeholder={isArabic ? "AB123456" : "AB123456"}
                    required
                    dir="ltr"
                  />
                </div>
                {loginError && (
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {loginError}
                  </div>
                )}
                <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <UserPlus className="w-4 h-4 mr-2" />
                  )}
                  {isArabic ? "تسجيل الدخول" : "S'inscrire"}
                </Button>
                <Separator className="my-4" />
                <Button variant="link" className="w-full" onClick={() => setAuthScreen("login")}>
                  {isArabic ? "لدي حساب بالفعل؟ تسجيل الدخول" : "Déjà un compte ? Se connecter"}
                </Button>
              </form>
            )}

            {/* Login Screen */}
            {authScreen === "login" && (
              <form onSubmit={handleLogin} className="space-y-4" suppressHydrationWarning>
                <div className="space-y-2">
                  <Label>{isArabic ? "رقم الانخراط" : "Numéro d'adhésion"}</Label>
                  <Input
                    value={loginForm.memberNumber}
                    onChange={(e) => setLoginForm({ ...loginForm, memberNumber: e.target.value })}
                    placeholder="M001"
                    required
                    autoComplete="username"
                  />
                </div>
                <div className="space-y-2">
                  <Label>{isArabic ? "كلمة المرور" : "Mot de passe"}</Label>
                  <Input
                    type="password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    placeholder="••••••••"
                    required
                    autoComplete="current-password"
                  />
                </div>
                {loginError && (
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {loginError}
                  </div>
                )}
                <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <LogIn className="w-4 h-4 mr-2" />
                  )}
                  {isArabic ? "تسجيل الدخول" : "Se connecter"}
                </Button>
                <Separator className="my-4" />
                <Button variant="link" className="w-full" onClick={() => setAuthScreen("register")}>
                  {isArabic ? "تسجيل دخول لأول مرة؟" : "Première connexion ? S'inscrire"}
                </Button>
              </form>
            )}

            {/* Change Password Screen */}
            {authScreen === "changePassword" && (
              <form onSubmit={handleChangePassword} className="space-y-4" suppressHydrationWarning>
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800 mb-4">
                  <p className="font-semibold">{isArabic ? "⚠️ ملاحظة مهمة:" : "⚠️ Notice importante:"}</p>
                  <p className="text-xs mt-1">
                    {isArabic 
                      ? "هذا أول تسجيل دخول لك. يجب تغيير كلمة المرور الافتراضية."
                      : "C'est votre première connexion. Vous devez changer le mot de passe par défaut."
                    }
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>{isArabic ? "كلمة المرور الجديدة" : "Nouveau mot de passe"}</Label>
                  <div className="relative">
                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="password"
                      value={changePasswordForm.newPassword}
                      onChange={(e) => setChangePasswordForm({ ...changePasswordForm, newPassword: e.target.value })}
                      placeholder="••••••••"
                      required
                      className="pr-10"
                      minLength={6}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>{isArabic ? "تأكيد كلمة المرور" : "Confirmer le mot de passe"}</Label>
                  <Input
                    type="password"
                    value={changePasswordForm.confirmPassword}
                    onChange={(e) => setChangePasswordForm({ ...changePasswordForm, confirmPassword: e.target.value })}
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                </div>
                {changePasswordError && (
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {changePasswordError}
                  </div>
                )}
                <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Key className="w-4 h-4 mr-2" />
                  )}
                  {isArabic ? "حفظ كلمة المرور" : "Enregistrer"}
                </Button>
              </form>
            )}

            <Separator className="my-4" />
            <div className="flex justify-center gap-2">
              <Button
                variant={lang === "ar" ? "default" : "outline"}
                size="sm"
                onClick={() => setLang("ar")}
                className={lang === "ar" ? "bg-emerald-600" : ""}
              >
                العربية
              </Button>
              <Button
                variant={lang === "fr" ? "default" : "outline"}
                size="sm"
                onClick={() => setLang("fr")}
                className={lang === "fr" ? "bg-emerald-600" : ""}
              >
                Français
              </Button>
            </div>
            <div className="text-center mt-4">
              <Button variant="link" onClick={() => window.open("/", "_blank")}>
                {isArabic ? "العودة للموقع الرئيسي" : "Retour au site principal"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Member dashboard
  return (
    <div className="min-h-screen bg-muted/30" dir={isArabic ? "rtl" : "ltr"}>
      {/* Header */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center">
                <Handshake className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold">{isArabic ? "بوابة المنخرط" : "Portail des Membres"}</p>
                <p className="text-xs text-muted-foreground">
                  {isArabic ? `مرحباً، ${member?.nameAr}` : `Bienvenue, ${member?.nameFr}`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center bg-muted rounded-lg p-1">
                <button
                  onClick={() => setLang("ar")}
                  className={`px-3 py-1 text-sm rounded-md transition-all ${
                    lang === "ar" ? "bg-emerald-600 text-white" : "text-muted-foreground"
                  }`}
                >
                  العربية
                </button>
                <button
                  onClick={() => setLang("fr")}
                  className={`px-3 py-1 text-sm rounded-md transition-all ${
                    lang === "fr" ? "bg-emerald-600 text-white" : "text-muted-foreground"
                  }`}
                >
                  Français
                </button>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                {isArabic ? "خروج" : "Déconnexion"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="services" className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full max-w-xl mx-auto">
            <TabsTrigger value="services" className="flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              <span className="hidden sm:inline">{isArabic ? "الخدمات" : "Services"}</span>
            </TabsTrigger>
            <TabsTrigger value="requests" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">{isArabic ? "طلباتي" : "Demandes"}</span>
              {requests.filter(r => r.status === "pending").length > 0 && (
                <Badge className="bg-amber-500 text-white text-xs px-1.5">
                  {requests.filter(r => r.status === "pending").length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline">{isArabic ? "الرسائل" : "Messages"}</span>
              {messages.filter(m => m.replied && !m.read).length > 0 && (
                <Badge className="bg-emerald-500 text-white text-xs px-1.5">
                  {messages.filter(m => m.replied && !m.read).length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">{isArabic ? "حسابي" : "Profil"}</span>
            </TabsTrigger>
          </TabsList>

          {/* Services Tab */}
          <TabsContent value="services">
            <Card>
              <CardHeader>
                <CardTitle>{isArabic ? "خدمات الجمعية" : "Services de l'Association"}</CardTitle>
                <CardDescription>
                  {isArabic ? "اختر خدمة لتقديم طلب" : "Sélectionnez un service pour faire une demande"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {services.map((service) => {
                    const IconComponent = iconMap[service.icon] || Heart;
                    return (
                      <Card 
                        key={service.id} 
                        className="hover:shadow-lg transition-all cursor-pointer border-2 border-transparent hover:border-emerald-200"
                        onClick={() => {
                          setSelectedService(service);
                          setNewRequest({
                            ...newRequest,
                            titleAr: service.titleAr,
                            titleFr: service.titleFr,
                          });
                          setNewRequestDialog(true);
                        }}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                              <IconComponent className="w-6 h-6 text-emerald-600" />
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold">{isArabic ? service.titleAr : service.titleFr}</p>
                              <p className="text-sm text-muted-foreground mt-1">
                                {isArabic ? service.descriptionAr : service.descriptionFr}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Requests Tab */}
          <TabsContent value="requests">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{isArabic ? "طلباتي" : "Mes Demandes"}</CardTitle>
                  <Button 
                    onClick={() => setNewRequestDialog(true)}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    {isArabic ? "طلب جديد" : "Nouvelle demande"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {requests.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      {isArabic ? "لا توجد طلبات بعد" : "Aucune demande pour l'instant"}
                    </div>
                  ) : (
                    requests.map((request) => (
                      <div key={request.id} className="p-4 border rounded-lg hover:bg-muted/50">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-semibold">{isArabic ? request.titleAr : request.titleFr}</p>
                              <Badge className={statusColors[request.status]}>
                                {statusLabels[request.status][isArabic ? "ar" : "fr"]}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{request.descriptionAr}</p>
                            <p className="text-xs text-muted-foreground mt-2">
                              <Clock className="w-3 h-3 inline mr-1" />
                              <span suppressHydrationWarning>{new Date(request.createdAt).toLocaleDateString(isArabic ? "ar-MA" : "fr-FR")}</span>
                            </p>
                            {request.notes && (
                              <p className="text-sm mt-2 p-2 bg-muted rounded">
                                <strong>{isArabic ? "ملاحظات:" : "Notes:"}</strong> {request.notes}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{isArabic ? "المراسلات مع المكتب المسير" : "Correspondance avec le Bureau"}</CardTitle>
                  <Button 
                    onClick={() => setNewMessageDialog(true)}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {isArabic ? "رسالة جديدة" : "Nouveau message"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {messages.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      {isArabic ? "لا توجد رسائل بعد" : "Aucun message pour l'instant"}
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <div 
                        key={msg.id} 
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${msg.replied && !msg.read ? 'border-emerald-300 bg-emerald-50/50' : 'hover:bg-muted/50'}`}
                        onClick={() => msg.replied && !msg.read && markMessageAsRead(msg.id)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <p className="font-semibold">{msg.subject}</p>
                          <div className="flex items-center gap-2">
                            {msg.replied && !msg.read && (
                              <Badge className="bg-red-100 text-red-700 animate-pulse">
                                {isArabic ? "جديد" : "Nouveau"}
                              </Badge>
                            )}
                            {msg.replied && (
                              <Badge className="bg-emerald-100 text-emerald-700">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                {isArabic ? "تم الرد" : "Répondu"}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground bg-muted p-3 rounded">{msg.message}</p>
                        {msg.reply && (
                          <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded">
                            <p className="text-xs text-emerald-600 font-semibold mb-1">
                              {isArabic ? "رد المكتب المسير:" : "Réponse du Bureau:"}
                            </p>
                            <p className="text-sm">{msg.reply}</p>
                          </div>
                        )}
                        <p className="text-xs text-muted-foreground mt-2">
                          <Clock className="w-3 h-3 inline mr-1" />
                          <span suppressHydrationWarning>{new Date(msg.createdAt).toLocaleDateString(isArabic ? "ar-MA" : "fr-FR")}</span>
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>{isArabic ? "معلومات الحساب" : "Informations du Compte"}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-muted-foreground">{isArabic ? "رقم الانخراط" : "Numéro d'adhésion"}</Label>
                    <p className="font-semibold">{member?.memberNumber}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground">{isArabic ? "الاسم" : "Nom"}</Label>
                    <p className="font-semibold">{isArabic ? member?.nameAr : member?.nameFr}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground">{isArabic ? "البريد الإلكتروني" : "Email"}</Label>
                    <p className="font-semibold">{member?.email || "-"}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground">{isArabic ? "الهاتف" : "Téléphone"}</Label>
                    <p className="font-semibold">{member?.phone || "-"}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground">{isArabic ? "رقم الواتساب" : "WhatsApp"}</Label>
                    <p className="font-semibold">{member?.whatsapp || "-"}</p>
                    {!member?.whatsapp && (
                      <p className="text-xs text-amber-600">{isArabic ? "⚠️ أضف رقم الواتساب لاستلام التنبيهات" : "⚠️ Ajoutez WhatsApp pour les notifications"}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground">{isArabic ? "القسم" : "Département"}</Label>
                    <p className="font-semibold">{member?.department || "-"}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground">{isArabic ? "تاريخ الانخراط" : "Date d'adhésion"}</Label>
                    <p className="font-semibold" suppressHydrationWarning>
                      {member?.joinDate ? new Date(member.joinDate).toLocaleDateString(isArabic ? "ar-MA" : "fr-FR") : "-"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* New Request Dialog */}
      <Dialog open={newRequestDialog} onOpenChange={setNewRequestDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{isArabic ? "طلب خدمة جديد" : "Nouvelle demande de service"}</DialogTitle>
            <DialogDescription>
              {selectedService && (isArabic ? selectedService.titleAr : selectedService.titleFr)}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4" suppressHydrationWarning>
            <div className="space-y-2">
              <Label>{isArabic ? "عنوان الطلب (عربي)" : "Titre (Arabe)"}</Label>
              <Input value={newRequest.titleAr} onChange={(e) => setNewRequest({ ...newRequest, titleAr: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>{isArabic ? "عنوان الطلب (فرنسي)" : "Titre (Français)"}</Label>
              <Input value={newRequest.titleFr} onChange={(e) => setNewRequest({ ...newRequest, titleFr: e.target.value })} dir="ltr" />
            </div>
            <div className="space-y-2">
              <Label>{isArabic ? "وصف الطلب" : "Description"}</Label>
              <Textarea 
                value={newRequest.descriptionAr} 
                onChange={(e) => setNewRequest({ ...newRequest, descriptionAr: e.target.value })}
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label>{isArabic ? "الأولوية" : "Priorité"}</Label>
              <select 
                className="w-full p-2 border rounded-md"
                value={newRequest.priority}
                onChange={(e) => setNewRequest({ ...newRequest, priority: e.target.value })}
              >
                <option value="low">{isArabic ? "منخفضة" : "Basse"}</option>
                <option value="normal">{isArabic ? "عادية" : "Normale"}</option>
                <option value="high">{isArabic ? "عالية" : "Haute"}</option>
                <option value="urgent">{isArabic ? "عاجلة" : "Urgente"}</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewRequestDialog(false)}>
              {isArabic ? "إلغاء" : "Annuler"}
            </Button>
            <Button onClick={submitServiceRequest} disabled={isLoading} className="bg-emerald-600 hover:bg-emerald-700">
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
              {isArabic ? "إرسال الطلب" : "Envoyer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Message Dialog */}
      <Dialog open={newMessageDialog} onOpenChange={setNewMessageDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{isArabic ? "رسالة جديدة للمكتب المسير" : "Nouveau message au Bureau"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4" suppressHydrationWarning>
            <div className="space-y-2">
              <Label>{isArabic ? "الموضوع" : "Sujet"}</Label>
              <Input value={newMessage.subject} onChange={(e) => setNewMessage({ ...newMessage, subject: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>{isArabic ? "الرسالة" : "Message"}</Label>
              <Textarea 
                value={newMessage.message} 
                onChange={(e) => setNewMessage({ ...newMessage, message: e.target.value })}
                rows={5}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewMessageDialog(false)}>
              {isArabic ? "إلغاء" : "Annuler"}
            </Button>
            <Button onClick={submitMessage} disabled={isLoading} className="bg-emerald-600 hover:bg-emerald-700">
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
              {isArabic ? "إرسال" : "Envoyer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
