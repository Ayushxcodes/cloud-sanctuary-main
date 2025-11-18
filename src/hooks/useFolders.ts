import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"

export interface Folder {
  id: string
  name: string
  parent_id: string | null
  path: string
  created_at: string
}

export const useFolders = () => {
  const [folders, setFolders] = useState<Folder[]>([])
  const [loading, setLoading] = useState(true)
  const [currentFolder, setCurrentFolder] = useState<string | null>(null)

  const fetchFolders = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('folders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      setFolders(data as Folder[])
    } catch (error) {
      console.error("Error fetching folders:", error)
    } finally {
      setLoading(false)
    }
  }

  const createFolder = async (name: string, parentId?: string): Promise<boolean> => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        toast.error("You must be logged in")
        return false
      }

      // Build path
      let path = `/${name}`
      if (parentId) {
        const parent = folders.find(f => f.id === parentId)
        if (parent) {
          path = `${parent.path}/${name}`
        }
      }

      const { error } = await supabase
        .from('folders')
        .insert({
          user_id: user.id,
          name,
          parent_id: parentId || null,
          path
        })

      if (error) throw error

      toast.success("Folder created successfully!")
      fetchFolders()
      return true
    } catch (error: any) {
      console.error("Create folder error:", error)
      toast.error(error.message || "Failed to create folder")
      return false
    }
  }

  const deleteFolder = async (folderId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('folders')
        .delete()
        .eq('id', folderId)

      if (error) throw error

      toast.success("Folder deleted successfully!")
      fetchFolders()
      return true
    } catch (error: any) {
      console.error("Delete folder error:", error)
      toast.error(error.message || "Failed to delete folder")
      return false
    }
  }

  useEffect(() => {
    fetchFolders()

    // Subscribe to realtime changes
    const channel = supabase
      .channel('folders-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'folders'
        },
        () => {
          fetchFolders()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return { 
    folders, 
    loading, 
    currentFolder, 
    setCurrentFolder,
    createFolder, 
    deleteFolder,
    refetch: fetchFolders 
  }
}
