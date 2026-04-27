"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { trpc } from "@/lib/trpc-client"
import { Loader2 } from "lucide-react"
import { DashboardNav } from "@/components/navigation/dashboard-nav"
import { UserButton } from "@clerk/nextjs"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const syncMutation = trpc.user.sync.useMutation()

  useEffect(() => {
    syncMutation.mutate()
  }, [])

  const userData = syncMutation.data
  const isEditor = pathname?.startsWith("/dashboard/editor")

  if (syncMutation.isPending) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (userData && !userData.role) {
    router.push("/onboarding")
    return null
  }

  if (isEditor) return <>{children}</>

  return (
    <div className="flex h-screen overflow-hidden bg-secondary/10">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-white flex flex-col shrink-0">
        <div className="h-16 border-b flex items-center px-6 shrink-0">
           <Link href="/" className="font-bold text-xl tracking-tighter">DesignFolio</Link>
        </div>
        <div className="flex-1 overflow-y-auto">
           <DashboardNav />
        </div>
        <div className="p-4 border-t flex items-center justify-between">
           <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-secondary border animate-pulse flex items-center justify-center text-[10px] font-bold">JD</div>
              <div className="flex flex-col">
                 <span className="text-xs font-semibold">{userData?.email?.split('@')[0] || "Designer"}</span>
                 <span className="text-[10px] text-muted-foreground capitalize">{userData?.role?.toLowerCase() || "Designer"}</span>
              </div>
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-background rounded-l-3xl shadow-2xl my-2 border-l border-t border-b">
        {children}
      </main>
    </div>
  )
}
