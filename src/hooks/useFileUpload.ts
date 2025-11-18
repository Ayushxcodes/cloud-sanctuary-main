import { useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"
import { useEncryption } from "./useEncryption"

export interface FileMetadata {
  id: string
  name: string
  storage_path: string
  size: number
  mime_type: string
  is_encrypted: boolean
  created_at: string
  folder_id?: string
}

export const useFileUpload = () => {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const { encryptFile } = useEncryption()

  const uploadFile = async (
    file: File, 
    folderId?: string, 
    encrypt?: boolean, 
    passphrase?: string
  ): Promise<FileMetadata | null> => {
    setUploading(true)
    setProgress(0)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        toast.error("You must be logged in to upload files")
        return null
      }

      // Encrypt file if requested
      let fileToUpload: File | Blob = file
      let originalMimeType = file.type
      
      if (encrypt && passphrase) {
        toast.info("Encrypting file...")
        const encryptedBlob = await encryptFile(file, passphrase)
        fileToUpload = new File([encryptedBlob], file.name, { type: 'application/octet-stream' })
        setProgress(25)
      }

      // Create storage path
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const storagePath = `${user.id}/${fileName}`

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('drive-files')
        .upload(storagePath, fileToUpload, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) throw uploadError

      setProgress(encrypt ? 75 : 50)

      // Save metadata to database
      const { data: fileData, error: dbError } = await supabase
        .from('files')
        .insert({
          user_id: user.id,
          folder_id: folderId,
          name: file.name,
          storage_path: storagePath,
          size: file.size,
          mime_type: originalMimeType,
          is_encrypted: encrypt || false
        })
        .select()
        .single()

      if (dbError) throw dbError

      setProgress(100)
      toast.success(encrypt ? "File encrypted and uploaded successfully!" : "File uploaded successfully!")
      
      return fileData as FileMetadata
    } catch (error: any) {
      console.error("Upload error:", error)
      toast.error(error.message || "Failed to upload file")
      return null
    } finally {
      setUploading(false)
      setProgress(0)
    }
  }

  const getFileUrl = async (storagePath: string): Promise<string | null> => {
    try {
      const { data } = await supabase.storage
        .from('drive-files')
        .createSignedUrl(storagePath, 3600) // 1 hour expiry

      return data?.signedUrl || null
    } catch (error) {
      console.error("Error getting file URL:", error)
      return null
    }
  }

  const deleteFile = async (fileId: string, storagePath: string): Promise<boolean> => {
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('drive-files')
        .remove([storagePath])

      if (storageError) throw storageError

      // Delete from database
      const { error: dbError } = await supabase
        .from('files')
        .delete()
        .eq('id', fileId)

      if (dbError) throw dbError

      toast.success("File deleted successfully!")
      return true
    } catch (error: any) {
      console.error("Delete error:", error)
      toast.error(error.message || "Failed to delete file")
      return false
    }
  }

  return {
    uploadFile,
    getFileUrl,
    deleteFile,
    uploading,
    progress
  }
}
