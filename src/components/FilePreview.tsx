import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Download, X } from "lucide-react"
import { useState, useEffect } from "react"
import { Skeleton } from "@/components/ui/skeleton"

interface FilePreviewProps {
  open: boolean
  onClose: () => void
  fileName: string
  fileUrl: string | null
  mimeType: string
}

export const FilePreview = ({ open, onClose, fileName, fileUrl, mimeType }: FilePreviewProps) => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (open) {
      setLoading(true)
    }
  }, [open, fileUrl])

  const handleDownload = () => {
    if (fileUrl) {
      const link = document.createElement('a')
      link.href = fileUrl
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const renderPreview = () => {
    if (!fileUrl) {
      return (
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">Loading preview...</p>
        </div>
      )
    }

    // Image preview
    if (mimeType.startsWith('image/')) {
      return (
        <div className="relative">
          {loading && <Skeleton className="w-full h-96" />}
          <img
            src={fileUrl}
            alt={fileName}
            className={`max-w-full max-h-[600px] mx-auto object-contain ${loading ? 'hidden' : ''}`}
            onLoad={() => setLoading(false)}
            onError={() => setLoading(false)}
          />
        </div>
      )
    }

    // PDF preview
    if (mimeType === 'application/pdf') {
      return (
        <iframe
          src={fileUrl}
          className="w-full h-[600px] border-0"
          title={fileName}
          onLoad={() => setLoading(false)}
        />
      )
    }

    // Word document preview - use Google Docs Viewer
    if (
      mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      mimeType === 'application/msword' ||
      mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      mimeType === 'application/vnd.ms-excel' ||
      mimeType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' ||
      mimeType === 'application/vnd.ms-powerpoint'
    ) {
      return (
        <iframe
          src={`https://docs.google.com/viewer?url=${encodeURIComponent(fileUrl)}&embedded=true`}
          className="w-full h-[600px] border-0"
          title={fileName}
          onLoad={() => setLoading(false)}
        />
      )
    }

    // Text preview
    if (mimeType.startsWith('text/')) {
      return (
        <iframe
          src={fileUrl}
          className="w-full h-[600px] border-0 bg-background"
          title={fileName}
          onLoad={() => setLoading(false)}
        />
      )
    }

    // Default: no preview available
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <p className="text-muted-foreground">Preview not available for this file type</p>
        <Button onClick={handleDownload}>
          <Download className="mr-2 h-4 w-4" />
          Download File
        </Button>
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="truncate max-w-md">{fileName}</DialogTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={handleDownload}>
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>
        <div className="overflow-auto">
          {renderPreview()}
        </div>
      </DialogContent>
    </Dialog>
  )
}
