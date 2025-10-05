"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { TicketIcon, ClockIcon, MessageSquareIcon, ArrowRightIcon, CheckCircle2Icon } from "lucide-react"
import { Header } from "@/components/header"
import { AnimatedRobot } from "@/components/animated-robot"
import { authService } from "@/lib/auth"

export default function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)

  useEffect(() => {
    setIsAuthenticated(authService.isAuthenticated())
    const user = authService.getUser()
    setUserRole(user?.role || null)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        <section className="container mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            {/* Left Side - Text Content */}
            <div className="text-center lg:text-left">
              <div className="inline-block mb-6">
                <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium border border-primary/20">
                  Modern Support Platform
                </span>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Transform Your Support
                <br />
                <span className="gradient-text">The Smart Way</span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed">
                One powerful platform to manage tickets, track SLAs, and collaborate with your team in real-time
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-12">
                {isAuthenticated ? (
                  <>
                    <Link
                      href="/tickets"
                      className="w-full sm:w-auto px-8 py-4 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 flex items-center justify-center gap-2"
                    >
                      {userRole === 'customer' ? 'My Tickets' : 'View Tickets'}
                      <ArrowRightIcon className="w-5 h-5" />
                    </Link>
                    <Link
                      href="/tickets/new"
                      className="w-full sm:w-auto px-8 py-4 bg-secondary text-secondary-foreground rounded-lg font-semibold hover:bg-secondary/80 transition-all border border-border"
                    >
                      Create Ticket
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/register"
                      className="w-full sm:w-auto px-8 py-4 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 flex items-center justify-center gap-2"
                    >
                      Get Started
                      <ArrowRightIcon className="w-5 h-5" />
                    </Link>
                    <Link
                      href="/login"
                      className="w-full sm:w-auto px-8 py-4 bg-secondary text-secondary-foreground rounded-lg font-semibold hover:bg-secondary/80 transition-all border border-border"
                    >
                      Sign In
                    </Link>
                  </>
                )}
              </div>

              <div className="grid grid-cols-3 gap-6 max-w-md mx-auto lg:mx-0 pt-8 border-t border-border/50">
                <div className="text-center lg:text-left">
                  <div className="text-sm text-muted-foreground mb-1">Teams</div>
                  <div className="text-2xl font-bold text-foreground">500+</div>
                </div>
                <div className="text-center lg:text-left border-x border-border/50 px-3">
                  <div className="text-sm text-muted-foreground mb-1">Response</div>
                  <div className="text-2xl font-bold text-foreground">&lt;2h</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-sm text-muted-foreground mb-1">Satisfaction</div>
                  <div className="text-2xl font-bold text-foreground">98%</div>
                </div>
              </div>
            </div>

            {/* Right Side - Animated Robot */}
            <div className="flex items-center justify-center">
              <AnimatedRobot />
            </div>
          </div>
        </section>

        <section className="container mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Everything You Need</h2>
            <p className="text-lg md:text-xl text-muted-foreground">Powerful features to streamline your support operations</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <div className="glass-card rounded-2xl p-8 hover:border-primary/40 transition-all">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                <TicketIcon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-foreground">Ticket Management</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Create, assign, and track support tickets with powerful filtering and search capabilities
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2Icon className="w-4 h-4 text-primary" />
                  Priority-based routing
                </li>
                <li className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2Icon className="w-4 h-4 text-primary" />
                  Custom status workflows
                </li>
                <li className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2Icon className="w-4 h-4 text-primary" />
                  Advanced filtering
                </li>
              </ul>
            </div>

            <div className="glass-card rounded-2xl p-8 hover:border-primary/40 transition-all">
              <div className="w-14 h-14 bg-success/10 rounded-xl flex items-center justify-center mb-6">
                <ClockIcon className="w-7 h-7 text-success" />
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-foreground">SLA Tracking</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Monitor response and resolution times automatically with real-time breach detection
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2Icon className="w-4 h-4 text-success" />
                  Automatic breach alerts
                </li>
                <li className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2Icon className="w-4 h-4 text-success" />
                  Custom SLA rules
                </li>
                <li className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2Icon className="w-4 h-4 text-success" />
                  Performance metrics
                </li>
              </ul>
            </div>

            <div className="glass-card rounded-2xl p-8 hover:border-primary/40 transition-all">
              <div className="w-14 h-14 bg-warning/10 rounded-xl flex items-center justify-center mb-6">
                <MessageSquareIcon className="w-7 h-7 text-warning" />
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-foreground">Team Collaboration</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Communicate seamlessly with team members and customers through internal notes
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2Icon className="w-4 h-4 text-warning" />
                  Internal comments
                </li>
                <li className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2Icon className="w-4 h-4 text-warning" />
                  Real-time updates
                </li>
                <li className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2Icon className="w-4 h-4 text-warning" />
                  Activity tracking
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-6 py-20">
          <div className="glass-card rounded-3xl p-8 md:p-12 text-center max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              {isAuthenticated ? 'Need Help?' : 'Ready to Get Started?'}
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              {isAuthenticated 
                ? 'Create a support ticket and our team will assist you promptly'
                : 'Join hundreds of teams already using HelpDesk Mini to deliver exceptional support'
              }
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {isAuthenticated ? (
                <>
                  <Link
                    href="/tickets/new"
                    className="w-full sm:w-auto px-8 py-4 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/25"
                  >
                    Create Ticket
                  </Link>
                  <Link
                    href="/tickets"
                    className="w-full sm:w-auto px-8 py-4 bg-secondary text-secondary-foreground rounded-lg font-semibold hover:bg-secondary/80 transition-all border border-border"
                  >
                    {userRole === 'customer' ? 'My Tickets' : 'View All Tickets'}
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/register"
                    className="w-full sm:w-auto px-8 py-4 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/25"
                  >
                    Start Free Trial
                  </Link>
                  <Link
                    href="/login"
                    className="w-full sm:w-auto px-8 py-4 bg-secondary text-secondary-foreground rounded-lg font-semibold hover:bg-secondary/80 transition-all border border-border"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/50 py-8">
        <div className="container mx-auto px-6 text-center text-muted-foreground text-sm">
          <p>© 2025 HelpDesk Mini. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}