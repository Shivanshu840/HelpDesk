"use client"

import { useState } from "react"
import type { SLA } from "@/lib/api"
import { ClockIcon, CheckCircleIcon, AlertCircleIcon } from "lucide-react"

interface SLACardProps {
  sla: SLA
  onUpdate: () => void
}

export function SLACard({ sla }: SLACardProps) {
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    response_time_hours: sla.response_time_hours,
    resolution_time_hours: sla.resolution_time_hours,
  })

  const handleUpdate = async () => {
    setLoading(true)
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"}/sla/${sla.id}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      setEditing(false)
      window.location.reload()
    } catch (error) {
      console.error("Failed to update SLA:", error)
    } finally {
      setLoading(false)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      case "high":
        return "bg-orange-500/10 text-orange-500 border-orange-500/20"
      case "medium":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "low":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      default:
        return "bg-muted text-muted-foreground border-border"
    }
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(sla.priority)}`}>
          {sla.priority.toUpperCase()}
        </span>
        {!editing && (
          <button onClick={() => setEditing(true)} className="text-sm text-primary hover:underline">
            Edit
          </button>
        )}
      </div>

      {editing ? (
        <div className="space-y-4">
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

          <div className="flex gap-3">
            <button
              onClick={handleUpdate}
              disabled={loading}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save"}
            </button>
            <button
              onClick={() => {
                setEditing(false)
                setFormData({
                  response_time_hours: sla.response_time_hours,
                  resolution_time_hours: sla.resolution_time_hours,
                })
              }}
              className="px-4 py-2 bg-muted text-foreground rounded-lg font-medium hover:bg-muted/80 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <ClockIcon className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Response Time</p>
              <p className="text-2xl font-bold text-foreground">{sla.response_time_hours}h</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <CheckCircleIcon className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Resolution Time</p>
              <p className="text-2xl font-bold text-foreground">{sla.resolution_time_hours}h</p>
            </div>
          </div>

          <div className="pt-4 border-t border-border">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <AlertCircleIcon className="w-4 h-4" />
              <span>Tickets exceeding these times will be marked as breached</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
