import { useNavigate, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SidebarNavItemProps {
  icon: React.ReactNode
  label: string
  href: string
  collapsed: boolean
}

export function SidebarNavItem({ icon, label, href, collapsed }: SidebarNavItemProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const isActive = location.pathname === href

  return (
    <Button
      variant={isActive ? "secondary" : "ghost"}
      className={cn(
        "w-full justify-start gap-3 hover:bg-sidebar-accent",
        collapsed && "justify-center"
      )}
      onClick={() => navigate(href)}
    >
      {icon}
      {!collapsed && <span>{label}</span>}
    </Button>
  )
}
