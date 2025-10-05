"use client"

import type React from "react"

import { useState, useEffect } from "react"
import useSWR from "swr"
import { Header } from "@/components/header"
import { SLACard } from "@/components/sla-card"
import { SLAMetrics } from "@/components/sla-metrics"
import { api, type SLA } from "@/lib/api"
import { authService } from "@/lib/auth"
import { canManageSLA } from "@/lib/rbac"
import { Loader2Icon, PlusIcon } from "lucide-react"

const fetcher = () => api.sla.list()

export default function SLAPage() {
  const { data: slaRules, error, isLoading, mutate } = useSWR<SLA[]>("/sla", fetcher)
  const [showForm, setShowForm] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)

  useEffect(() => {
    const user = authService.getUser()
    setUserRole(user?.role || null)
  }, [])

  const slaArray = Array.isArray(slaRules) ? slaRules : []
  const canManage = canManageSLA(userRole as any)

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 md:px-6 py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">SLA Management</h1>
            <p className="text-muted-foreground text-base md:text-lg">Configure service level agreements and track performance</p>
          </div>
          
          {/* Only admins can add SLA rules */}
          {canManage && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity w-full md:w-auto justify-center shadow-lg shadow-primary/25"
            >
              <PlusIcon className="w-5 h-5" />
              {showForm ? "Cancel" : "Add SLA Rule"}
            </button>
          )}
        </div>

        <SLAMetrics />

        {showForm && (
          <div className="bg-card border border-border rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Create New SLA Rule</h3>
            <SLAForm
              onSuccess={() => {
                setShowForm(false)
                mutate()
              }}
            />
          </div>
        )}

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2Icon className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}

        {error && (
          <div className="bg-destructive/10 border border-destructive text-destructive rounded-lg p-4 text-center">
            Failed to load SLA rules. Please try again later.
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {slaArray.map((sla) => (
            <SLACard key={sla.id} sla={sla} onUpdate={mutate} />
          ))}
        </div>

        {!isLoading && slaArray.length === 0 && (
          <div className="bg-muted rounded-lg p-12 text-center">
            <p className="text-muted-foreground text-lg">No SLA rules configured</p>
            <p className="text-muted-foreground text-sm mt-2">
              Create your first SLA rule to start tracking performance
            </p>
          </div>
        )}
      </main>
    </div>
  )
}

function SLAForm({ onSuccess }: { onSuccess: () => void }) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    priority: "medium",
    response_time_hours: 8,
    resolution_time_hours: 48,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Get auth token
      const token = localStorage.getItem("access_token")
      
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"}/sla/`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
        body: JSON.stringify(formData),
      })
      onSuccess()
    } catch (error) {
      console.error("Failed to create SLA rule:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Priority</label>
          <select
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            className="w-full px-3 py-2 bg-background border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Response Time (hours)</label>
          <input
            type="number"
            min="1"
            value={formData.response_time_hours}
            onChange={(e) => setFormData({ ...formData, response_time_hours: Number.parseInt(e.target.value) })}
            className="w-full px-3 py-2 bg-background border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Resolution Time (hours)</label>
          <input
            type="number"
            min="1"
            value={formData.resolution_time_hours}
            onChange={(e) => setFormData({ ...formData, resolution_time_hours: Number.parseInt(e.target.value) })}
            className="w-full px-3 py-2 bg-background border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {loading ? "Creating..." : "Create SLA Rule"}
      </button>
    </form>
  )
}
