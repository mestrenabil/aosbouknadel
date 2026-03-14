"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  X, 
  Download, 
  ExternalLink, 
  ZoomIn, 
  ZoomOut, 
  RotateCw,
  FileText,
  Image as ImageIcon,
  File,
  Loader2
} from "lucide-react";

interface DocumentViewerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  documentUrl: string;
  documentTitle?: string;
  documentType?: string;
}

export default function DocumentViewer({
  open,
  onOpenChange,
  documentUrl,
  documentTitle = "معاينة المستند",
  documentType,
}: DocumentViewerProps) {
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Determine file type
  const getFileType = () => {
    if (documentType) return documentType;
    const extension = documentUrl.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '')) return 'image';
    if (extension === 'pdf') return 'pdf';
    if (['doc', 'docx'].includes(extension || '')) return 'word';
    if (['xls', 'xlsx'].includes(extension || '')) return 'excel';
    if (['ppt', 'pptx'].includes(extension || '')) return 'powerpoint';
    return 'other';
  };

  const fileType = getFileType();

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 50));
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);

  const handleDownload = () => {
    const link = window.document.createElement('a');
    link.href = documentUrl;
    link.download = documentTitle || documentUrl.split('/').pop() || 'document';
    link.target = '_blank';
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);
  };

  const handleOpenExternal = () => {
    let urlToOpen = documentUrl;

    if (fileType === 'word' || fileType === 'excel' || fileType === 'powerpoint') {
      // For Office documents, use Office Online Viewer
      const fullUrl = documentUrl.startsWith('http')
        ? documentUrl
        : window.location.origin + documentUrl;
      urlToOpen = `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(fullUrl)}`;
    } else if (fileType === 'pdf') {
      // For PDF, open with Google Docs Viewer for better compatibility
      const fullUrl = documentUrl.startsWith('http')
        ? documentUrl
        : window.location.origin + documentUrl;
      urlToOpen = `https://docs.google.com/viewer?url=${encodeURIComponent(fullUrl)}&embedded=false`;
    }

    window.open(urlToOpen, '_blank');
  };

  const renderContent = () => {
    switch (fileType) {
      case 'image':
        return (
          <div className="flex items-center justify-center w-full h-full min-h-[60vh] bg-gray-100 rounded-lg overflow-auto">
            <img
              src={documentUrl}
              alt={documentTitle}
              className="max-w-full transition-transform duration-200"
              style={{
                transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
              }}
              onLoad={() => setIsLoading(false)}
            />
          </div>
        );
      
      case 'pdf':
        return (
          <div className="w-full h-full min-h-[70vh] bg-gray-100 rounded-lg overflow-hidden">
            <iframe
              src={`${documentUrl}#toolbar=0&navpanes=0`}
              className="w-full h-full border-0"
              title={documentTitle}
              onLoad={() => setIsLoading(false)}
            />
          </div>
        );
      
      case 'word':
      case 'excel':
      case 'powerpoint':
        // For Office documents, use Google Docs Viewer or Office Online Viewer
        const viewerUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(window.location.origin + documentUrl)}`;
        return (
          <div className="w-full h-full min-h-[70vh] bg-gray-100 rounded-lg overflow-hidden">
            <iframe
              src={viewerUrl}
              className="w-full h-full border-0"
              title={documentTitle}
              onLoad={() => setIsLoading(false)}
            />
          </div>
        );
      
      default:
        return (
          <div className="flex flex-col items-center justify-center w-full h-full min-h-[60vh] bg-gray-100 rounded-lg">
            <File className="w-16 h-16 text-gray-400 mb-4" />
            <p className="text-muted-foreground mb-4">لا يمكن معاينة هذا النوع من الملفات</p>
            <p className="text-sm text-muted-foreground mb-4">
              يمكن فتح الملف في نافذة جديدة أو تحميله
            </p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleOpenExternal}>
                <ExternalLink className="w-4 h-4 mr-2" />
                فتح في نافذة جديدة
              </Button>
              <Button onClick={handleDownload}>
                <Download className="w-4 h-4 mr-2" />
                تحميل الملف
              </Button>
            </div>
          </div>
        );
    }
  };

  const canZoom = fileType === 'image';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-hidden">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="flex items-center gap-2 text-lg">
            {fileType === 'image' ? (
              <ImageIcon className="w-5 h-5 text-emerald-600" />
            ) : fileType === 'pdf' ? (
              <FileText className="w-5 h-5 text-red-600" />
            ) : (
              <File className="w-5 h-5 text-blue-600" />
            )}
            {documentTitle}
          </DialogTitle>
        </DialogHeader>

        {/* Toolbar */}
        <div className="flex items-center justify-between gap-2 pb-3 border-b">
          <div className="flex items-center gap-2">
            {canZoom && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleZoomOut}
                  disabled={zoom <= 50}
                >
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <span className="text-sm font-medium w-12 text-center">{zoom}%</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleZoomIn}
                  disabled={zoom >= 200}
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRotate}
                >
                  <RotateCw className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleOpenExternal}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              فتح في نافذة جديدة
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleDownload}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <Download className="w-4 h-4 mr-2" />
              تحميل
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="relative overflow-auto">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            </div>
          )}
          {renderContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
}
