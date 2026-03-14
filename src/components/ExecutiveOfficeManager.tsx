"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
  Users, 
  Plus,
  Pencil,
  Trash2,
  Save,
  X,
  Loader2,
  MessageSquare,
  Shield,
  Clock,
  Crown,
  Key,
  UserCheck,
  UserCog,
  Send,
  AlertCircle,
  FileText
} from "lucide-react";
import { formatDateShort } from "@/lib/dateUtils";

// Types
interface ExecutiveMember {
  id: string;
  username: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  photo: string | null;
  role: string;
  positionAr: string | null;
  positionFr: string | null;
  permissions: string[];
  active: boolean;
  lastLogin: Date | null;
  createdAt: Date;
}

interface ExecutiveMessage {
  id: string;
  senderId: string;
  receiverId: string | null;
  subject: string;
  message: string;
  type: string;
  fileUrl: string | null;
  read: boolean;
  createdAt: Date;
  sender: {
    id: string;
    name: string | null;
    role: string;
    positionAr?: string | null;
  } | null;
}

interface Delegation {
  id: string;
  fromUserId: string;
  toUserId: string;
  permission: string;
  active: boolean;
  createdAt: Date;
  fromUser: {
    id: string;
    name: string | null;
    role: string;
    positionAr: string | null;
  } | null;
  toUser: {
    id: string;
    name: string | null;
    role: string;
    positionAr: string | null;
  } | null;
}

// Role labels and colors
const roleLabels: Record<string, string> = {
  president: "الرئيس",
  general_secretary: "الكاتب العام",
  treasurer: "أمين المال",
  deputy: "النائب",
  admin: "مدير"
};

const roleColors: Record<string, string> = {
  president: "bg-amber-100 text-amber-700 border-amber-200",
  general_secretary: "bg-blue-100 text-blue-700 border-blue-200",
  treasurer: "bg-emerald-100 text-emerald-700 border-emerald-200",
  deputy: "bg-purple-100 text-purple-700 border-purple-200",
  admin: "bg-gray-100 text-gray-700 border-gray-200"
};

const roleIcons: Record<string, React.ReactNode> = {
  president: <Crown className="w-4 h-4" />,
  general_secretary: <FileText className="w-4 h-4" />,
  treasurer: <Key className="w-4 h-4" />,
  deputy: <UserCheck className="w-4 h-4" />,
  admin: <UserCog className="w-4 h-4" />
};

const messageTypeLabels: Record<string, string> = {
  message: "رسالة",
  news: "خبر",
  file: "ملف",
  invitation: "دعوة",
  photo: "صورة"
};

const messageTypeIcons: Record<string, React.ReactNode> = {
  message: <MessageSquare className="w-4 h-4" />,
  news: <FileText className="w-4 h-4" />,
  file: <FileText className="w-4 h-4" />,
  invitation: <Clock className="w-4 h-4" />
};

// Available permissions
const availablePermissions = [
  { key: 'all', label: 'جميع الصلاحيات', description: 'صلاحيات كاملة' },
  { key: 'news', label: 'الأخبار', description: 'إدارة الأخبار والنشر' },
  { key: 'members', label: 'الأعضاء', description: 'إدارة حسابات الأعضاء' },
  { key: 'documents', label: 'المستندات', description: 'إدارة المستندات والملفات' },
  { key: 'messages', label: 'الرسائل', description: 'قراءة والرد على الرسائل' },
  { key: 'reports', label: 'التقارير', description: 'عرض وإنشاء التقارير' },
  { key: 'finance', label: 'المالية', description: 'إدارة الشؤون المالية' },
  { key: 'settings', label: 'الإعدادات', description: 'تعديل إعدادات الموقع' },
];

