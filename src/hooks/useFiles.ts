import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"
import { FileMetadata } from "./useFileUpload"

export const useFiles = () => {
  const [files, setFiles] = useState<FileMetadata[]>([])
  const [loading, setLoading] = useState(true)

  const fetchFiles = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('files')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      setFiles(data as FileMetadata[])
    } catch (error) {
      console.error("Error fetching files:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFiles()

    // Subscribe to realtime changes
    const channel = supabase
      .channel('files-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'files'
        },
        () => {
          fetchFiles()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return { files, loading, refetch: fetchFiles }
}
