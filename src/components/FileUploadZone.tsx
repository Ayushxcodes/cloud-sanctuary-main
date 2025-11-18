import { useCallback, useState } from "react"
import { Upload } from "lucide-react"
import { Button } from "./ui/button"
import { cn } from "@/lib/utils"

interface FileUploadZoneProps {
  onFileSelect: (file: File) => void
  uploading: boolean
  accept?: string
}

export const FileUploadZone = ({ onFileSelect, uploading, accept }: FileUploadZoneProps) => {
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      onFileSelect(files[0])
    }
  }, [onFileSelect])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      onFileSelect(files[0])
    }
  }

  return (
    <div
      className={cn(
        "border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer",
        isDragging 
          ? "border-primary bg-primary/5 scale-105" 
          : "border-border hover:border-primary",
        uploading && "opacity-50 pointer-events-none"
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => document.getElementById('file-input')?.click()}
    >
      <input
        id="file-input"
        type="file"
        className="hidden"
        onChange={handleFileInput}
        accept={accept}
        disabled={uploading}
      />
      <Upload className={cn(
        "h-12 w-12 mx-auto mb-4 transition-colors",
        isDragging ? "text-primary" : "text-muted-foreground"
      )} />
      <p className="text-sm text-muted-foreground mb-2">
        {isDragging ? "Drop your file here" : "Drag and drop files here or click to browse"}
      </p>
      <p className="text-xs text-muted-foreground mb-4">
        Supports: Images, Documents, PDFs, and more
      </p>
      <Button variant="outline" size="sm" type="button" disabled={uploading}>
        Choose Files
      </Button>
    </div>
  )
}
