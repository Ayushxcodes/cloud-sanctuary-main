import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"
import { 
  Folder as FolderIcon, 
  File, 
  Lock, 
  Download, 
  Share2, 
  Search, 
  Eye, 
  Trash2, 
  FileText, 
  FileImage,
  FolderOpen
} from "lucide-react"
import { useFiles } from "@/hooks/useFiles"
import { useFolders } from "@/hooks/useFolders"
import { useFileUpload } from "@/hooks/useFileUpload"
import { useFileShare } from "@/hooks/useFileShare"
import { useEncryption } from "@/hooks/useEncryption"
import { FilePreview } from "@/components/FilePreview"
import { FileUploadZone } from "@/components/FileUploadZone"
import { FolderDialog } from "@/components/FolderDialog"
import { EncryptionPrompt } from "@/components/EncryptionPrompt"
import { ShareDialog } from "@/components/ShareDialog"
import { formatBytes } from "@/lib/utils"

const MiniDrive = () => {
  const { files, loading: filesLoading } = useFiles()
  const { folders, currentFolder, setCurrentFolder, createFolder, deleteFolder } = useFolders()
  const { uploadFile, getFileUrl, deleteFile, uploading, progress } = useFileUpload()
  const { generateShareLink } = useFileShare()
  const { decryptFile } = useEncryption()
  
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  const [previewFile, setPreviewFile] = useState<{ name: string; url: string | null; mimeType: string } | null>(null)
  const [showFolderDialog, setShowFolderDialog] = useState(false)
  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const [showEncryptionPrompt, setShowEncryptionPrompt] = useState(false)
  const [shareFile, setShareFile] = useState<{ id: string; name: string } | null>(null)

  const handleFileSelect = (file: File) => {
    setPendingFile(file)
    setShowEncryptionPrompt(true)
  }

  const handleEncryptionConfirm = async (encrypt: boolean, passphrase?: string) => {
    setShowEncryptionPrompt(false)
    
    if (pendingFile) {
      const result = await uploadFile(pendingFile, currentFolder || undefined, encrypt, passphrase)
      if (result) {
        toast.success(`${pendingFile.name} uploaded successfully!`)
      }
      setPendingFile(null)
    }
  }

  const handlePreview = async (file: any) => {
    if (file.is_encrypted) {
      const passphrase = prompt("Enter passphrase to decrypt and view file:")
      if (!passphrase) return

      try {
        const url = await getFileUrl(file.storage_path)
        if (!url) return

        const response = await fetch(url)
        const encryptedBlob = await response.blob()
        const decryptedBlob = await decryptFile(encryptedBlob, passphrase, file.mime_type)
        const decryptedUrl = URL.createObjectURL(decryptedBlob)

        setPreviewFile({
          name: file.name,
          url: decryptedUrl,
          mimeType: file.mime_type
        })
      } catch (error) {
        console.error("Preview error:", error)
      }
    } else {
      const url = await getFileUrl(file.storage_path)
      setPreviewFile({
        name: file.name,
        url,
        mimeType: file.mime_type
      })
    }
  }

  const handleDownload = async (file: any) => {
    if (file.is_encrypted) {
      const passphrase = prompt("Enter passphrase to decrypt and download file:")
      if (!passphrase) return

      try {
        const url = await getFileUrl(file.storage_path)
        if (!url) return

        const response = await fetch(url)
        const encryptedBlob = await response.blob()
        const decryptedBlob = await decryptFile(encryptedBlob, passphrase, file.mime_type)
        const decryptedUrl = URL.createObjectURL(decryptedBlob)

        const link = document.createElement('a')
        link.href = decryptedUrl
        link.download = file.name
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(decryptedUrl)
      } catch (error) {
        console.error("Download error:", error)
      }
    } else {
      const url = await getFileUrl(file.storage_path)
      if (url) {
        const link = document.createElement('a')
        link.href = url
        link.download = file.name
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    }
  }

  const handleDelete = async (fileId: string, storagePath: string) => {
    if (confirm("Are you sure you want to delete this file?")) {
      await deleteFile(fileId, storagePath)
    }
  }

  const handleShare = (file: any) => {
    if (file.is_encrypted) {
      toast.error("Encrypted files cannot be shared")
      return
    }
    setShareFile({ id: file.id, name: file.name })
  }

  const handleGenerateShareLink = async (expiresInHours: number) => {
    if (!shareFile) return null
    return await generateShareLink(shareFile.id, expiresInHours)
  }

  const handleDeleteFolder = async (folderId: string) => {
    if (confirm("Delete this folder? Files inside will not be deleted.")) {
      await deleteFolder(folderId)
    }
  }

  const filteredFiles = files.filter(file => {
    const matchesFolder = currentFolder ? file.folder_id === currentFolder : !file.folder_id
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase())
    
    if (!matchesFolder || !matchesSearch) return false
    
    if (filterType === "all") return true
    if (filterType === "images") return file.mime_type.startsWith('image/')
    if (filterType === "documents") {
      return file.mime_type.includes('pdf') ||
             file.mime_type.includes('document') ||
             file.mime_type.includes('word') ||
             file.mime_type.includes('text')
    }
    return true
  })

  const currentFolderData = folders.find(f => f.id === currentFolder)
  const subFolders = folders.filter(f => f.parent_id === currentFolder)

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return <FileImage className="h-4 w-4" />
    if (mimeType.includes('pdf') || mimeType.includes('document')) return <FileText className="h-4 w-4" />
    return <File className="h-4 w-4" />
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">Mini-Drive</h2>
          <p className="text-muted-foreground">Secure file storage with encryption</p>
        </div>
        <Button 
          className="bg-gradient-hero hover:opacity-90"
          onClick={() => setShowFolderDialog(true)}
        >
          <FolderIcon className="mr-2 h-4 w-4" />
          New Folder
        </Button>
      </div>

      {currentFolder && (
        <div className="flex items-center gap-2 text-sm">
          <Button variant="ghost" size="sm" onClick={() => setCurrentFolder(null)}>
            Home
          </Button>
          <span className="text-muted-foreground">/</span>
          <span className="font-medium">{currentFolderData?.name}</span>
        </div>
      )}

      <Card className="border-border">
        <CardHeader>
          <CardTitle>Upload Files</CardTitle>
          <CardDescription>
            Drag and drop or click to upload. You'll be asked about encryption.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FileUploadZone onFileSelect={handleFileSelect} uploading={uploading} />
          {uploading && (
            <div className="space-y-2">
              <Progress value={progress} />
              <p className="text-sm text-muted-foreground text-center">Uploading... {progress}%</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-4 flex-wrap">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search files..." 
            className="pl-10" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant={filterType === "all" ? "default" : "outline"} onClick={() => setFilterType("all")}>
          All Files
        </Button>
        <Button variant={filterType === "images" ? "default" : "outline"} onClick={() => setFilterType("images")}>
          Images
        </Button>
        <Button variant={filterType === "documents" ? "default" : "outline"} onClick={() => setFilterType("documents")}>
          Documents
        </Button>
      </div>

      {subFolders.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Folders</h3>
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
            {subFolders.map((folder) => (
              <Card 
                key={folder.id} 
                className="border-border hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setCurrentFolder(folder.id)}
              >
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FolderOpen className="h-8 w-8 text-primary" />
                      <h4 className="font-semibold">{folder.name}</h4>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteFolder(folder.id)
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        <h3 className="text-xl font-bold">
          {currentFolder ? `Files in ${currentFolderData?.name}` : 'Your Files'} ({filteredFiles.length})
        </h3>
        {filesLoading ? (
          <Card className="border-border">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">Loading files...</p>
            </CardContent>
          </Card>
        ) : filteredFiles.length === 0 ? (
          <Card className="border-border">
            <CardContent className="py-12 text-center">
              <File className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                {files.length === 0 ? "No files yet. Upload your first file above!" : "No files match your search."}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFiles.map((file) => (
              <Card key={file.id} className="border-border hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      {getFileIcon(file.mime_type)}
                    </div>
                    {file.is_encrypted && (
                      <Badge variant="secondary" className="bg-gradient-hero text-white">
                        <Lock className="h-3 w-3 mr-1" />
                        Encrypted
                      </Badge>
                    )}
                  </div>
                  <h4 className="font-semibold mb-2 truncate" title={file.name}>
                    {file.name}
                  </h4>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                    <Badge variant="outline">
                      {file.mime_type.split('/')[1]?.toUpperCase() || 'FILE'}
                    </Badge>
                    <span>{formatBytes(file.size)}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => handlePreview(file)}>
                      <Eye className="h-4 w-4 mr-1" />
                      Preview
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDownload(file)}>
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleShare(file)}>
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(file.id, file.storage_path)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <FolderDialog
        open={showFolderDialog}
        onClose={() => setShowFolderDialog(false)}
        onCreateFolder={createFolder}
      />

      {pendingFile && (
        <EncryptionPrompt
          open={showEncryptionPrompt}
          onClose={() => {
            setShowEncryptionPrompt(false)
            setPendingFile(null)
          }}
          fileName={pendingFile.name}
          onConfirm={handleEncryptionConfirm}
        />
      )}

      {shareFile && (
        <ShareDialog
          open={!!shareFile}
          onClose={() => setShareFile(null)}
          fileName={shareFile.name}
          onGenerateLink={handleGenerateShareLink}
        />
      )}

      {previewFile && (
        <FilePreview
          open={!!previewFile}
          onClose={() => setPreviewFile(null)}
          fileName={previewFile.name}
          fileUrl={previewFile.url}
          mimeType={previewFile.mimeType}
        />
      )}
    </div>
  )
}

export default MiniDrive
