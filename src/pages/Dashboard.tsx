import { useEffect, useState } from "react"
import { useNavigate, Routes, Route } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { User, Session } from "@supabase/supabase-js"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ThemeToggle } from "@/components/ThemeToggle"
import { SidebarNavItem } from "@/components/SidebarNavItem"
import { toast } from "sonner"
import { 
  Server, 
  Database, 
  Settings, 
  LogOut,
  Menu,
  X
} from "lucide-react"
import { cn } from "@/lib/utils"
import MiniVercel from "./dashboard/MiniVercel"
import MiniDrive from "./dashboard/MiniDrive"
import DashboardSettings from "./dashboard/Settings"
import DashboardHome from "./dashboard/Home"

const Dashboard = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)

      if (!session) {
        navigate("/auth")
      }
    })

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)

      if (!session) {
        navigate("/auth")
      }
    })

    return () => subscription.unsubscribe()
  }, [navigate])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    toast.success("Logged out successfully")
    navigate("/")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-hero animate-pulse mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside
        className={cn(
          "border-r border-border bg-sidebar-background text-sidebar-foreground transition-all duration-300 flex flex-col",
          sidebarOpen ? "w-64" : "w-16"
        )}
      >
        <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-hero flex items-center justify-center">
                <Server className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg">The Nest</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hover:bg-sidebar-accent"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <SidebarNavItem 
            icon={<Database className="h-5 w-5" />} 
            label="Dashboard" 
            href="/dashboard"
            collapsed={!sidebarOpen}
          />
          <SidebarNavItem 
            icon={<Server className="h-5 w-5" />} 
            label="Mini-Vercel" 
            href="/dashboard/vercel"
            collapsed={!sidebarOpen}
          />
          <SidebarNavItem 
            icon={<Database className="h-5 w-5" />} 
            label="Mini-Drive" 
            href="/dashboard/drive"
            collapsed={!sidebarOpen}
          />
          <SidebarNavItem 
            icon={<Settings className="h-5 w-5" />} 
            label="Settings" 
            href="/dashboard/settings"
            collapsed={!sidebarOpen}
          />
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          {sidebarOpen ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback className="bg-gradient-hero text-white">
                    {user.email?.[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user.email}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="hover:bg-sidebar-accent"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <Avatar className="mx-auto">
                <AvatarFallback className="bg-gradient-hero text-white">
                  {user.email?.[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="hover:bg-sidebar-accent mx-auto"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="border-b border-border bg-card/50 backdrop-blur-sm">
          <div className="px-6 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <ThemeToggle />
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6">
          <Routes>
            <Route path="/" element={<DashboardHome />} />
            <Route path="/vercel" element={<MiniVercel />} />
            <Route path="/drive" element={<MiniDrive />} />
            <Route path="/settings" element={<DashboardSettings />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default Dashboard
