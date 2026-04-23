"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  LayoutDashboard, 
  PenTool, 
  Briefcase, 
  MessageSquare, 
  Settings, 
  CreditCard,
  FileText
} from "lucide-react"

const NAV_ITEMS = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Editor", href: "/dashboard/editor", icon: PenTool },
  { name: "Projects", href: "/dashboard/projects", icon: Briefcase },
  { name: "Inbox", href: "/dashboard/inbox", icon: MessageSquare },
  { name: "Contracts", href: "/dashboard/contracts", icon: FileText },
  { name: "Earnings", href: "/dashboard/earnings", icon: CreditCard },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col gap-1 px-4 py-4">
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all",
              isActive 
                ? "bg-primary text-primary-foreground shadow-md" 
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.name}
          </Link>
        )
      })}
    </nav>
  )
}
