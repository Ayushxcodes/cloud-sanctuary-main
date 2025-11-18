import { useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"

export const useFileShare = () => {
  const [generating, setGenerating] = useState(false)

  const generateShareLink = async (
    fileId: string, 
    expiresInHours: number = 24
  ): Promise<string | null> => {
    setGenerating(true)
    try {
      // Generate unique token
      const shareToken = crypto.randomUUID()
      
      // Calculate expiry
      const expiresAt = new Date()
      expiresAt.setHours(expiresAt.getHours() + expiresInHours)

      // Save to database
      const { error } = await supabase
        .from('file_shares')
        .insert({
          file_id: fileId,
          share_token: shareToken,
          expires_at: expiresAt.toISOString()
        })

      if (error) throw error

      // Generate share URL
      const shareUrl = `${window.location.origin}/share/${shareToken}`
      
      toast.success("Share link generated!")
      return shareUrl
    } catch (error: any) {
      console.error("Generate share link error:", error)
      toast.error(error.message || "Failed to generate share link")
      return null
    } finally {
      setGenerating(false)
    }
  }

  const revokeShareLink = async (shareToken: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('file_shares')
        .delete()
        .eq('share_token', shareToken)

      if (error) throw error

      toast.success("Share link revoked!")
      return true
    } catch (error: any) {
      console.error("Revoke share link error:", error)
      toast.error(error.message || "Failed to revoke share link")
      return false
    }
  }

  return { generateShareLink, revokeShareLink, generating }
}