export default function ExecutiveOfficeManager() {
  const [activeSubTab, setActiveSubTab] = useState("members");
  const [isLoading, setIsLoading] = useState(false);
  
  // Data states
  const [executiveMembers, setExecutiveMembers] = useState<ExecutiveMember[]>([]);
  const [executiveMessages, setExecutiveMessages] = useState<ExecutiveMessage[]>([]);
  const [delegations, setDelegations] = useState<Delegation[]>([]);
  
  // Dialog states
  const [memberDialogOpen, setMemberDialogOpen] = useState(false);
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [delegationDialogOpen, setDelegationDialogOpen] = useState(false);
  const [viewMessageDialogOpen, setViewMessageDialogOpen] = useState(false);
  
  // Edit states
  const [editingMember, setEditingMember] = useState<ExecutiveMember | null>(null);
  const [viewingMessage, setViewingMessage] = useState<ExecutiveMessage | null>(null);
  const [memberForm, setMemberForm] = useState({
    username: "",
    password: "",
    name: "",
    email: "",
    phone: "",
    role: "admin",
    positionAr: "",
    positionFr: "",
    permissions: [] as string[]
  });
  const [messageForm, setMessageForm] = useState({
    receiverId: "",
    subject: "",
    contentAr: "",
    type: "message"
  });
  const [delegationForm, setDelegationForm] = useState({
    toAdminId: "",
    permissions: [] as string[]
  });

  // Current admin info
  const [currentAdmin, setCurrentAdmin] = useState<{id: string; role: string; permissions: string[]} | null>(null);

  useEffect(() => {
    // Get current admin from localStorage
    const savedAdmin = localStorage.getItem("admin");
    if (savedAdmin) {
      const admin = JSON.parse(savedAdmin);
      setCurrentAdmin({
        id: admin.id,
        role: admin.role,
        permissions: admin.permissions || []
      });
    }
    
    fetchExecutiveMembers();
    fetchExecutiveMessages();
    fetchDelegations();
  }, []);

  // Fetch functions
  const fetchExecutiveMembers = async () => {
    try {
      const res = await fetch("/api/executive-members");
      const data = await res.json();
      setExecutiveMembers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching executive members:", error);
    }
  };

  const fetchExecutiveMessages = async () => {
    try {
      const res = await fetch("/api/executive-messages");
      const data = await res.json();
      setExecutiveMessages(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching executive messages:", error);
    }
  };

  const fetchDelegations = async () => {
    try {
      const res = await fetch("/api/delegations");
      const data = await res.json();
      setDelegations(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching delegations:", error);
    }
  };

  // Check if current user is president
  const isPresident = currentAdmin?.role === "president";

  // Save member
  const saveMember = async () => {
    setIsLoading(true);
    try {
      if (editingMember?.id) {
        await fetch(`/api/executive-members?id=${editingMember.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingMember.id,
            name: memberForm.name,
            email: memberForm.email,
            phone: memberForm.phone,
            role: memberForm.role,
            positionAr: memberForm.positionAr,
            positionFr: memberForm.positionFr,
            permissions: memberForm.permissions,
            password: memberForm.password || undefined
          }),
        });
      } else {
        await fetch("/api/executive-members", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: memberForm.username,
            password: memberForm.password,
            name: memberForm.name,
            email: memberForm.email,
            phone: memberForm.phone,
            role: memberForm.role,
            positionAr: memberForm.positionAr,
            positionFr: memberForm.positionFr,
            permissions: memberForm.permissions
          }),
        });
      }
      fetchExecutiveMembers();
      setMemberDialogOpen(false);
      resetMemberForm();
    } catch (error) {
      console.error("Error saving member:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete member
  const deleteMember = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا العضو؟")) return;
    try {
      await fetch(`/api/executive-members?id=${id}`, { method: "DELETE" });
      fetchExecutiveMembers();
    } catch (error) {
      console.error("Error deleting member:", error);
    }
  };

  // Send message
  const sendMessage = async () => {
    if (!currentAdmin) return;
    
    setIsLoading(true);
    try {
      await fetch("/api/executive-messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderId: currentAdmin.id,
          receiverId: messageForm.receiverId || null,
          subject: messageForm.subject,
          message: messageForm.contentAr,
          type: messageForm.type
        }),
      });
      fetchExecutiveMessages();
      setMessageDialogOpen(false);
      resetMessageForm();
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Mark message as read
  const markMessageRead = async (id: string) => {
    try {
      await fetch("/api/executive-messages", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, read: true }),
      });
      fetchExecutiveMessages();
    } catch (error) {
      console.error("Error marking message as read:", error);
    }
  };

  // Create delegation
  const createDelegation = async () => {
    if (!currentAdmin) return;
    
    setIsLoading(true);
    try {
      for (const perm of delegationForm.permissions) {
        await fetch("/api/delegations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fromUserId: currentAdmin.id,
            toUserId: delegationForm.toAdminId,
            permission: perm
          }),
        });
      }
      fetchDelegations();
      setDelegationDialogOpen(false);
      resetDelegationForm();
    } catch (error) {
      console.error("Error creating delegation:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset forms
  const resetMemberForm = () => {
    setMemberForm({
      username: "",
      password: "",
      name: "",
      email: "",
      phone: "",
      role: "admin",
      positionAr: "",
      positionFr: "",
      permissions: []
    });
    setEditingMember(null);
  };

  const resetMessageForm = () => {
    setMessageForm({
      receiverId: "",
      subject: "",
      contentAr: "",
      type: "message"
    });
  };

  const resetDelegationForm = () => {
    setDelegationForm({
      toAdminId: "",
      permissions: []
    });
  };

  // Open edit member dialog
  const openEditMember = (member: ExecutiveMember) => {
    setEditingMember(member);
    setMemberForm({
      username: member.username,
      password: "",
      name: member.name || "",
      email: member.email || "",
      phone: member.phone || "",
      role: member.role,
      positionAr: member.positionAr || "",
      positionFr: member.positionFr || "",
      permissions: member.permissions || []
    });
    setMemberDialogOpen(true);
  };

  // Open view message dialog
  const openViewMessage = (message: ExecutiveMessage) => {
    setViewingMessage(message);
    if (!message.read) {
      markMessageRead(message.id);
    }
    setViewMessageDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeSubTab} onValueChange={setActiveSubTab}>
        <TabsList className="flex flex-wrap gap-2 mb-6 bg-transparent h-auto">
          <TabsTrigger value="members" className="flex items-center gap-2 data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
            <Users className="w-4 h-4" />
            <span>أعضاء المكتب</span>
          </TabsTrigger>
          <TabsTrigger value="messages" className="flex items-center gap-2 data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
            <MessageSquare className="w-4 h-4" />
            <span>الرسائل</span>
            {executiveMessages.filter(m => !m.read && m.receiverId === currentAdmin?.id).length > 0 && (
              <Badge className="bg-red-500 text-white text-xs px-1.5">
                {executiveMessages.filter(m => !m.read && m.receiverId === currentAdmin?.id).length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="delegations" className="flex items-center gap-2 data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
            <Shield className="w-4 h-4" />
            <span>التفويضات</span>
          </TabsTrigger>
        </TabsList>

        {/* Members Tab */}
        <TabsContent value="members">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>أعضاء المكتب المسير</CardTitle>
                  <CardDescription>إدارة حسابات أعضاء المكتب المسير وصلاحياتهم</CardDescription>
                </div>
                {isPresident && (
                  <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => { resetMemberForm(); setMemberDialogOpen(true); }}>
                    <Plus className="w-4 h-4 mr-2" />
                    إضافة عضو
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {executiveMembers.map((member) => (
                  <Card key={member.id} className={!member.active ? "opacity-50" : ""}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold">
                            {member.photo ? (
                              <img src={member.photo} alt={member.name || member.username} className="w-12 h-12 rounded-full object-cover" />
                            ) : (
                              (member.name?.[0] || member.username[0]).toUpperCase()
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{member.name || member.username}</h3>
                              <Badge className={roleColors[member.role]}>
                                {roleIcons[member.role]}
                                <span className="mr-1">{roleLabels[member.role]}</span>
                              </Badge>
                              {!member.active && (
                                <Badge variant="outline" className="text-red-600 border-red-200">غير نشط</Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {member.positionAr} {member.positionFr && `/ ${member.positionFr}`}
                            </p>
                            {member.lastLogin && (
                              <p className="text-xs text-muted-foreground mt-1">
                                <Clock className="w-3 h-3 inline mr-1" />
                                آخر دخول: {formatDateShort(member.lastLogin, true)}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {member.permissions && member.permissions.length > 0 && (
                            <div className="flex flex-wrap gap-1 max-w-xs">
                              {member.permissions.slice(0, 3).map((perm) => (
                                <Badge key={perm} variant="outline" className="text-xs">
                                  {availablePermissions.find(p => p.key === perm)?.label || perm}
                                </Badge>
                              ))}
                              {member.permissions.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{member.permissions.length - 3}
                                </Badge>
                              )}
                            </div>
                          )}
                          {isPresident && member.role !== "president" && (
                            <>
                              <Button variant="outline" size="sm" onClick={() => openEditMember(member)}>
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <Button variant="outline" size="sm" className="text-red-600" onClick={() => deleteMember(member.id)}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Messages Tab */}
        <TabsContent value="messages">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>الرسائل الداخلية</CardTitle>
                  <CardDescription>المراسلات بين أعضاء المكتب المسير</CardDescription>
                </div>
                <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => { resetMessageForm(); setMessageDialogOpen(true); }}>
                  <Send className="w-4 h-4 mr-2" />
                  رسالة جديدة
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {executiveMessages.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>لا توجد رسائل</p>
                  </div>
                ) : (
                  executiveMessages.map((message) => (
                    <Card 
                      key={message.id} 
                      className={`cursor-pointer hover:bg-muted/50 transition-colors ${!message.read && message.receiverId === currentAdmin?.id ? 'border-emerald-500 bg-emerald-50/50' : ''}`}
                      onClick={() => openViewMessage(message)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm">
                              {(message.sender?.name?.[0] || "؟").toUpperCase()}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-medium">{message.sender?.name || "مستخدم"}</span>
                                {message.sender?.role && (
                                  <Badge className={roleColors[message.sender.role]} variant="outline">
                                    {roleLabels[message.sender.role]}
                                  </Badge>
                                )}
                                <Badge className="flex items-center gap-1">
                                  {messageTypeIcons[message.type] || <MessageSquare className="w-4 h-4" />}
                                  {messageTypeLabels[message.type] || message.type}
                                </Badge>
                              </div>
                              <h4 className="font-semibold mt-1">{message.subject}</h4>
                              <p className="text-sm text-muted-foreground line-clamp-2">{message.message}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {formatDateShort(message.createdAt, true)}
                              </p>
                            </div>
                          </div>
                          {!message.read && message.receiverId === currentAdmin?.id && (
                            <Badge className="bg-emerald-500 text-white">جديد</Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Delegations Tab */}
        <TabsContent value="delegations">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>تفويض الصلاحيات</CardTitle>
                  <CardDescription>تفويض صلاحيات الرئيس لأعضاء المكتب المسير</CardDescription>
                </div>
                {isPresident && (
                  <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => { resetDelegationForm(); setDelegationDialogOpen(true); }}>
                    <Shield className="w-4 h-4 mr-2" />
                    تفويض جديد
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {!isPresident && (
                <div className="flex items-center gap-2 p-4 bg-amber-50 border border-amber-200 rounded-lg mb-4">
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                  <p className="text-amber-700">فقط الرئيس يمكنه تفويض صلاحياته</p>
                </div>
              )}
              <div className="space-y-4">
                {delegations.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Shield className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>لا توجد تفويضات</p>
                  </div>
                ) : (
                  delegations.map((delegation) => (
                    <Card key={delegation.id} className={!delegation.active ? "opacity-50" : ""}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white text-sm">
                                <Crown className="w-5 h-5" />
                              </div>
                              <div className="mx-2 text-muted-foreground">→</div>
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white text-sm">
                                {(delegation.toUser?.name?.[0] || "؟").toUpperCase()}
                              </div>
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{delegation.fromUser?.name || "الرئيس"}</span>
                                <span className="text-muted-foreground">يفوض إلى</span>
                                <span className="font-medium">{delegation.toUser?.name || "عضو"}</span>
                                {delegation.active ? (
                                  <Badge className="bg-emerald-100 text-emerald-700">نشط</Badge>
                                ) : (
                                  <Badge className="bg-red-100 text-red-700">ملغى</Badge>
                                )}
                              </div>
                              <div className="flex flex-wrap gap-1 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  {availablePermissions.find(p => p.key === delegation.permission)?.label || delegation.permission}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                {formatDateShort(delegation.createdAt, true)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Member Dialog */}
      <Dialog open={memberDialogOpen} onOpenChange={setMemberDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] p-0 overflow-hidden gap-0 flex flex-col">
          <DialogHeader className="p-6 pb-4 border-b shrink-0">
            <DialogTitle>{editingMember ? "تعديل عضو" : "إضافة عضو جديد"}</DialogTitle>
            <DialogDescription>إضافة أو تعديل عضو في المكتب المسير</DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>اسم المستخدم *</Label>
                <Input 
                  value={memberForm.username} 
                  onChange={(e) => setMemberForm({ ...memberForm, username: e.target.value })}
                  disabled={!!editingMember}
                />
              </div>
              <div className="space-y-2">
                <Label>كلمة المرور {!editingMember && "*"}</Label>
                <Input 
                  type="password"
                  value={memberForm.password} 
                  onChange={(e) => setMemberForm({ ...memberForm, password: e.target.value })}
                  placeholder={editingMember ? "اترك فارغاً للإبقاء على الحالي" : ""}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>الاسم الكامل</Label>
                <Input value={memberForm.name} onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>البريد الإلكتروني</Label>
                <Input type="email" value={memberForm.email} onChange={(e) => setMemberForm({ ...memberForm, email: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>رقم الهاتف</Label>
                <Input value={memberForm.phone} onChange={(e) => setMemberForm({ ...memberForm, phone: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>الدور</Label>
                <select 
                  className="w-full p-2 border rounded-md"
                  value={memberForm.role}
                  onChange={(e) => setMemberForm({ ...memberForm, role: e.target.value })}
                >
                  <option value="admin">مدير</option>
                  <option value="general_secretary">الكاتب العام</option>
                  <option value="treasurer">أمين المال</option>
                  <option value="deputy">نائب</option>
                  {editingMember?.role === "president" && <option value="president">الرئيس</option>}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>المنصب (عربي)</Label>
                <Input value={memberForm.positionAr} onChange={(e) => setMemberForm({ ...memberForm, positionAr: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>المنصب (فرنسي)</Label>
                <Input value={memberForm.positionFr} onChange={(e) => setMemberForm({ ...memberForm, positionFr: e.target.value })} dir="ltr" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>الصلاحيات</Label>
              <div className="grid grid-cols-2 gap-2 p-3 border rounded-lg">
                {availablePermissions.map((perm) => (
                  <label key={perm.key} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={memberForm.permissions.includes(perm.key)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          if (perm.key === 'all') {
                            setMemberForm({ ...memberForm, permissions: ['all'] });
                          } else {
                            setMemberForm({ 
                              ...memberForm, 
                              permissions: [...memberForm.permissions.filter(p => p !== 'all'), perm.key] 
                            });
                          }
                        } else {
                          setMemberForm({ 
                            ...memberForm, 
                            permissions: memberForm.permissions.filter(p => p !== perm.key) 
                          });
                        }
                      }}
                      className="rounded"
                    />
                    <div>
                      <p className="text-sm font-medium">{perm.label}</p>
                      <p className="text-xs text-muted-foreground">{perm.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter className="p-6 pt-4 border-t bg-background shrink-0">
            <Button variant="outline" onClick={() => setMemberDialogOpen(false)}>
              <X className="w-4 h-4 mr-2" />
              إلغاء
            </Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={saveMember} disabled={isLoading}>
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
              حفظ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Message Dialog */}
      <Dialog open={messageDialogOpen} onOpenChange={setMessageDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] p-0 overflow-hidden gap-0 flex flex-col">
          <DialogHeader className="p-6 pb-4 border-b shrink-0">
            <DialogTitle>رسالة جديدة</DialogTitle>
            <DialogDescription>إرسال رسالة لأعضاء المكتب المسير</DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>المستلم</Label>
                <select 
                  className="w-full p-2 border rounded-md"
                  value={messageForm.receiverId}
                  onChange={(e) => setMessageForm({ ...messageForm, receiverId: e.target.value })}
                >
                  <option value="">الجميع</option>
                  {executiveMembers.filter(m => m.id !== currentAdmin?.id).map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.name || member.username} ({roleLabels[member.role]})
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>نوع الرسالة</Label>
                <select 
                  className="w-full p-2 border rounded-md"
                  value={messageForm.type}
                  onChange={(e) => setMessageForm({ ...messageForm, type: e.target.value })}
                >
                  <option value="message">رسالة</option>
                  <option value="news">خبر</option>
                  <option value="file">ملف</option>
                  <option value="invitation">دعوة</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>الموضوع</Label>
              <Input value={messageForm.subject} onChange={(e) => setMessageForm({ ...messageForm, subject: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>المحتوى</Label>
              <Textarea value={messageForm.contentAr} onChange={(e) => setMessageForm({ ...messageForm, contentAr: e.target.value })} rows={4} />
            </div>
          </div>
          <DialogFooter className="p-6 pt-4 border-t bg-background shrink-0">
            <Button variant="outline" onClick={() => setMessageDialogOpen(false)}>
              <X className="w-4 h-4 mr-2" />
              إلغاء
            </Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={sendMessage} disabled={isLoading}>
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
              إرسال
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delegation Dialog */}
      <Dialog open={delegationDialogOpen} onOpenChange={setDelegationDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] p-0 overflow-hidden gap-0 flex flex-col">
          <DialogHeader className="p-6 pb-4 border-b shrink-0">
            <DialogTitle>تفويض صلاحيات</DialogTitle>
            <DialogDescription>تفويض جزء من صلاحيات الرئيس لعضو آخر</DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <div className="space-y-2">
              <Label>تفويض إلى</Label>
              <select 
                className="w-full p-2 border rounded-md"
                value={delegationForm.toAdminId}
                onChange={(e) => setDelegationForm({ ...delegationForm, toAdminId: e.target.value })}
              >
                <option value="">اختر العضو</option>
                {executiveMembers.filter(m => m.id !== currentAdmin?.id && m.active).map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name || member.username} ({roleLabels[member.role]})
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>الصلاحيات المفوضة</Label>
              <div className="grid grid-cols-2 gap-2 p-3 border rounded-lg">
                {availablePermissions.filter(p => p.key !== 'all').map((perm) => (
                  <label key={perm.key} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={delegationForm.permissions.includes(perm.key)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setDelegationForm({ 
                            ...delegationForm, 
                            permissions: [...delegationForm.permissions, perm.key] 
                          });
                        } else {
                          setDelegationForm({ 
                            ...delegationForm, 
                            permissions: delegationForm.permissions.filter(p => p !== perm.key) 
                          });
                        }
                      }}
                      className="rounded"
                    />
                    <div>
                      <p className="text-sm font-medium">{perm.label}</p>
                      <p className="text-xs text-muted-foreground">{perm.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter className="p-6 pt-4 border-t bg-background shrink-0">
            <Button variant="outline" onClick={() => setDelegationDialogOpen(false)}>
              <X className="w-4 h-4 mr-2" />
              إلغاء
            </Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={createDelegation} disabled={isLoading || delegationForm.permissions.length === 0}>
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Shield className="w-4 h-4 mr-2" />}
              تفويض
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Message Dialog */}
      <Dialog open={viewMessageDialogOpen} onOpenChange={setViewMessageDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{viewingMessage?.subject}</DialogTitle>
            <DialogDescription>
              من: {viewingMessage?.sender?.name} ({viewingMessage?.sender?.role ? roleLabels[viewingMessage.sender.role] : ''}) • 
              {viewingMessage && formatDateShort(viewingMessage.createdAt, true)}
            </DialogDescription>
          </DialogHeader>
          {viewingMessage && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <Badge className="flex items-center gap-1">
                  {viewingMessage.type && messageTypeIcons[viewingMessage.type]}
                  {viewingMessage.type && messageTypeLabels[viewingMessage.type]}
                </Badge>
              </div>
              <div className="prose prose-sm max-w-none">
                <p className="text-muted-foreground whitespace-pre-wrap">{viewingMessage.message}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
