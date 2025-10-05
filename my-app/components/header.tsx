"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { TicketIcon, LogOutIcon, UserIcon, ShieldIcon } from "lucide-react"
import { authService } from "@/lib/auth"
import { useEffect, useState } from "react"
import { canManageSLA, isAdmin } from "@/lib/rbac"

export function Header() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    setIsAuthenticated(authService.isAuthenticated())
    setUser(authService.getUser())
  }, [])
  
  const userRole = user?.role || null

  const handleLogout = async () => {
    await authService.logout()
    router.push("/login")
  }

  return (
    <header className="border-b border-white/5 backdrop-blur-md bg-[#1a0b2e]/80 sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-all">
              <TicketIcon className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">
              HelpDesk<span className="text-primary">Mini</span>
            </span>
          </Link>

          <nav className="flex items-center gap-8">
            <Link href="/tickets" className="text-white/70 hover:text-white transition-colors font-medium text-[15px]">
              Tickets
            </Link>
            
            {/* SLA - Only show to Admin and Agent */}
            {isAuthenticated && (userRole === 'admin' || userRole === 'agent') && (
              <Link href="/sla" className="text-white/70 hover:text-white transition-colors font-medium text-[15px]">
                SLA
              </Link>
            )}

            {isAuthenticated ? (
              <div className="flex items-center gap-4 ml-4">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg border border-white/10">
                  <UserIcon className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-white capitalize">
                    {user?.username}
                    {userRole && (
                      <span className="ml-2 text-xs px-2 py-0.5 bg-primary/20 text-primary rounded">
                        {userRole}
                      </span>
                    )}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 bg-white/5 text-white rounded-lg font-medium hover:bg-white/10 transition-all border border-white/10"
                >
                  <LogOutIcon className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4 ml-4">
                <Link
                  href="/login"
                  className="text-white/90 hover:text-white transition-colors font-medium text-[15px]"
                >
                  login
                </Link>
                <Link
                  href="/register"
                  className="px-6 py-2.5 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/30 hover:shadow-primary/50"
                >
                  Signup
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
