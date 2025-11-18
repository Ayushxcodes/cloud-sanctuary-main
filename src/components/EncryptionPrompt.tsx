import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Alert, AlertDescription } from "./ui/alert"
import { Lock, AlertTriangle } from "lucide-react"

interface EncryptionPromptProps {
  open: boolean
  onClose: () => void
  fileName: string
  onConfirm: (encrypt: boolean, passphrase?: string) => void
}

export const EncryptionPrompt = ({ open, onClose, fileName, onConfirm }: EncryptionPromptProps) => {
  const [wantsEncryption, setWantsEncryption] = useState<boolean | null>(null)
  const [passphrase, setPassphrase] = useState("")
  const [confirmPassphrase, setConfirmPassphrase] = useState("")

  const handleConfirm = () => {
    if (wantsEncryption === null) return

    if (wantsEncryption) {
      if (!passphrase || passphrase !== confirmPassphrase) {
        return
      }
      onConfirm(true, passphrase)
    } else {
      onConfirm(false)
    }

    // Reset state
    setWantsEncryption(null)
    setPassphrase("")
    setConfirmPassphrase("")
  }

  const isValid = () => {
    if (wantsEncryption === null) return false
    if (!wantsEncryption) return true
    return passphrase.length >= 6 && passphrase === confirmPassphrase
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Encrypt This File?
          </DialogTitle>
          <DialogDescription>
            Choose whether to encrypt "{fileName}" before uploading
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Encrypted files require a passphrase to access. Make sure to remember it!
            </AlertDescription>
          </Alert>

          {wantsEncryption === null && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Does this file contain sensitive information?
              </p>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setWantsEncryption(false)}
                >
                  No, upload normally
                </Button>
                <Button 
                  className="flex-1 bg-gradient-hero hover:opacity-90"
                  onClick={() => setWantsEncryption(true)}
                >
                  Yes, encrypt it
                </Button>
              </div>
            </div>
          )}

          {wantsEncryption === true && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="passphrase">Encryption Passphrase</Label>
                <Input
                  id="passphrase"
                  type="password"
                  placeholder="Enter a strong passphrase"
                  value={passphrase}
                  onChange={(e) => setPassphrase(e.target.value)}
                  minLength={6}
                />
                <p className="text-xs text-muted-foreground">
                  Minimum 6 characters
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-passphrase">Confirm Passphrase</Label>
                <Input
                  id="confirm-passphrase"
                  type="password"
                  placeholder="Enter passphrase again"
                  value={confirmPassphrase}
                  onChange={(e) => setConfirmPassphrase(e.target.value)}
                />
                {confirmPassphrase && passphrase !== confirmPassphrase && (
                  <p className="text-xs text-destructive">
                    Passphrases do not match
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          {wantsEncryption !== null && (
            <Button 
              variant="outline" 
              onClick={() => {
                setWantsEncryption(null)
                setPassphrase("")
                setConfirmPassphrase("")
              }}
            >
              Back
            </Button>
          )}
          <Button 
            onClick={handleConfirm}
            disabled={!isValid()}
            className="bg-gradient-hero hover:opacity-90"
          >
            {wantsEncryption ? "Encrypt & Upload" : "Upload"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
