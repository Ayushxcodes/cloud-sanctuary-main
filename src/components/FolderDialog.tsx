import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Folder } from "lucide-react"

interface FolderDialogProps {
  open: boolean
  onClose: () => void
  onCreateFolder: (name: string) => Promise<boolean>
}

export const FolderDialog = ({ open, onClose, onCreateFolder }: FolderDialogProps) => {
  const [folderName, setFolderName] = useState("")
  const [creating, setCreating] = useState(false)

  const handleCreate = async () => {
    if (!folderName.trim()) return

    setCreating(true)
    const success = await onCreateFolder(folderName.trim())
    setCreating(false)

    if (success) {
      setFolderName("")
      onClose()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Folder className="h-5 w-5" />
            Create New Folder
          </DialogTitle>
          <DialogDescription>
            Enter a name for your new folder
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="folder-name">Folder Name</Label>
            <Input
              id="folder-name"
              placeholder="e.g., Documents, Photos"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              disabled={creating}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={creating}>
            Cancel
          </Button>
          <Button 
            onClick={handleCreate} 
            disabled={!folderName.trim() || creating}
            className="bg-gradient-hero hover:opacity-90"
          >
            {creating ? "Creating..." : "Create Folder"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
