"use client"

import useSWR from "swr"
import { api } from "@/lib/api"
import { TicketIcon, ClockIcon, CheckCircleIcon, AlertTriangleIcon } from "lucide-react"

interface Stats {
  total: number
  open: number
  in_progress: number
  resolved: number
  sla_breached: number
}

const fetcher = () => api.tickets.stats()

export function TicketStats() {
  const { data: stats } = useSWR<Stats>("/tickets/stats", fetcher, {
    refreshInterval: 30000,
  })

  if (!stats) return null

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <TicketIcon className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{stats.total}</p>
            <p className="text-sm text-muted-foreground">Total Tickets</p>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
            <TicketIcon className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{stats.open}</p>
            <p className="text-sm text-muted-foreground">Open</p>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
            <ClockIcon className="w-5 h-5 text-purple-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{stats.in_progress}</p>
            <p className="text-sm text-muted-foreground">In Progress</p>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
            <CheckCircleIcon className="w-5 h-5 text-green-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{stats.resolved}</p>
            <p className="text-sm text-muted-foreground">Resolved</p>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center">
            <AlertTriangleIcon className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{stats.sla_breached}</p>
            <p className="text-sm text-muted-foreground">SLA Breached</p>
          </div>
        </div>
      </div>
    </div>
  )
}
