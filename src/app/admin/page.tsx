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
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Users, 
  Building2, 
  Newspaper, 
  Settings, 
  Handshake,
  Heart,
  Mail,
  LogIn,
  LogOut,
  Plus,
  Pencil,
  Trash2,
  Save,
  X,
  Loader2,
  Eye,
  CheckCircle,
  AlertCircle,
  Award,
  Stethoscope,
  GraduationCap,
  Gift,
  Plane,
  Calendar,
  MessageSquare,
  FileText,
  Send,
  Clock,
  UserCheck,
  UserX,
  Bell,
  Smartphone,
  User,
  Image,
  Shield,
  Download,
  ExternalLink
} from "lucide-react";
import ExecutiveOfficeManager from "@/components/ExecutiveOfficeManager";
import FileUpload from "@/components/FileUpload";
import DocumentViewer from "@/components/DocumentViewer";

// Types
interface Partner {
  id: string;
  nameAr: string;
  nameFr: string;
  descriptionAr?: string;
  descriptionFr?: string;
  logo?: string;
  website?: string;
  order: number;
  active: boolean;
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
  published: boolean;
}

interface Service {
  id: string;
  titleAr: string;
  titleFr: string;
  descriptionAr: string;
  descriptionFr: string;
  icon: string;
  color: string;
  order: number;
  active: boolean;
}

interface Stat {
  id: string;
  key: string;
  value: string;
  labelAr: string;
  labelFr: string;
  icon: string;
  order: number;
  active: boolean;
}

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  read: boolean;
  createdAt: string;
}

interface Member {
  id: string;
  memberNumber: string;
  nationalId?: string;
  nameAr: string;
  nameFr: string;
  email: string;
  phone: string;
  whatsapp?: string;
  department: string;
  joinDate: string;
  active: boolean;
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
  order: number;
  active: boolean;
}

interface CommitteeMember {
  id: string;
  nameAr: string;
  nameFr: string;
  titleAr?: string;
  titleFr?: string;
  order: number;
}

interface Committee {
  id: string;
  nameAr: string;
  nameFr: string;
  descriptionAr?: string;
  descriptionFr?: string;
  icon: string;
  color: string;
  order: number;
  active: boolean;
  members: CommitteeMember[];
}

interface ServiceRequest {
  id: string;
  memberId: string;
  titleAr: string;
  titleFr: string;
  descriptionAr: string;
  descriptionFr?: string;
  status: string;
  priority: string;
  notes?: string;
  createdAt: string;
  member: {
    id: string;
    memberNumber: string;
    nameAr: string;
    nameFr: string;
  };
}

interface MemberMessage {
  id: string;
  memberId: string;
  subject: string;
  message: string;
  reply?: string;
  read: boolean;
  replied: boolean;
  createdAt: string;
  member: {
    id: string;
    memberNumber: string;
    nameAr: string;
    nameFr: string;
  };
}

interface Document {
  id: string;
  titleAr: string;
  titleFr: string;
  descriptionAr?: string;
  descriptionFr?: string;
  category: string;
  fileUrl: string;
  fileType: string;
  fileSize?: number;
  downloadCount: number;
  visibilityType: string;
  order: number;
  active: boolean;
  createdAt: string;
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

const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  approved: "bg-emerald-100 text-emerald-700",
  rejected: "bg-red-100 text-red-700",
  completed: "bg-blue-100 text-blue-700",
};

const statusLabels: Record<string, string> = {
  pending: "قيد المراجعة",
  approved: "تمت الموافقة",
  rejected: "مرفوض",
  completed: "مكتمل",
};

const priorityColors: Record<string, string> = {
  low: "bg-gray-100 text-gray-700",
  normal: "bg-blue-100 text-blue-700",
  high: "bg-orange-100 text-orange-700",
  urgent: "bg-red-100 text-red-700",
};

const priorityLabels: Record<string, string> = {
  low: "منخفضة",
  normal: "عادية",
  high: "عالية",
  urgent: "عاجلة",
};

interface NotificationSetting {
  id: string;
  key: string;
  value: string | null;
  description: string | null;
}

interface NotificationLog {
  id: string;
  memberId: string | null;
  type: string;
  channel: string;
  status: string;
  message: string;
  error: string | null;
  createdAt: string;
}

