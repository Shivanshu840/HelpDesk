"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { api } from "@/lib/api"
import { authService } from "@/lib/auth"
import { ArrowLeftIcon } from "lucide-react"
import Link from "next/link"

export default function NewTicketPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userRole, setUserRole] = useState<string | null>(null)

  const [formData, setFormData] = useState<{
    title: string
    description: string
    priority: "low" | "medium" | "high" | "critical"
    customer_email: string
  }>({
    title: "",
    description: "",
    priority: "medium",
    customer_email: "",
  })

  useEffect(() => {
    const user = authService.getUser()
    setUserRole(user?.role || null)
    
    // Auto-fill customer email for customers
    if (user?.role === 'customer') {
      setFormData(prev => ({ ...prev, customer_email: user.email }))
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await api.tickets.create(formData)
      router.push("/tickets")
    } catch (err) {
      setError("Failed to create ticket. Please try again.")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <Link
          href="/tickets"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Back to Tickets
        </Link>

        <div className="max-w-2xl">
          <h1 className="text-3xl font-bold text-foreground mb-2">Create New Ticket</h1>
          <p className="text-muted-foreground mb-8">Submit a new support request</p>

          <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg p-6 space-y-6">
            {error && (
              <div className="bg-destructive/10 border border-destructive text-destructive rounded-lg p-4">{error}</div>
            )}

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-foreground mb-2">
                Title *
              </label>
              <input
                type="text"
                id="title"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 bg-background border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Brief description of the issue"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-foreground mb-2">
                Description *
              </label>
              <textarea
                id="description"
                required
                rows={6}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 bg-background border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                placeholder="Provide detailed information about the issue"
              />
            </div>

            <div>
              <label htmlFor="customer_email" className="block text-sm font-medium text-foreground mb-2">
                Email *
              </label>
              <input
                type="email"
                id="customer_email"
                required
                value={formData.customer_email}
                onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                disabled={userRole === 'customer'}
                className="w-full px-3 py-2 bg-background border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="your.email@example.com"
              />
              {userRole === 'customer' && (
                <p className="text-xs text-muted-foreground mt-1">Email is auto-filled from your account</p>
              )}
            </div>

            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-foreground mb-2">
                Priority *
              </label>
              <select
                id="priority"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as "low" | "medium" | "high" | "critical" })}
                className="w-full px-3 py-2 bg-background border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? "Creating..." : "Create Ticket"}
              </button>
              <Link
                href="/tickets"
                className="px-4 py-2 bg-muted text-foreground rounded-lg font-medium hover:bg-muted/80 transition-colors"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
