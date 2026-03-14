"use client";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { 
  Upload, 
  X, 
  Image as ImageIcon, 
  FileText, 
  File, 
  Loader2,
  CheckCircle,
  AlertCircle,
  Trash2
} from "lucide-react";

interface FileUploadProps {
  value?: string;
  onChange: (url: string, fileInfo?: FileInfo) => void;
  type?: "image" | "document" | "general";
  label?: string;
  accept?: string;
  preview?: boolean;
  disabled?: boolean;
  className?: string;
}

interface FileInfo {
  fileName: string;
  fileType: string;
  mimeType: string;
  fileSize: number;
}

export default function FileUpload({
  value,
  onChange,
  type = "general",
  label,
  accept,
  preview = true,
  disabled = false,
  className = "",
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const defaultAccept = type === "image" 
    ? "image/jpeg,image/png,image/gif,image/webp"
    : type === "document"
      ? "application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,image/*"
      : "image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

  const handleUpload = useCallback(async (file: File) => {
    if (disabled) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", type);

      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 100);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "حدث خطأ أثناء رفع الملف");
      }

      onChange(data.url, {
        fileName: data.fileName,
        fileType: data.fileType,
        mimeType: data.mimeType,
        fileSize: data.fileSize,
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ أثناء رفع الملف");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [type, onChange, disabled]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (disabled) return;
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleUpload(file);
    }
  };

  const handleRemove = () => {
    onChange("", undefined);
    setError(null);
  };

  const getFileIcon = () => {
    if (!value) return <Upload className="w-8 h-8" />;
    
    const extension = value.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '')) {
      return <ImageIcon className="w-8 h-8 text-emerald-600" />;
    }
    if (extension === 'pdf') {
      return <FileText className="w-8 h-8 text-red-600" />;
    }
    return <File className="w-8 h-8 text-blue-600" />;
  };

  const isImage = value && ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(value.split('.').pop()?.toLowerCase() || '');

  return (
    <div className={`space-y-2 ${className}`}>
      {label && <Label className="flex items-center gap-2">{label}</Label>}
      
      {/* Upload Area */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-4 text-center cursor-pointer
          transition-all duration-200
          ${dragActive ? "border-emerald-500 bg-emerald-50" : "border-gray-300 hover:border-emerald-400"}
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          ${value ? "border-solid border-emerald-200 bg-emerald-50/50" : ""}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !disabled && !value && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept || defaultAccept}
          onChange={handleFileSelect}
          disabled={disabled || isUploading}
          className="hidden"
        />

        {isUploading ? (
          <div className="py-4 space-y-3">
            <Loader2 className="w-8 h-8 mx-auto animate-spin text-emerald-600" />
            <div className="space-y-1">
              <Progress value={uploadProgress} className="h-2 w-full max-w-xs mx-auto" />
              <p className="text-sm text-muted-foreground">جاري الرفع... {uploadProgress}%</p>
            </div>
          </div>
        ) : value ? (
          <div className="py-2">
            {preview && isImage ? (
              <div className="relative inline-block">
                <img 
                  src={value} 
                  alt="Uploaded file" 
                  className="max-h-32 mx-auto rounded-lg shadow-md"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute -top-2 -left-2 h-6 w-6 rounded-full p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove();
                  }}
                  disabled={disabled}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-3 py-2">
                {getFileIcon()}
                <div className="text-right">
                  <p className="text-sm font-medium text-emerald-700">تم رفع الملف</p>
                  <p className="text-xs text-muted-foreground truncate max-w-[200px]" dir="ltr">
                    {value.split('/').pop()}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove();
                  }}
                  disabled={disabled}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="py-4">
            <div className="flex justify-center mb-2">
              <div className={`p-3 rounded-full ${dragActive ? "bg-emerald-100" : "bg-gray-100"}`}>
                <Upload className={`w-6 h-6 ${dragActive ? "text-emerald-600" : "text-gray-400"}`} />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-1">
              اسحب الملف هنا أو انقر للاختيار
            </p>
            <p className="text-xs text-muted-foreground">
              {type === "image" ? "JPEG, PNG, GIF, WebP (حد أقصى 10MB)" : 
               type === "document" ? "PDF, Word, Excel, صور (حد أقصى 10MB)" :
               "جميع أنواع الملفات (حد أقصى 10MB)"}
            </p>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-2 rounded-lg">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      {/* Success Indicator */}
      {value && !isUploading && !error && (
        <div className="flex items-center gap-2 text-emerald-600 text-xs">
          <CheckCircle className="w-3 h-3" />
          تم رفع الملف بنجاح
        </div>
      )}
    </div>
  );
}