export default function AdminPanel() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [adminName, setAdminName] = useState("");
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // Data states
  const [partners, setPartners] = useState<Partner[]>([]);
  const [news, setNews] = useState<News[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [stats, setStats] = useState<Stat[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [memberMessages, setMemberMessages] = useState<MemberMessage[]>([]);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSetting[]>([]);
  const [notificationLogs, setNotificationLogs] = useState<NotificationLog[]>([]);
  const [boardMembers, setBoardMembers] = useState<BoardMember[]>([]);
  const [committees, setCommittees] = useState<Committee[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  
  // Edit states
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [editingNews, setEditingNews] = useState<News | null>(null);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [editingStat, setEditingStat] = useState<Stat | null>(null);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [editingRequest, setEditingRequest] = useState<ServiceRequest | null>(null);
  const [replyingMessage, setReplyingMessage] = useState<MemberMessage | null>(null);
  const [editingBoardMember, setEditingBoardMember] = useState<BoardMember | null>(null);
  const [editingCommittee, setEditingCommittee] = useState<Committee | null>(null);
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);
  
  // Dialog states
  const [partnerDialogOpen, setPartnerDialogOpen] = useState(false);
  const [newsDialogOpen, setNewsDialogOpen] = useState(false);
  const [serviceDialogOpen, setServiceDialogOpen] = useState(false);
  const [statDialogOpen, setStatDialogOpen] = useState(false);
  const [memberDialogOpen, setMemberDialogOpen] = useState(false);
  const [requestDialogOpen, setRequestDialogOpen] = useState(false);
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [boardMemberDialogOpen, setBoardMemberDialogOpen] = useState(false);
  const [committeeDialogOpen, setCommitteeDialogOpen] = useState(false);
  const [documentDialogOpen, setDocumentDialogOpen] = useState(false);
  
  // Document viewer state
  const [documentViewerOpen, setDocumentViewerOpen] = useState(false);
  const [viewingDocument, setViewingDocument] = useState<Document | null>(null);

  // Check if already logged in (from localStorage)
  useEffect(() => {
    setMounted(true);
    const savedAdmin = localStorage.getItem("admin");
    if (savedAdmin) {
      const admin = JSON.parse(savedAdmin);
      setIsLoggedIn(true);
      setAdminName(admin.name || "مدير");
    }
  }, []);

  // Fetch data when logged in
  useEffect(() => {
    if (isLoggedIn) {
      fetchAllData();
    }
  }, [isLoggedIn]);

  const fetchAllData = () => {
    fetchPartners();
    fetchNews();
    fetchServices();
    fetchStats();
    fetchMessages();
    fetchMembers();
    fetchServiceRequests();
    fetchMemberMessages();
    fetchNotificationSettings();
    fetchNotificationLogs();
    fetchBoardMembers();
    fetchCommittees();
    fetchDocuments();
  };

  // Fetch board members
  const fetchBoardMembers = async () => {
    try {
      const res = await fetch("/api/board-members");
      const data = await res.json();
      setBoardMembers(data);
    } catch (error) {
      console.error("Error fetching board members:", error);
    }
  };

  // Save board member (create or update)
  const saveBoardMember = async (member: Partial<BoardMember>) => {
    setIsLoading(true);
    try {
      if (editingBoardMember?.id) {
        await fetch(`/api/board-members/${editingBoardMember.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(member),
        });
      } else {
        await fetch("/api/board-members", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(member),
        });
      }
      fetchBoardMembers();
      setBoardMemberDialogOpen(false);
      setEditingBoardMember(null);
    } catch (error) {
      console.error("Error saving board member:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete board member
  const deleteBoardMember = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا العضو؟")) return;
    try {
      await fetch(`/api/board-members/${id}`, { method: "DELETE" });
      fetchBoardMembers();
    } catch (error) {
      console.error("Error deleting board member:", error);
    }
  };

  // Fetch committees
  const fetchCommittees = async () => {
    try {
      const res = await fetch("/api/committees");
      const data = await res.json();
      setCommittees(data);
    } catch (error) {
      console.error("Error fetching committees:", error);
    }
  };

  // Save committee (create or update)
  const saveCommittee = async (committee: Partial<Committee>) => {
    setIsLoading(true);
    try {
      if (editingCommittee?.id) {
        await fetch(`/api/committees/${editingCommittee.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(committee),
        });
      } else {
        await fetch("/api/committees", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(committee),
        });
      }
      fetchCommittees();
      setCommitteeDialogOpen(false);
      setEditingCommittee(null);
    } catch (error) {
      console.error("Error saving committee:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete committee
  const deleteCommittee = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه اللجنة؟")) return;
    try {
      await fetch(`/api/committees/${id}`, { method: "DELETE" });
      fetchCommittees();
    } catch (error) {
      console.error("Error deleting committee:", error);
    }
  };

  // Fetch documents
  const fetchDocuments = async () => {
    try {
      const res = await fetch("/api/documents");
      const data = await res.json();
      setDocuments(data);
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  // Save document (create or update)
  const saveDocument = async (document: Partial<Document>) => {
    setIsLoading(true);
    try {
      if (editingDocument?.id) {
        await fetch(`/api/documents/${editingDocument.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(document),
        });
      } else {
        await fetch("/api/documents", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(document),
        });
      }
      fetchDocuments();
      setDocumentDialogOpen(false);
      setEditingDocument(null);
    } catch (error) {
      console.error("Error saving document:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete document
  const deleteDocument = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا المستند؟")) return;
    try {
      await fetch(`/api/documents/${id}`, { method: "DELETE" });
      fetchDocuments();
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  // Login function
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setIsLoading(true);
    
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginForm),
      });
      
      const data = await res.json();
      
      if (data.success) {
        setIsLoggedIn(true);
        setAdminName(data.admin.name || "مدير");
        localStorage.setItem("admin", JSON.stringify(data.admin));
        setLoginForm({ username: "", password: "" });
      } else {
        setLoginError(data.error || "خطأ في تسجيل الدخول");
      }
    } catch {
      setLoginError("خطأ في الاتصال بالخادم");
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const handleLogout = () => {
    setIsLoggedIn(false);
    setAdminName("");
    localStorage.removeItem("admin");
  };

  // Fetch functions
  const fetchPartners = async () => {
    try {
      const res = await fetch("/api/partners");
      const data = await res.json();
      setPartners(data);
    } catch (error) {
      console.error("Error fetching partners:", error);
    }
  };

  const fetchNews = async () => {
    try {
      const res = await fetch("/api/news");
      const data = await res.json();
      setNews(data);
    } catch (error) {
      console.error("Error fetching news:", error);
    }
  };

  const fetchServices = async () => {
    try {
      const res = await fetch("/api/services");
      const data = await res.json();
      setServices(data);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/stats");
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/contact");
      const data = await res.json();
      setMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const fetchMembers = async () => {
    try {
      const res = await fetch("/api/members");
      const data = await res.json();
      setMembers(data);
    } catch (error) {
      console.error("Error fetching members:", error);
    }
  };

  const fetchServiceRequests = async () => {
    try {
      const res = await fetch("/api/service-requests");
      const data = await res.json();
      setServiceRequests(data);
    } catch (error) {
      console.error("Error fetching service requests:", error);
    }
  };

  const fetchMemberMessages = async () => {
    try {
      const res = await fetch("/api/member-messages");
      const data = await res.json();
      setMemberMessages(data);
    } catch (error) {
      console.error("Error fetching member messages:", error);
    }
  };

  const fetchNotificationSettings = async () => {
    try {
      const res = await fetch("/api/notification-settings");
      const data = await res.json();
      setNotificationSettings(data);
    } catch (error) {
      console.error("Error fetching notification settings:", error);
    }
  };

  const fetchNotificationLogs = async () => {
    try {
      const res = await fetch("/api/notification-logs");
      const data = await res.json();
      setNotificationLogs(data);
    } catch (error) {
      console.error("Error fetching notification logs:", error);
    }
  };

  const saveNotificationSettings = async (settings: { key: string; value: string }[]) => {
    setIsLoading(true);
    try {
      await fetch("/api/notification-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings }),
      });
      fetchNotificationSettings();
    } catch (error) {
      console.error("Error saving notification settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // CRUD functions for Partners
  const savePartner = async (partner: Partial<Partner>) => {
    setIsLoading(true);
    try {
      if (editingPartner?.id) {
        await fetch(`/api/partners/${editingPartner.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(partner),
        });
      } else {
        await fetch("/api/partners", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(partner),
        });
      }
      fetchPartners();
      setPartnerDialogOpen(false);
      setEditingPartner(null);
    } catch (error) {
      console.error("Error saving partner:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const deletePartner = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا الشريك؟")) return;
    try {
      await fetch(`/api/partners/${id}`, { method: "DELETE" });
      fetchPartners();
    } catch (error) {
      console.error("Error deleting partner:", error);
    }
  };

  // CRUD functions for News
  const saveNews = async (newsItem: Partial<News>) => {
    setIsLoading(true);
    try {
      if (editingNews?.id) {
        await fetch(`/api/news/${editingNews.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newsItem),
        });
      } else {
        await fetch("/api/news", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newsItem),
        });
      }
      fetchNews();
      setNewsDialogOpen(false);
      setEditingNews(null);
    } catch (error) {
      console.error("Error saving news:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteNews = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا الخبر؟")) return;
    try {
      await fetch(`/api/news/${id}`, { method: "DELETE" });
      fetchNews();
    } catch (error) {
      console.error("Error deleting news:", error);
    }
  };

  // CRUD functions for Services
  const saveService = async (service: Partial<Service>) => {
    setIsLoading(true);
    try {
      if (editingService?.id) {
        await fetch(`/api/services/${editingService.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(service),
        });
      } else {
        await fetch("/api/services", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(service),
        });
      }
      fetchServices();
      setServiceDialogOpen(false);
      setEditingService(null);
    } catch (error) {
      console.error("Error saving service:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteService = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه الخدمة؟")) return;
    try {
      await fetch(`/api/services/${id}`, { method: "DELETE" });
      fetchServices();
    } catch (error) {
      console.error("Error deleting service:", error);
    }
  };

  // CRUD functions for Stats
  const saveStat = async (stat: Partial<Stat>) => {
    setIsLoading(true);
    try {
      if (editingStat?.id) {
        await fetch(`/api/stats/${editingStat.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(stat),
        });
      } else {
        await fetch("/api/stats", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(stat),
        });
      }
      fetchStats();
      setStatDialogOpen(false);
      setEditingStat(null);
    } catch (error) {
      console.error("Error saving stat:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteStat = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه الإحصائية؟")) return;
    try {
      await fetch(`/api/stats/${id}`, { method: "DELETE" });
      fetchStats();
    } catch (error) {
      console.error("Error deleting stat:", error);
    }
  };

  // Mark message as read
  const markMessageRead = async (id: string) => {
    try {
      await fetch(`/api/contact/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: true }),
      });
      fetchMessages();
    } catch (error) {
      console.error("Error marking message as read:", error);
    }
  };

  const deleteMessage = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه الرسالة؟")) return;
    try {
      await fetch(`/api/contact/${id}`, { method: "DELETE" });
      fetchMessages();
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  // Member management
  const toggleMemberActive = async (id: string, active: boolean) => {
    try {
      await fetch(`/api/members/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !active }),
      });
      fetchMembers();
    } catch (error) {
      console.error("Error updating member:", error);
    }
  };

  // Save member (create or update)
  const saveMember = async (member: Partial<Member>) => {
    setIsLoading(true);
    try {
      if (editingMember?.id) {
        await fetch(`/api/members/${editingMember.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(member),
        });
      } else {
        await fetch("/api/members", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(member),
        });
      }
      fetchMembers();
      setMemberDialogOpen(false);
      setEditingMember(null);
    } catch (error) {
      console.error("Error saving member:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Service Request management
  const updateRequestStatus = async (id: string, status: string, notes?: string) => {
    setIsLoading(true);
    try {
      await fetch(`/api/service-requests/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, notes }),
      });
      fetchServiceRequests();
      setRequestDialogOpen(false);
      setEditingRequest(null);
    } catch (error) {
      console.error("Error updating request:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Member Message reply
  const sendReply = async (id: string, reply: string) => {
    setIsLoading(true);
    try {
      await fetch(`/api/member-messages/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reply }),
      });
      fetchMemberMessages();
      setReplyDialogOpen(false);
      setReplyingMessage(null);
    } catch (error) {
      console.error("Error sending reply:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const markMemberMessageRead = async (id: string) => {
    try {
      await fetch(`/api/member-messages/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: true }),
      });
      fetchMemberMessages();
    } catch (error) {
      console.error("Error marking message as read:", error);
    }
  };

  // Show loading state until mounted (prevents hydration mismatch)
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-700 flex items-center justify-center p-4">
        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
          <Handshake className="w-8 h-8 text-white" />
        </div>
      </div>
    );
  }

  // Login screen
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-700 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Handshake className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl">لوحة تحكم المدير</CardTitle>
            <CardDescription>Panneau d&apos;Administration</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4" suppressHydrationWarning>
              <div className="space-y-2">
                <Label htmlFor="username">اسم المستخدم</Label>
                <Input
                  id="username"
                  value={loginForm.username}
                  onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                  placeholder="admin"
                  required
                  autoComplete="username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">كلمة المرور</Label>
                <Input
                  id="password"
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
                تسجيل الدخول
              </Button>
            </form>
            <div className="mt-4 p-3 bg-muted rounded-lg text-sm text-muted-foreground text-center">
              <p>بيانات الدخول الافتراضية:</p>
              <p className="font-mono">admin / admin123</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Admin dashboard
  return (
    <div className="min-h-screen bg-muted/30" dir="rtl">
      {/* Header */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center">
                <Handshake className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold">لوحة تحكم المدير</p>
                <p className="text-xs text-muted-foreground">مرحباً، {adminName}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={() => window.open("/", "_blank")}>
                <Eye className="w-4 h-4 mr-2" />
                عرض الموقع
              </Button>
              <Button variant="outline" size="sm" onClick={() => window.open("/member-portal", "_blank")}>
                <Users className="w-4 h-4 mr-2" />
                بوابة المنخرط
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                تسجيل الخروج
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="flex flex-wrap gap-2 mb-6 bg-transparent h-auto">
            <TabsTrigger value="dashboard" className="flex items-center gap-2 data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">لوحة التحكم</span>
            </TabsTrigger>
            <TabsTrigger value="members" className="flex items-center gap-2 data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">الأعضاء</span>
              {members.filter(m => m.active).length > 0 && (
                <Badge className="bg-emerald-500 text-white text-xs px-1.5">{members.filter(m => m.active).length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="requests" className="flex items-center gap-2 data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">طلبات الخدمات</span>
              {serviceRequests.filter(r => r.status === "pending").length > 0 && (
                <Badge className="bg-amber-500 text-white text-xs px-1.5">{serviceRequests.filter(r => r.status === "pending").length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="member-messages" className="flex items-center gap-2 data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline">رسائل الأعضاء</span>
              {memberMessages.filter(m => !m.replied).length > 0 && (
                <Badge className="bg-red-500 text-white text-xs px-1.5">{memberMessages.filter(m => !m.replied).length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="contact-messages" className="flex items-center gap-2 data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              <Mail className="w-4 h-4" />
              <span className="hidden sm:inline">رسائل الزوار</span>
              {messages.filter(m => !m.read).length > 0 && (
                <Badge className="bg-red-500 text-white text-xs px-1.5">{messages.filter(m => !m.read).length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="board-members" className="flex items-center gap-2 data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">المكتب المسير</span>
            </TabsTrigger>
            <TabsTrigger value="committees" className="flex items-center gap-2 data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">اللجن</span>
            </TabsTrigger>
            <TabsTrigger value="partners" className="flex items-center gap-2 data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              <Handshake className="w-4 h-4" />
              <span className="hidden sm:inline">الشركاء</span>
            </TabsTrigger>
            <TabsTrigger value="news" className="flex items-center gap-2 data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              <Newspaper className="w-4 h-4" />
              <span className="hidden sm:inline">الأخبار</span>
            </TabsTrigger>
            <TabsTrigger value="services" className="flex items-center gap-2 data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              <Heart className="w-4 h-4" />
              <span className="hidden sm:inline">الخدمات</span>
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-2 data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              <Award className="w-4 h-4" />
              <span className="hidden sm:inline">الإحصائيات</span>
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center gap-2 data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">المستندات</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2 data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              <Bell className="w-4 h-4" />
              <span className="hidden sm:inline">التنبيهات</span>
            </TabsTrigger>
            <TabsTrigger value="executive" className="flex items-center gap-2 data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">تسيير المكتب</span>
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-emerald-100 text-sm">الأعضاء النشطين</p>
                      <p className="text-3xl font-bold">{members.filter(m => m.active).length}</p>
                    </div>
                    <Users className="w-12 h-12 text-emerald-200" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-amber-500 to-orange-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-amber-100 text-sm">طلبات قيد المراجعة</p>
                      <p className="text-3xl font-bold">{serviceRequests.filter(r => r.status === "pending").length}</p>
                    </div>
                    <FileText className="w-12 h-12 text-amber-200" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm">رسائل بدون رد</p>
                      <p className="text-3xl font-bold">{memberMessages.filter(m => !m.replied).length}</p>
                    </div>
                    <MessageSquare className="w-12 h-12 text-blue-200" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-purple-500 to-pink-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm">رسائل الزوار الجديدة</p>
                      <p className="text-3xl font-bold">{messages.filter(m => !m.read).length}</p>
                    </div>
                    <Mail className="w-12 h-12 text-purple-200" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">آخر طلبات الخدمات</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {serviceRequests.slice(0, 5).map(req => (
                      <div key={req.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div>
                          <p className="font-medium text-sm">{req.titleAr}</p>
                          <p className="text-xs text-muted-foreground">{req.member.nameAr}</p>
                        </div>
                        <Badge className={statusColors[req.status]}>{statusLabels[req.status]}</Badge>
                      </div>
                    ))}
                    {serviceRequests.length === 0 && (
                      <p className="text-center text-muted-foreground py-4">لا توجد طلبات</p>
                    )}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">آخر رسائل الأعضاء</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {memberMessages.slice(0, 5).map(msg => (
                      <div key={msg.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div>
                          <p className="font-medium text-sm">{msg.subject}</p>
                          <p className="text-xs text-muted-foreground">{msg.member.nameAr}</p>
                        </div>
                        {msg.replied ? (
                          <Badge className="bg-emerald-100 text-emerald-700">تم الرد</Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-700">بانتظار الرد</Badge>
                        )}
                      </div>
                    ))}
                    {memberMessages.length === 0 && (
                      <p className="text-center text-muted-foreground py-4">لا توجد رسائل</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Members Tab */}
          <TabsContent value="members">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>إدارة الأعضاء</CardTitle>
                    <CardDescription>قائمة جميع الأعضاء المسجلين في الجمعية</CardDescription>
                  </div>
                  <Button onClick={() => { setEditingMember(null); setMemberDialogOpen(true); }} className="bg-emerald-600 hover:bg-emerald-700">
                    <Plus className="w-4 h-4 mr-2" />
                    إضافة منخرط
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-right p-3">رقم الانخراط</th>
                        <th className="text-right p-3">الاسم</th>
                        <th className="text-right p-3">رقم البطاقة</th>
                        <th className="text-right p-3">البريد الإلكتروني</th>
                        <th className="text-right p-3">الهاتف</th>
                        <th className="text-right p-3">الواتساب</th>
                        <th className="text-right p-3">القسم</th>
                        <th className="text-right p-3">الحالة</th>
                        <th className="text-right p-3">إجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {members.map(member => (
                        <tr key={member.id} className="border-b hover:bg-muted/50">
                          <td className="p-3 font-mono">{member.memberNumber}</td>
                          <td className="p-3">
                            <p className="font-medium">{member.nameAr}</p>
                            <p className="text-xs text-muted-foreground">{member.nameFr}</p>
                          </td>
                          <td className="p-3 font-mono text-sm">{member.nationalId || "-"}</td>
                          <td className="p-3">{member.email || "-"}</td>
                          <td className="p-3">{member.phone || "-"}</td>
                          <td className="p-3">
                            {member.whatsapp ? (
                              <div className="flex items-center gap-1">
                                <Smartphone className="w-4 h-4 text-emerald-600" />
                                <span className="text-sm">{member.whatsapp}</span>
                              </div>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </td>
                          <td className="p-3">{member.department || "-"}</td>
                          <td className="p-3">
                            <Badge className={member.active ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}>
                              {member.active ? "نشط" : "غير نشط"}
                            </Badge>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => { setEditingMember(member); setMemberDialogOpen(true); }}
                              >
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => toggleMemberActive(member.id, member.active)}
                              >
                                {member.active ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {members.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">لا يوجد أعضاء مسجلين</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Service Requests Tab */}
          <TabsContent value="requests">
            <Card>
              <CardHeader>
                <CardTitle>طلبات الخدمات</CardTitle>
                <CardDescription>إدارة طلبات الخدمات المقدمة من الأعضاء</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {serviceRequests.map(req => (
                    <div key={req.id} className="p-4 border rounded-lg hover:shadow-md transition-all">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <p className="font-semibold">{req.titleAr}</p>
                            <Badge className={statusColors[req.status]}>{statusLabels[req.status]}</Badge>
                            <Badge className={priorityColors[req.priority]}>{priorityLabels[req.priority]}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{req.descriptionAr}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span><Users className="w-3 h-3 inline mr-1" />{req.member.nameAr} ({req.member.memberNumber})</span>
                            <span suppressHydrationWarning><Clock className="w-3 h-3 inline mr-1" />{new Date(req.createdAt).toLocaleDateString("ar-MA")}</span>
                          </div>
                          {req.notes && (
                            <p className="text-sm mt-2 p-2 bg-muted rounded"><strong>ملاحظات:</strong> {req.notes}</p>
                          )}
                        </div>
                        <div className="flex gap-2 mr-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => { setEditingRequest(req); setRequestDialogOpen(true); }}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {serviceRequests.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">لا توجد طلبات</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Member Messages Tab */}
          <TabsContent value="member-messages">
            <Card>
              <CardHeader>
                <CardTitle>رسائل الأعضاء</CardTitle>
                <CardDescription>المراسلات بين الأعضاء والمكتب المسير</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {memberMessages.map(msg => (
                    <div key={msg.id} className={`p-4 border rounded-lg ${!msg.read ? "border-emerald-300 bg-emerald-50/50" : ""}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <p className="font-semibold">{msg.subject}</p>
                            {msg.replied ? (
                              <Badge className="bg-emerald-100 text-emerald-700"><CheckCircle className="w-3 h-3 mr-1" />تم الرد</Badge>
                            ) : (
                              <Badge className="bg-red-100 text-red-700"><AlertCircle className="w-3 h-3 mr-1" />بانتظار الرد</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground bg-muted p-3 rounded mb-2">{msg.message}</p>
                          {msg.reply && (
                            <div className="mt-2 p-3 bg-emerald-50 border border-emerald-200 rounded">
                              <p className="text-xs text-emerald-600 font-semibold mb-1">رد المكتب المسير:</p>
                              <p className="text-sm">{msg.reply}</p>
                            </div>
                          )}
                          <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                            <span><Users className="w-3 h-3 inline mr-1" />{msg.member.nameAr} ({msg.member.memberNumber})</span>
                            <span suppressHydrationWarning><Clock className="w-3 h-3 inline mr-1" />{new Date(msg.createdAt).toLocaleDateString("ar-MA")}</span>
                          </div>
                        </div>
                        <div className="flex gap-2 mr-4">
                          {!msg.read && (
                            <Button variant="outline" size="sm" onClick={() => markMemberMessageRead(msg.id)}>
                              <Eye className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => { setReplyingMessage(msg); setReplyDialogOpen(true); }}
                          >
                            <Send className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {memberMessages.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">لا توجد رسائل</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact Messages Tab */}
          <TabsContent value="contact-messages">
            <Card>
              <CardHeader>
                <CardTitle>رسائل الزوار</CardTitle>
                <CardDescription>الرسائل المرسلة عبر نموذج الاتصال</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {messages.map(msg => (
                    <div key={msg.id} className={`p-4 border rounded-lg ${!msg.read ? "border-emerald-300 bg-emerald-50/50" : ""}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <p className="font-semibold">{msg.name}</p>
                            {!msg.read && <Badge className="bg-emerald-100 text-emerald-700">جديد</Badge>}
                          </div>
                          <p className="text-sm text-muted-foreground">{msg.message}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                            <span>{msg.email}</span>
                            {msg.phone && <span>{msg.phone}</span>}
                            <span suppressHydrationWarning><Clock className="w-3 h-3 inline mr-1" />{new Date(msg.createdAt).toLocaleDateString("ar-MA")}</span>
                          </div>
                        </div>
                        <div className="flex gap-2 mr-4">
                          {!msg.read && (
                            <Button variant="outline" size="sm" onClick={() => markMessageRead(msg.id)}>
                              <Eye className="w-4 h-4" />
                            </Button>
                          )}
                          <Button variant="outline" size="sm" className="text-red-600" onClick={() => deleteMessage(msg.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {messages.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">لا توجد رسائل</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Board Members Tab */}
          <TabsContent value="board-members">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>المكتب المسير</CardTitle>
                    <CardDescription>إدارة أعضاء المكتب المسير للجمعية</CardDescription>
                  </div>
                  <Button onClick={() => { setEditingBoardMember(null); setBoardMemberDialogOpen(true); }} className="bg-emerald-600 hover:bg-emerald-700">
                    <Plus className="w-4 h-4 mr-2" />
                    إضافة عضو
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-right p-3">الصورة</th>
                        <th className="text-right p-3">الاسم والنسب (عربي)</th>
                        <th className="text-right p-3">Nom et Prénom (Français)</th>
                        <th className="text-right p-3">الصفة (عربي)</th>
                        <th className="text-right p-3">Titre (Français)</th>
                        <th className="text-right p-3">الترتيب</th>
                        <th className="text-right p-3">إجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {boardMembers.map(member => (
                        <tr key={member.id} className="border-b hover:bg-muted/50">
                          <td className="p-3">
                            {member.photo ? (
                              <img src={member.photo} alt={member.nameAr} className="w-12 h-12 rounded-full object-cover" />
                            ) : (
                              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold">
                                {member.nameAr.charAt(0)}
                              </div>
                            )}
                          </td>
                          <td className="p-3 font-medium">{member.nameAr}</td>
                          <td className="p-3" dir="ltr">{member.nameFr}</td>
                          <td className="p-3 text-emerald-600">{member.titleAr}</td>
                          <td className="p-3 text-emerald-600" dir="ltr">{member.titleFr}</td>
                          <td className="p-3 text-center">{member.order}</td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => { setEditingBoardMember(member); setBoardMemberDialogOpen(true); }}
                              >
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 hover:text-red-700"
                                onClick={() => deleteBoardMember(member.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {boardMembers.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">لا يوجد أعضاء حالياً</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Committees Tab */}
          <TabsContent value="committees">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>اللجن</CardTitle>
                    <CardDescription>إدارة لجن الجمعية وأعضائها</CardDescription>
                  </div>
                  <Button onClick={() => { setEditingCommittee(null); setCommitteeDialogOpen(true); }} className="bg-emerald-600 hover:bg-emerald-700">
                    <Plus className="w-4 h-4 mr-2" />
                    إضافة لجنة
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {committees.map(committee => {
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
                      <div key={committee.id} className="p-4 border rounded-lg hover:shadow-md transition-all">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-12 h-12 bg-gradient-to-br rounded-xl flex items-center justify-center ${colorClass[committee.color] || colorClass.emerald}`}>
                              <IconComponent className="w-6 h-6" />
                            </div>
                            <div>
                              <p className="font-semibold">{committee.nameAr}</p>
                              <p className="text-sm text-muted-foreground" dir="ltr">{committee.nameFr}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => { setEditingCommittee(committee); setCommitteeDialogOpen(true); }}>
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700" onClick={() => deleteCommittee(committee.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground mb-3">
                          {committee.descriptionAr || committee.descriptionFr}
                        </div>
                        <div className="border-t pt-3">
                          <p className="text-xs font-semibold text-muted-foreground mb-2">الأعضاء ({committee.members.length})</p>
                          <div className="flex flex-wrap gap-2">
                            {committee.members.slice(0, 5).map(m => (
                              <Badge key={m.id} variant="secondary" className="text-xs">
                                {m.nameAr}
                              </Badge>
                            ))}
                            {committee.members.length > 5 && (
                              <Badge variant="outline" className="text-xs">
                                +{committee.members.length - 5}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {committees.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">لا توجد لجن حالياً</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Partners Tab */}
          <TabsContent value="partners">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>الشركاء</CardTitle>
                  <Button onClick={() => { setEditingPartner(null); setPartnerDialogOpen(true); }} className="bg-emerald-600 hover:bg-emerald-700">
                    <Plus className="w-4 h-4 mr-2" />
                    إضافة شريك
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {partners.map(partner => (
                    <div key={partner.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                      <div>
                        <p className="font-semibold">{partner.nameAr}</p>
                        <p className="text-sm text-muted-foreground">{partner.nameFr}</p>
                        {!partner.active && <Badge variant="secondary">غير نشط</Badge>}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => { setEditingPartner(partner); setPartnerDialogOpen(true); }}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700" onClick={() => deletePartner(partner.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {partners.length === 0 && <div className="text-center py-8 text-muted-foreground">لا يوجد شركاء حالياً</div>}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* News Tab */}
          <TabsContent value="news">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>الأخبار</CardTitle>
                  <Button onClick={() => { setEditingNews(null); setNewsDialogOpen(true); }} className="bg-emerald-600 hover:bg-emerald-700">
                    <Plus className="w-4 h-4 mr-2" />
                    إضافة خبر
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {news.map(item => (
                    <div key={item.id} className="p-4 border rounded-lg hover:bg-muted/50">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold">{item.titleAr}</p>
                          <p className="text-sm text-muted-foreground">{item.titleFr}</p>
                          <div className="flex gap-2 mt-2">
                            {item.featured && <Badge>مميز</Badge>}
                            {item.published ? <Badge className="bg-emerald-100 text-emerald-700">منشور</Badge> : <Badge variant="secondary">مسودة</Badge>}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => { setEditingNews(item); setNewsDialogOpen(true); }}>
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600" onClick={() => deleteNews(item.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {news.length === 0 && <div className="text-center py-8 text-muted-foreground">لا توجد أخبار</div>}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>الخدمات</CardTitle>
                  <Button onClick={() => { setEditingService(null); setServiceDialogOpen(true); }} className="bg-emerald-600 hover:bg-emerald-700">
                    <Plus className="w-4 h-4 mr-2" />
                    إضافة خدمة
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {services.map(service => (
                    <div key={service.id} className="p-4 border rounded-lg hover:shadow-md transition-all">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                            {(() => { const IconComponent = iconMap[service.icon] || Heart; return <IconComponent className="w-5 h-5 text-emerald-600" />; })()}
                          </div>
                          <div>
                            <p className="font-semibold">{service.titleAr}</p>
                            <p className="text-xs text-muted-foreground">{service.titleFr}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => { setEditingService(service); setServiceDialogOpen(true); }}>
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600" onClick={() => deleteService(service.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Stats Tab */}
          <TabsContent value="stats">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>الإحصائيات</CardTitle>
                  <Button onClick={() => { setEditingStat(null); setStatDialogOpen(true); }} className="bg-emerald-600 hover:bg-emerald-700">
                    <Plus className="w-4 h-4 mr-2" />
                    إضافة إحصائية
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {stats.map(stat => (
                    <div key={stat.id} className="p-4 border rounded-lg text-center hover:shadow-md transition-all">
                      <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        {(() => { const IconComponent = iconMap[stat.icon] || Users; return <IconComponent className="w-6 h-6 text-emerald-600" />; })()}
                      </div>
                      <p className="text-2xl font-bold text-emerald-600">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.labelAr}</p>
                      <div className="flex justify-center gap-2 mt-3">
                        <Button variant="outline" size="sm" onClick={() => { setEditingStat(stat); setStatDialogOpen(true); }}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600" onClick={() => deleteStat(stat.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>إدارة المستندات</CardTitle>
                    <CardDescription>قائمة جميع المستندات المتاحة للتحميل</CardDescription>
                  </div>
                  <Button onClick={() => { setEditingDocument(null); setDocumentDialogOpen(true); }} className="bg-emerald-600 hover:bg-emerald-700">
                    <Plus className="w-4 h-4 mr-2" />
                    إضافة مستند
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-right p-3">العنوان</th>
                        <th className="text-right p-3">التصنيف</th>
                        <th className="text-right p-3">نوع الملف</th>
                        <th className="text-right p-3">التحميلات</th>
                        <th className="text-right p-3">مستوى الظهور</th>
                        <th className="text-right p-3">الحالة</th>
                        <th className="text-right p-3">إجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {documents.map(doc => (
                        <tr key={doc.id} className="border-b hover:bg-muted/50">
                          <td className="p-3">
                            <div>
                              <p className="font-medium">{doc.titleAr}</p>
                              <p className="text-xs text-muted-foreground">{doc.titleFr}</p>
                            </div>
                          </td>
                          <td className="p-3">
                            <Badge variant="outline">
                              {doc.category === "general" && "عام"}
                              {doc.category === "financial" && "مالي"}
                              {doc.category === "administrative" && "إداري"}
                              {doc.category === "legal" && "قانوني"}
                            </Badge>
                          </td>
                          <td className="p-3">
                            <Badge className="bg-gray-100 text-gray-700">{doc.fileType}</Badge>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-1">
                              <Download className="w-4 h-4 text-muted-foreground" />
                              <span>{doc.downloadCount}</span>
                            </div>
                          </td>
                          <td className="p-3">
                            <Badge className={
                              doc.visibilityType === "public" ? "bg-emerald-100 text-emerald-700" :
                              doc.visibilityType === "members" ? "bg-blue-100 text-blue-700" :
                              "bg-amber-100 text-amber-700"
                            }>
                              {doc.visibilityType === "public" && "للجميع"}
                              {doc.visibilityType === "office" && "المكتب فقط"}
                              {doc.visibilityType === "members" && "المنخرطين"}
                            </Badge>
                          </td>
                          <td className="p-3">
                            {doc.active ? (
                              <Badge className="bg-emerald-100 text-emerald-700">منشور</Badge>
                            ) : (
                              <Badge className="bg-gray-100 text-gray-700">غير منشور</Badge>
                            )}
                          </td>
                          <td className="p-3">
                            <div className="flex gap-1">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => { 
                                  setViewingDocument(doc); 
                                  setDocumentViewerOpen(true); 
                                }}
                                title="معاينة"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => { 
                                  const link = window.document.createElement('a');
                                  link.href = doc.fileUrl;
                                  link.download = doc.titleAr || doc.fileUrl.split('/').pop() || 'document';
                                  link.target = '_blank';
                                  window.document.body.appendChild(link);
                                  link.click();
                                  window.document.body.removeChild(link);
                                }}
                                title="تحميل"
                              >
                                <Download className="w-4 h-4" />
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => { setEditingDocument(doc); setDocumentDialogOpen(true); }}>
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <Button variant="outline" size="sm" className="text-red-600" onClick={() => deleteDocument(doc.id)}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {documents.length === 0 && (
                        <tr>
                          <td colSpan={7} className="p-8 text-center text-muted-foreground">
                            لا توجد مستندات
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Settings Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    إعدادات تنبيهات واتساب
                  </CardTitle>
                  <CardDescription>تكوين إرسال التنبيهات عبر واتساب للأعضاء</CardDescription>
                </CardHeader>
                <CardContent>
                  <NotificationSettingsForm 
                    settings={notificationSettings} 
                    onSave={saveNotificationSettings} 
                    isLoading={isLoading} 
                  />
                </CardContent>
              </Card>

              {/* Logs Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    سجل التنبيهات
                  </CardTitle>
                  <CardDescription>آخر التنبيهات المرسلة</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {notificationLogs.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">لا توجد تنبيهات بعد</div>
                    ) : (
                      notificationLogs.map(log => (
                        <div key={log.id} className="p-3 border rounded-lg text-sm">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium">{log.type}</span>
                            <Badge className={log.status === "sent" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}>
                              {log.status === "sent" ? "تم الإرسال" : "فشل"}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground text-xs line-clamp-2">{log.message}</p>
                          <p className="text-xs text-muted-foreground mt-1" suppressHydrationWarning>
                            {new Date(log.createdAt).toLocaleString("ar-MA")}
                          </p>
                          {log.error && (
                            <p className="text-xs text-red-600 mt-1">خطأ: {log.error}</p>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Executive Office Management Tab */}
          <TabsContent value="executive">
            <ExecutiveOfficeManager />
          </TabsContent>
        </Tabs>
      </main>

      {/* Partner Dialog */}
      <Dialog open={partnerDialogOpen} onOpenChange={setPartnerDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingPartner?.id ? "تعديل شريك" : "إضافة شريك جديد"}</DialogTitle>
          </DialogHeader>
          <PartnerForm partner={editingPartner} onSave={savePartner} onCancel={() => setPartnerDialogOpen(false)} isLoading={isLoading} />
        </DialogContent>
      </Dialog>

      {/* News Dialog */}
      <Dialog open={newsDialogOpen} onOpenChange={setNewsDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingNews?.id ? "تعديل خبر" : "إضافة خبر جديد"}</DialogTitle>
          </DialogHeader>
          <NewsForm news={editingNews} onSave={saveNews} onCancel={() => setNewsDialogOpen(false)} isLoading={isLoading} />
        </DialogContent>
      </Dialog>

      {/* Service Dialog */}
      <Dialog open={serviceDialogOpen} onOpenChange={setServiceDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingService?.id ? "تعديل خدمة" : "إضافة خدمة جديدة"}</DialogTitle>
          </DialogHeader>
          <ServiceForm service={editingService} onSave={saveService} onCancel={() => setServiceDialogOpen(false)} isLoading={isLoading} />
        </DialogContent>
      </Dialog>

      {/* Stat Dialog */}
      <Dialog open={statDialogOpen} onOpenChange={setStatDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingStat?.id ? "تعديل إحصائية" : "إضافة إحصائية جديدة"}</DialogTitle>
          </DialogHeader>
          <StatForm stat={editingStat} onSave={saveStat} onCancel={() => setStatDialogOpen(false)} isLoading={isLoading} />
        </DialogContent>
      </Dialog>

      {/* Request Status Dialog */}
      <Dialog open={requestDialogOpen} onOpenChange={setRequestDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تحديث حالة الطلب</DialogTitle>
            <DialogDescription>{editingRequest?.titleAr}</DialogDescription>
          </DialogHeader>
          {editingRequest && (
            <RequestStatusForm 
              request={editingRequest} 
              onSave={(status, notes) => updateRequestStatus(editingRequest.id, status, notes)} 
              onCancel={() => setRequestDialogOpen(false)} 
              isLoading={isLoading} 
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Reply Dialog */}
      <Dialog open={replyDialogOpen} onOpenChange={setReplyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>الرد على الرسالة</DialogTitle>
            <DialogDescription>{replyingMessage?.subject}</DialogDescription>
          </DialogHeader>
          {replyingMessage && (
            <ReplyForm 
              message={replyingMessage} 
              onSave={(reply) => sendReply(replyingMessage.id, reply)} 
              onCancel={() => setReplyDialogOpen(false)} 
              isLoading={isLoading} 
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Member Dialog */}
      <Dialog open={memberDialogOpen} onOpenChange={setMemberDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingMember?.id ? "تعديل بيانات المنخرط" : "إضافة منخرط جديد"}</DialogTitle>
            <DialogDescription>
              {editingMember?.id 
                ? "تعديل بيانات العضو في الجمعية"
                : "إضافة عضو جديد. كلمة المرور الافتراضية ستكون رقم الانخراط."
              }
            </DialogDescription>
          </DialogHeader>
          <MemberForm 
            member={editingMember} 
            onSave={saveMember} 
            onCancel={() => setMemberDialogOpen(false)} 
            isLoading={isLoading} 
          />
        </DialogContent>
      </Dialog>

      {/* Board Member Dialog */}
      <Dialog open={boardMemberDialogOpen} onOpenChange={setBoardMemberDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingBoardMember?.id ? "تعديل بيانات العضو" : "إضافة عضو جديد"}</DialogTitle>
            <DialogDescription>
              {editingBoardMember?.id 
                ? "تعديل بيانات عضو المكتب المسير"
                : "إضافة عضو جديد للمكتب المسير"
              }
            </DialogDescription>
          </DialogHeader>
          <BoardMemberForm 
            member={editingBoardMember} 
            onSave={saveBoardMember} 
            onCancel={() => setBoardMemberDialogOpen(false)} 
            isLoading={isLoading} 
          />
        </DialogContent>
      </Dialog>

      {/* Committee Dialog */}
      <Dialog open={committeeDialogOpen} onOpenChange={setCommitteeDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingCommittee?.id ? "تعديل بيانات اللجنة" : "إضافة لجنة جديدة"}</DialogTitle>
            <DialogDescription>
              {editingCommittee?.id 
                ? "تعديل بيانات اللجنة وأعضائها"
                : "إضافة لجنة جديدة مع أعضائها"
              }
            </DialogDescription>
          </DialogHeader>
          <CommitteeForm 
            committee={editingCommittee} 
            onSave={saveCommittee} 
            onCancel={() => setCommitteeDialogOpen(false)} 
            isLoading={isLoading} 
          />
        </DialogContent>
      </Dialog>

      {/* Document Dialog */}
      <Dialog open={documentDialogOpen} onOpenChange={setDocumentDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingDocument?.id ? "تعديل المستند" : "إضافة مستند جديد"}</DialogTitle>
            <DialogDescription>
              {editingDocument?.id 
                ? "تعديل بيانات المستند"
                : "إضافة مستند جديد للمكتبة"
              }
            </DialogDescription>
          </DialogHeader>
          <DocumentForm 
            document={editingDocument} 
            onSave={saveDocument} 
            onCancel={() => setDocumentDialogOpen(false)} 
            isLoading={isLoading} 
          />
        </DialogContent>
      </Dialog>

      {/* Document Viewer */}
      <DocumentViewer
        open={documentViewerOpen}
        onOpenChange={setDocumentViewerOpen}
        documentUrl={viewingDocument?.fileUrl || ""}
        documentTitle={viewingDocument?.titleAr || viewingDocument?.titleFr || "معاينة المستند"}
        documentType={viewingDocument?.fileType}
      />
    </div>
  );
}

// Form Components
function PartnerForm({ partner, onSave, onCancel, isLoading }: { 
  partner: Partial<Partner> | null; 
  onSave: (data: Partial<Partner>) => void; 
  onCancel: () => void;
  isLoading: boolean;
}) {
  const [form, setForm] = useState({
    nameAr: partner?.nameAr || "",
    nameFr: partner?.nameFr || "",
    descriptionAr: partner?.descriptionAr || "",
    descriptionFr: partner?.descriptionFr || "",
    logo: partner?.logo || "",
    website: partner?.website || "",
    order: partner?.order || 0,
    active: partner?.active ?? true,
  });

  return (
    <div className="space-y-4" suppressHydrationWarning>
      <div className="space-y-2">
        <Label>الاسم (عربي) *</Label>
        <Input value={form.nameAr} onChange={(e) => setForm({ ...form, nameAr: e.target.value })} />
      </div>
      <div className="space-y-2">
        <Label>Nom (Français) *</Label>
        <Input value={form.nameFr} onChange={(e) => setForm({ ...form, nameFr: e.target.value })} dir="ltr" />
      </div>
      <div className="space-y-2">
        <Label>الوصف (عربي)</Label>
        <Textarea value={form.descriptionAr} onChange={(e) => setForm({ ...form, descriptionAr: e.target.value })} rows={2} />
      </div>
      <div className="space-y-2">
        <Label>Description (Français)</Label>
        <Textarea value={form.descriptionFr} onChange={(e) => setForm({ ...form, descriptionFr: e.target.value })} rows={2} dir="ltr" />
      </div>
      <FileUpload
        value={form.logo}
        onChange={(url) => setForm({ ...form, logo: url })}
        type="image"
        label="شعار الشريك"
      />
      <div className="space-y-2">
        <Label>رابط الموقع</Label>
        <Input value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} dir="ltr" placeholder="https://..." />
      </div>
      <div className="flex items-center gap-2">
        <Switch checked={form.active} onCheckedChange={(checked) => setForm({ ...form, active: checked })} />
        <Label>نشط</Label>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}><X className="w-4 h-4 mr-2" />إلغاء</Button>
        <Button onClick={() => onSave(form)} disabled={isLoading} className="bg-emerald-600 hover:bg-emerald-700">
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}حفظ
        </Button>
      </DialogFooter>
    </div>
  );
}

function NewsForm({ news, onSave, onCancel, isLoading }: { 
  news: Partial<News> | null; 
  onSave: (data: Partial<News>) => void; 
  onCancel: () => void;
  isLoading: boolean;
}) {
  const [form, setForm] = useState({
    titleAr: news?.titleAr || "",
    titleFr: news?.titleFr || "",
    contentAr: news?.contentAr || "",
    contentFr: news?.contentFr || "",
    date: news?.date ? new Date(news.date).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
    image: news?.image || "",
    featured: news?.featured ?? false,
    published: news?.published ?? true,
  });

  return (
    <div className="space-y-4" suppressHydrationWarning>
      <div className="space-y-2">
        <Label>العنوان (عربي) *</Label>
        <Input value={form.titleAr} onChange={(e) => setForm({ ...form, titleAr: e.target.value })} />
      </div>
      <div className="space-y-2">
        <Label>Titre (Français) *</Label>
        <Input value={form.titleFr} onChange={(e) => setForm({ ...form, titleFr: e.target.value })} dir="ltr" />
      </div>
      <div className="space-y-2">
        <Label>المحتوى (عربي) *</Label>
        <Textarea value={form.contentAr} onChange={(e) => setForm({ ...form, contentAr: e.target.value })} rows={3} />
      </div>
      <div className="space-y-2">
        <Label>Contenu (Français) *</Label>
        <Textarea value={form.contentFr} onChange={(e) => setForm({ ...form, contentFr: e.target.value })} rows={3} dir="ltr" />
      </div>
      <div className="space-y-2">
        <Label>التاريخ</Label>
        <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
      </div>
      <FileUpload
        value={form.image}
        onChange={(url) => setForm({ ...form, image: url })}
        type="image"
        label="صورة الخبر"
      />
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Switch checked={form.featured} onCheckedChange={(checked) => setForm({ ...form, featured: checked })} />
          <Label>مميز</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch checked={form.published} onCheckedChange={(checked) => setForm({ ...form, published: checked })} />
          <Label>نشر</Label>
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}><X className="w-4 h-4 mr-2" />إلغاء</Button>
        <Button onClick={() => onSave(form)} disabled={isLoading} className="bg-emerald-600 hover:bg-emerald-700">
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}حفظ
        </Button>
      </DialogFooter>
    </div>
  );
}

function ServiceForm({ service, onSave, onCancel, isLoading }: { 
  service: Partial<Service> | null; 
  onSave: (data: Partial<Service>) => void; 
  onCancel: () => void;
  isLoading: boolean;
}) {
  const [form, setForm] = useState({
    titleAr: service?.titleAr || "",
    titleFr: service?.titleFr || "",
    descriptionAr: service?.descriptionAr || "",
    descriptionFr: service?.descriptionFr || "",
    icon: service?.icon || "Heart",
    color: service?.color || "emerald",
    order: service?.order || 0,
    active: service?.active ?? true,
  });

  const icons = ["Heart", "Users", "Stethoscope", "GraduationCap", "Gift", "Plane", "Calendar"];
  const colors = ["emerald", "red", "blue", "amber", "purple", "teal"];

  return (
    <div className="space-y-4" suppressHydrationWarning>
      <div className="space-y-2">
        <Label>العنوان (عربي) *</Label>
        <Input value={form.titleAr} onChange={(e) => setForm({ ...form, titleAr: e.target.value })} />
      </div>
      <div className="space-y-2">
        <Label>Titre (Français) *</Label>
        <Input value={form.titleFr} onChange={(e) => setForm({ ...form, titleFr: e.target.value })} dir="ltr" />
      </div>
      <div className="space-y-2">
        <Label>الوصف (عربي) *</Label>
        <Textarea value={form.descriptionAr} onChange={(e) => setForm({ ...form, descriptionAr: e.target.value })} rows={2} />
      </div>
      <div className="space-y-2">
        <Label>Description (Français) *</Label>
        <Textarea value={form.descriptionFr} onChange={(e) => setForm({ ...form, descriptionFr: e.target.value })} rows={2} dir="ltr" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>الأيقونة</Label>
          <select className="w-full p-2 border rounded-md" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })}>
            {icons.map((icon) => (<option key={icon} value={icon}>{icon}</option>))}
          </select>
        </div>
        <div className="space-y-2">
          <Label>اللون</Label>
          <select className="w-full p-2 border rounded-md" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })}>
            {colors.map((color) => (<option key={color} value={color}>{color}</option>))}
          </select>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Switch checked={form.active} onCheckedChange={(checked) => setForm({ ...form, active: checked })} />
        <Label>نشط</Label>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}><X className="w-4 h-4 mr-2" />إلغاء</Button>
        <Button onClick={() => onSave(form)} disabled={isLoading} className="bg-emerald-600 hover:bg-emerald-700">
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}حفظ
        </Button>
      </DialogFooter>
    </div>
  );
}

function StatForm({ stat, onSave, onCancel, isLoading }: { 
  stat: Partial<Stat> | null; 
  onSave: (data: Partial<Stat>) => void; 
  onCancel: () => void;
  isLoading: boolean;
}) {
  const [form, setForm] = useState({
    key: stat?.key || "",
    value: stat?.value || "",
    labelAr: stat?.labelAr || "",
    labelFr: stat?.labelFr || "",
    icon: stat?.icon || "Users",
    order: stat?.order || 0,
    active: stat?.active ?? true,
  });

  const icons = ["Users", "Heart", "Award", "Building2"];

  return (
    <div className="space-y-4" suppressHydrationWarning>
      <div className="space-y-2">
        <Label>المفتاح *</Label>
        <Input value={form.key} onChange={(e) => setForm({ ...form, key: e.target.value })} dir="ltr" placeholder="members" />
      </div>
      <div className="space-y-2">
        <Label>القيمة *</Label>
        <Input value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} placeholder="500+" />
      </div>
      <div className="space-y-2">
        <Label>العنوان (عربي) *</Label>
        <Input value={form.labelAr} onChange={(e) => setForm({ ...form, labelAr: e.target.value })} placeholder="عضو نشط" />
      </div>
      <div className="space-y-2">
        <Label>Titre (Français) *</Label>
        <Input value={form.labelFr} onChange={(e) => setForm({ ...form, labelFr: e.target.value })} dir="ltr" placeholder="Membres Actifs" />
      </div>
      <div className="space-y-2">
        <Label>الأيقونة</Label>
        <select className="w-full p-2 border rounded-md" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })}>
          {icons.map((icon) => (<option key={icon} value={icon}>{icon}</option>))}
        </select>
      </div>
      <div className="flex items-center gap-2">
        <Switch checked={form.active} onCheckedChange={(checked) => setForm({ ...form, active: checked })} />
        <Label>نشط</Label>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}><X className="w-4 h-4 mr-2" />إلغاء</Button>
        <Button onClick={() => onSave(form)} disabled={isLoading} className="bg-emerald-600 hover:bg-emerald-700">
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}حفظ
        </Button>
      </DialogFooter>
    </div>
  );
}

function RequestStatusForm({ request, onSave, onCancel, isLoading }: { 
  request: ServiceRequest; 
  onSave: (status: string, notes?: string) => void; 
  onCancel: () => void;
  isLoading: boolean;
}) {
  const [form, setForm] = useState({
    status: request.status,
    notes: request.notes || "",
  });

  return (
    <div className="space-y-4" suppressHydrationWarning>
      <div className="space-y-2">
        <Label>حالة الطلب</Label>
        <select className="w-full p-2 border rounded-md" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
          <option value="pending">قيد المراجعة</option>
          <option value="approved">تمت الموافقة</option>
          <option value="rejected">مرفوض</option>
          <option value="completed">مكتمل</option>
        </select>
      </div>
      <div className="space-y-2">
        <Label>ملاحظات</Label>
        <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={3} placeholder="أضف ملاحظات للعضو..." />
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>إلغاء</Button>
        <Button onClick={() => onSave(form.status, form.notes)} disabled={isLoading} className="bg-emerald-600 hover:bg-emerald-700">
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}حفظ
        </Button>
      </DialogFooter>
    </div>
  );
}

function ReplyForm({ message, onSave, onCancel, isLoading }: { 
  message: MemberMessage; 
  onSave: (reply: string) => void; 
  onCancel: () => void;
  isLoading: boolean;
}) {
  const [reply, setReply] = useState(message.reply || "");

  return (
    <div className="space-y-4" suppressHydrationWarning>
      <div className="p-3 bg-muted rounded-lg">
        <p className="text-sm text-muted-foreground mb-1">الرسالة الأصلية:</p>
        <p className="text-sm">{message.message}</p>
      </div>
      <div className="space-y-2">
        <Label>الرد</Label>
        <Textarea value={reply} onChange={(e) => setReply(e.target.value)} rows={4} placeholder="اكتب ردك هنا..." />
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>إلغاء</Button>
        <Button onClick={() => onSave(reply)} disabled={isLoading || !reply.trim()} className="bg-emerald-600 hover:bg-emerald-700">
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}إرسال الرد
        </Button>
      </DialogFooter>
    </div>
  );
}

function NotificationSettingsForm({ settings, onSave, isLoading }: { 
  settings: NotificationSetting[]; 
  onSave: (settings: { key: string; value: string }[]) => void; 
  isLoading: boolean;
}) {
  // Track only changes from default values
  const [changes, setChanges] = useState<Record<string, string>>({});
  
  // Get setting value with memoized approach
  const getSettingValue = (key: string): string => {
    if (key in changes) return changes[key];
    const setting = settings.find(s => s.key === key);
    return setting?.value || "";
  };
  
  // Check if whatsapp is enabled
  const whatsappEnabled = getSettingValue("whatsapp_enabled") === "true";

  const handleChange = (key: string, value: string) => {
    setChanges(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    // Build final settings from original + changes
    const settingsArray = settings.map(s => ({
      key: s.key,
      value: s.key in changes ? changes[s.key] : (s.value || "")
    }));
    onSave(settingsArray);
    setChanges({}); // Clear changes after save
  };

  // Show placeholder when no settings are available yet
  if (settings.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4" suppressHydrationWarning>
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
        <p className="font-semibold mb-2">📱 كيفية الحصول على مفتاح API (TextMeBot - مجاني):</p>
        <ol className="list-decimal list-inside space-y-1 text-xs">
          <li>اذهب إلى <a href="https://textmebot.com" target="_blank" className="underline font-semibold">TextMeBot.com</a></li>
          <li>أنشئ حساباً جديداً أو سجل الدخول</li>
          <li>من لوحة التحكم، انقر على <span className="font-mono bg-amber-100 px-1 rounded">Add WhatsApp</span></li>
          <li>امسح رمز QR باستخدام واتساب على هاتفك (الإعدادات → الأجهزة المرتبطة)</li>
          <li>بعد ربط حسابك، انسخ <span className="font-mono bg-amber-100 px-1 rounded">API Key</span> والصقه هنا</li>
        </ol>
        <p className="mt-2 text-xs">
          📖 التفاصيل: <a href="https://textmebot.com/documentation-api/" target="_blank" className="underline">TextMeBot API Documentation</a>
        </p>
      </div>

      <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
        <div>
          <Label className="font-semibold">تفعيل التنبيهات</Label>
          <p className="text-xs text-muted-foreground">تفعيل/تعطيل إرسال تنبيهات واتساب</p>
        </div>
        <Switch 
          checked={whatsappEnabled} 
          onCheckedChange={(checked) => handleChange("whatsapp_enabled", checked ? "true" : "false")}
        />
      </div>

      <div className="space-y-2">
        <Label>مفتاح API (API Key)</Label>
        <Input 
          type="password"
          value={getSettingValue("whatsapp_api_key")} 
          onChange={(e) => handleChange("whatsapp_api_key", e.target.value)}
          placeholder="مثال: G2mevrKwEqj2"
          dir="ltr"
        />
        <p className="text-xs text-muted-foreground">المفتاح الذي حصلت عليه من TextMeBot</p>
      </div>

      <div className="space-y-2">
        <Label>رابط API (اتركه كما هو)</Label>
        <Input 
          value={getSettingValue("whatsapp_base_url")} 
          onChange={(e) => handleChange("whatsapp_base_url", e.target.value)}
          placeholder="https://api.textmebot.com/send.php"
          dir="ltr"
        />
        <p className="text-xs text-muted-foreground">رابط TextMeBot API الافتراضي</p>
      </div>

      <div className="flex items-center gap-2">
        <Button 
          onClick={handleSave} 
          disabled={isLoading} 
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
          حفظ الإعدادات
        </Button>
      </div>

      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-800">
        <p className="font-semibold mb-1">💡 ملاحظة:</p>
        <p>سيتم إرسال تنبيهات واتساب تلقائياً عند:</p>
        <ul className="list-disc list-inside mt-1">
          <li>تحديث حالة طلب خدمة</li>
          <li>الرد على رسالة عضو</li>
          <li>تفعيل/تعطيل حساب عضو</li>
          <li>استلام طلب خدمة جديد</li>
        </ul>
      </div>

      <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800">
        <p className="font-semibold mb-1">⚠️ تنبيه مهم:</p>
        <p>TextMeBot هي خدمة مجانية للاستخدام الشخصي. قد تكون هناك حدود لعدد الرسائل اليومية. للأعمال الكبيرة، يُنصح باستخدام WhatsApp Business API.</p>
      </div>
    </div>
  );
}

// Member Form Component
function MemberForm({ member, onSave, onCancel, isLoading }: { 
  member: Partial<Member> | null; 
  onSave: (data: Partial<Member>) => void; 
  onCancel: () => void;
  isLoading: boolean;
}) {
  const [form, setForm] = useState({
    memberNumber: member?.memberNumber || "",
    nationalId: member?.nationalId || "",
    nameAr: member?.nameAr || "",
    nameFr: member?.nameFr || "",
    email: member?.email || "",
    phone: member?.phone || "",
    whatsapp: member?.whatsapp || "",
    department: member?.department || "",
    active: member?.active ?? true,
  });

  const generateMemberNumber = () => {
    const num = Math.floor(Math.random() * 900) + 100;
    return `M${num}`;
  };

  return (
    <div className="space-y-4" suppressHydrationWarning>
      {!member?.id && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-800">
          <p className="font-semibold">ℹ️ معلومات:</p>
          <p>كلمة المرور الافتراضية ستكون نفس رقم الانخراط. يمكن للمنخرط تغييرها عند أول تسجيل دخول.</p>
        </div>
      )}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>رقم الانخراط *</Label>
          <div className="flex gap-2">
            <Input 
              value={form.memberNumber} 
              onChange={(e) => setForm({ ...form, memberNumber: e.target.value })}
              placeholder="M001"
              className="font-mono"
              dir="ltr"
            />
            {!member?.id && (
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={() => setForm({ ...form, memberNumber: generateMemberNumber() })}
              >
                توليد
              </Button>
            )}
          </div>
        </div>
        <div className="space-y-2">
          <Label>رقم البطاقة الوطنية *</Label>
          <Input 
            value={form.nationalId} 
            onChange={(e) => setForm({ ...form, nationalId: e.target.value.toUpperCase() })}
            placeholder="AB123456"
            className="font-mono"
            dir="ltr"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>الاسم (عربي) *</Label>
          <Input value={form.nameAr} onChange={(e) => setForm({ ...form, nameAr: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Nom (Français)</Label>
          <Input value={form.nameFr} onChange={(e) => setForm({ ...form, nameFr: e.target.value })} dir="ltr" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>البريد الإلكتروني</Label>
          <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} dir="ltr" />
        </div>
        <div className="space-y-2">
          <Label>رقم الهاتف</Label>
          <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} dir="ltr" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>رقم الواتساب</Label>
          <Input value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} placeholder="+2126XXXXXXXX" dir="ltr" />
        </div>
        <div className="space-y-2">
          <Label>القسم</Label>
          <Input value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Switch checked={form.active} onCheckedChange={(checked) => setForm({ ...form, active: checked })} />
        <Label>نشط</Label>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}><X className="w-4 h-4 mr-2" />إلغاء</Button>
        <Button onClick={() => onSave(form)} disabled={isLoading} className="bg-emerald-600 hover:bg-emerald-700">
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
          {member?.id ? "حفظ التغييرات" : "إضافة المنخرط"}
        </Button>
      </DialogFooter>
    </div>
  );
}

// Board Member Form Component
function BoardMemberForm({ member, onSave, onCancel, isLoading }: { 
  member: Partial<BoardMember> | null; 
  onSave: (data: Partial<BoardMember>) => void; 
  onCancel: () => void;
  isLoading: boolean;
}) {
  const [form, setForm] = useState({
    nameAr: member?.nameAr || "",
    nameFr: member?.nameFr || "",
    titleAr: member?.titleAr || "",
    titleFr: member?.titleFr || "",
    photo: member?.photo || "",
    bioAr: member?.bioAr || "",
    bioFr: member?.bioFr || "",
    email: member?.email || "",
    phone: member?.phone || "",
    order: member?.order || 0,
    active: member?.active ?? true,
  });

  return (
    <div className="space-y-4" suppressHydrationWarning>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>الاسم والنسب (عربي) *</Label>
          <Input 
            value={form.nameAr} 
            onChange={(e) => setForm({ ...form, nameAr: e.target.value })}
            placeholder="محمد بن أحمد"
          />
        </div>
        <div className="space-y-2">
          <Label>Nom et Prénom (Français) *</Label>
          <Input 
            value={form.nameFr} 
            onChange={(e) => setForm({ ...form, nameFr: e.target.value })}
            placeholder="Mohamed Ben Ahmed"
            dir="ltr"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>الصفة (عربي) *</Label>
          <Input 
            value={form.titleAr} 
            onChange={(e) => setForm({ ...form, titleAr: e.target.value })}
            placeholder="الرئيس، الكاتب العام، أمين المال..."
          />
        </div>
        <div className="space-y-2">
          <Label>Titre (Français) *</Label>
          <Input 
            value={form.titleFr} 
            onChange={(e) => setForm({ ...form, titleFr: e.target.value })}
            placeholder="Président, Secrétaire Général, Trésorier..."
            dir="ltr"
          />
        </div>
      </div>
      <FileUpload
        value={form.photo}
        onChange={(url) => setForm({ ...form, photo: url })}
        type="image"
        label="صورة العضو"
      />
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>نبذة (عربي)</Label>
          <Textarea 
            value={form.bioAr} 
            onChange={(e) => setForm({ ...form, bioAr: e.target.value })}
            rows={2}
          />
        </div>
        <div className="space-y-2">
          <Label>Biographie (Français)</Label>
          <Textarea 
            value={form.bioFr} 
            onChange={(e) => setForm({ ...form, bioFr: e.target.value })}
            rows={2}
            dir="ltr"
          />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>البريد الإلكتروني</Label>
          <Input 
            type="email" 
            value={form.email} 
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            dir="ltr"
          />
        </div>
        <div className="space-y-2">
          <Label>رقم الهاتف</Label>
          <Input 
            value={form.phone} 
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            dir="ltr"
          />
        </div>
        <div className="space-y-2">
          <Label>الترتيب</Label>
          <Input 
            type="number" 
            value={form.order} 
            onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Switch checked={form.active} onCheckedChange={(checked) => setForm({ ...form, active: checked })} />
        <Label>نشط</Label>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}><X className="w-4 h-4 mr-2" />إلغاء</Button>
        <Button onClick={() => onSave(form)} disabled={isLoading} className="bg-emerald-600 hover:bg-emerald-700">
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
          {member?.id ? "حفظ التغييرات" : "إضافة العضو"}
        </Button>
      </DialogFooter>
    </div>
  );
}

// Committee Form Component
function CommitteeForm({ committee, onSave, onCancel, isLoading }: { 
  committee: Partial<Committee> | null; 
  onSave: (data: Partial<Committee>) => void; 
  onCancel: () => void;
  isLoading: boolean;
}) {
  const [form, setForm] = useState({
    nameAr: committee?.nameAr || "",
    nameFr: committee?.nameFr || "",
    descriptionAr: committee?.descriptionAr || "",
    descriptionFr: committee?.descriptionFr || "",
    icon: committee?.icon || "Users",
    color: committee?.color || "emerald",
    order: committee?.order || 0,
    active: committee?.active ?? true,
    members: committee?.members || [] as CommitteeMember[],
  });

  const [newMember, setNewMember] = useState({
    nameAr: "",
    nameFr: "",
    titleAr: "",
    titleFr: "",
  });

  const icons = ["Users", "Heart", "Award", "Building2", "Stethoscope", "GraduationCap", "Gift", "Plane", "Calendar"];
  const colors = ["emerald", "red", "blue", "amber", "purple", "teal"];

  const addMember = () => {
    if (!newMember.nameAr || !newMember.nameFr) return;
    setForm({
      ...form,
      members: [...form.members, { 
        id: `temp-${Date.now()}`, 
        ...newMember, 
        order: form.members.length 
      }],
    });
    setNewMember({ nameAr: "", nameFr: "", titleAr: "", titleFr: "" });
  };

  const removeMember = (index: number) => {
    setForm({
      ...form,
      members: form.members.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-4" suppressHydrationWarning>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>اسم اللجنة (عربي) *</Label>
          <Input 
            value={form.nameAr} 
            onChange={(e) => setForm({ ...form, nameAr: e.target.value })}
            placeholder="لجنة التربية والتكوين"
          />
        </div>
        <div className="space-y-2">
          <Label>Nom de la Commission (Français) *</Label>
          <Input 
            value={form.nameFr} 
            onChange={(e) => setForm({ ...form, nameFr: e.target.value })}
            placeholder="Commission d'Éducation et de Formation"
            dir="ltr"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>الوصف (عربي)</Label>
          <Textarea 
            value={form.descriptionAr} 
            onChange={(e) => setForm({ ...form, descriptionAr: e.target.value })}
            rows={2}
          />
        </div>
        <div className="space-y-2">
          <Label>Description (Français)</Label>
          <Textarea 
            value={form.descriptionFr} 
            onChange={(e) => setForm({ ...form, descriptionFr: e.target.value })}
            rows={2}
            dir="ltr"
          />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>الأيقونة</Label>
          <select 
            className="w-full p-2 border rounded-md"
            value={form.icon}
            onChange={(e) => setForm({ ...form, icon: e.target.value })}
          >
            {icons.map((icon) => <option key={icon} value={icon}>{icon}</option>)}
          </select>
        </div>
        <div className="space-y-2">
          <Label>اللون</Label>
          <select 
            className="w-full p-2 border rounded-md"
            value={form.color}
            onChange={(e) => setForm({ ...form, color: e.target.value })}
          >
            {colors.map((color) => <option key={color} value={color}>{color}</option>)}
          </select>
        </div>
        <div className="space-y-2">
          <Label>الترتيب</Label>
          <Input 
            type="number" 
            value={form.order} 
            onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
          />
        </div>
      </div>

      {/* Members Section */}
      <div className="border-t pt-4">
        <Label className="text-base font-semibold">أعضاء اللجنة</Label>
        <div className="mt-3 space-y-2">
          {form.members.map((member, index) => (
            <div key={member.id || index} className="flex items-center justify-between p-2 bg-muted rounded-lg">
              <div>
                <p className="font-medium text-sm">{member.nameAr} / {member.nameFr}</p>
                {member.titleAr && <p className="text-xs text-muted-foreground">{member.titleAr}</p>}
              </div>
              <Button variant="ghost" size="sm" onClick={() => removeMember(index)}>
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </div>
          ))}
        </div>

        {/* Add new member form */}
        <div className="mt-4 p-3 border rounded-lg">
          <p className="text-sm font-medium mb-2">إضافة عضو جديد</p>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <Input 
              value={newMember.nameAr}
              onChange={(e) => setNewMember({ ...newMember, nameAr: e.target.value })}
              placeholder="الاسم (عربي)"
            />
            <Input 
              value={newMember.nameFr}
              onChange={(e) => setNewMember({ ...newMember, nameFr: e.target.value })}
              placeholder="Nom (Français)"
              dir="ltr"
            />
          </div>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <Input 
              value={newMember.titleAr}
              onChange={(e) => setNewMember({ ...newMember, titleAr: e.target.value })}
              placeholder="الصفة (عربي) - اختياري"
            />
            <Input 
              value={newMember.titleFr}
              onChange={(e) => setNewMember({ ...newMember, titleFr: e.target.value })}
              placeholder="Titre (Français) - optionnel"
              dir="ltr"
            />
          </div>
          <Button type="button" variant="outline" size="sm" onClick={addMember}>
            <Plus className="w-4 h-4 mr-1" />
            إضافة العضو
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Switch checked={form.active} onCheckedChange={(checked) => setForm({ ...form, active: checked })} />
        <Label>نشط</Label>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}><X className="w-4 h-4 mr-2" />إلغاء</Button>
        <Button onClick={() => onSave(form)} disabled={isLoading} className="bg-emerald-600 hover:bg-emerald-700">
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
          {committee?.id ? "حفظ التغييرات" : "إضافة اللجنة"}
        </Button>
      </DialogFooter>
    </div>
  );
}

// Document Form Component
function DocumentForm({ document, onSave, onCancel, isLoading }: { 
  document: Partial<Document> | null; 
  onSave: (data: Partial<Document>) => void; 
  onCancel: () => void;
  isLoading: boolean;
}) {
  const [form, setForm] = useState({
    titleAr: document?.titleAr || "",
    titleFr: document?.titleFr || "",
    descriptionAr: document?.descriptionAr || "",
    descriptionFr: document?.descriptionFr || "",
    category: document?.category || "general",
    fileUrl: document?.fileUrl || "",
    fileType: document?.fileType || "PDF",
    fileSize: document?.fileSize || undefined as number | undefined,
    visibilityType: document?.visibilityType || "public",
    order: document?.order || 0,
    active: document?.active ?? true,
  });

  return (
    <div className="space-y-4" suppressHydrationWarning>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>العنوان بالعربية *</Label>
          <Input
            value={form.titleAr}
            onChange={(e) => setForm({ ...form, titleAr: e.target.value })}
            placeholder="عنوان المستند"
          />
        </div>
        <div className="space-y-2">
          <Label>العنوان بالفرنسية *</Label>
          <Input
            value={form.titleFr}
            onChange={(e) => setForm({ ...form, titleFr: e.target.value })}
            placeholder="Titre du document"
            dir="ltr"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>الوصف (عربي)</Label>
        <Textarea
          value={form.descriptionAr}
          onChange={(e) => setForm({ ...form, descriptionAr: e.target.value })}
          placeholder="وصف المستند بالعربية"
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label>الوصف (فرنسي)</Label>
        <Textarea
          value={form.descriptionFr}
          onChange={(e) => setForm({ ...form, descriptionFr: e.target.value })}
          placeholder="Description du document"
          dir="ltr"
          rows={2}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>التصنيف</Label>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full p-2 border rounded-md"
          >
            <option value="general">عام</option>
            <option value="financial">مالي</option>
            <option value="administrative">إداري</option>
            <option value="legal">قانوني</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label>نوع الملف</Label>
          <select
            value={form.fileType}
            onChange={(e) => setForm({ ...form, fileType: e.target.value })}
            className="w-full p-2 border rounded-md"
          >
            <option value="PDF">PDF</option>
            <option value="Word">Word</option>
            <option value="Excel">Excel</option>
            <option value="PowerPoint">PowerPoint</option>
            <option value="Image">صورة</option>
            <option value="Other">أخرى</option>
          </select>
        </div>
      </div>

      <FileUpload
        value={form.fileUrl}
        onChange={(url, fileInfo) => {
          setForm({ 
            ...form, 
            fileUrl: url,
            // Auto-detect file type from upload
            fileType: fileInfo?.fileType === 'pdf' ? 'PDF' :
                     fileInfo?.fileType === 'word' ? 'Word' :
                     fileInfo?.fileType === 'excel' ? 'Excel' :
                     fileInfo?.fileType === 'powerpoint' ? 'PowerPoint' :
                     fileInfo?.fileType === 'image' ? 'Image' : form.fileType,
            fileSize: fileInfo?.fileSize
          });
        }}
        type="document"
        label="الملف"
      />

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>مستوى الظهور</Label>
          <select
            value={form.visibilityType}
            onChange={(e) => setForm({ ...form, visibilityType: e.target.value })}
            className="w-full p-2 border rounded-md"
          >
            <option value="public">للجميع</option>
            <option value="members">المنخرطين فقط</option>
            <option value="office">المكتب فقط</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label>الترتيب</Label>
          <Input
            type="number"
            value={form.order}
            onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Switch checked={form.active} onCheckedChange={(checked) => setForm({ ...form, active: checked })} />
        <Label>منشور</Label>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onCancel}><X className="w-4 h-4 mr-2" />إلغاء</Button>
        <Button onClick={() => onSave(form)} disabled={isLoading} className="bg-emerald-600 hover:bg-emerald-700">
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
          {document?.id ? "حفظ التغييرات" : "إضافة المستند"}
        </Button>
      </DialogFooter>
    </div>
  );
}
