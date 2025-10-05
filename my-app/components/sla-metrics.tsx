"use client"

import useSWR from "swr"
import { api, type Ticket } from "@/lib/api"
import { TrendingUpIcon, TrendingDownIcon, ClockIcon, CheckCircleIcon } from "lucide-react"

const fetcher = () => api.tickets.list()

export function SLAMetrics() {
  const { data: tickets } = useSWR<Ticket[]>("/tickets", fetcher, {
    refreshInterval: 30000,
  })

  const ticketsArray = Array.isArray(tickets) ? tickets : []
  
  if (ticketsArray.length === 0) return null

  const resolvedTickets = ticketsArray.filter((t) => t.resolved_at)
  const breachedTickets = ticketsArray.filter((t) => t.is_sla_breached)

  const avgResolutionTime =
    resolvedTickets.length > 0
      ? resolvedTickets.reduce((sum, t) => sum + (t.time_to_resolution || 0), 0) / resolvedTickets.length
      : 0

  const complianceRate = ticketsArray.length > 0 ? ((ticketsArray.length - breachedTickets.length) / ticketsArray.length) * 100 : 100

  const formatHours = (hours: number) => {
    if (hours < 1) return `${Math.round(hours * 60)}m`
    if (hours < 24) return `${hours.toFixed(1)}h`
    return `${(hours / 24).toFixed(1)}d`
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">SLA Compliance</span>
          {complianceRate >= 90 ? (
            <TrendingUpIcon className="w-4 h-4 text-green-500" />
          ) : (
            <TrendingDownIcon className="w-4 h-4 text-red-500" />
          )}
        </div>
        <p className="text-3xl font-bold text-foreground">{complianceRate.toFixed(1)}%</p>
        <p className="text-xs text-muted-foreground mt-1">
          {ticketsArray.length - breachedTickets.length} of {ticketsArray.length} tickets
        </p>
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">Avg Resolution Time</span>
          <ClockIcon className="w-4 h-4 text-blue-500" />
        </div>
        <p className="text-3xl font-bold text-foreground">{formatHours(avgResolutionTime)}</p>
        <p className="text-xs text-muted-foreground mt-1">Across {resolvedTickets.length} resolved tickets</p>
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">Breached Tickets</span>
          <div className="w-2 h-2 bg-red-500 rounded-full" />
        </div>
        <p className="text-3xl font-bold text-foreground">{breachedTickets.length}</p>
        <p className="text-xs text-muted-foreground mt-1">Require immediate attention</p>
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">Resolved Tickets</span>
          <CheckCircleIcon className="w-4 h-4 text-green-500" />
        </div>
        <p className="text-3xl font-bold text-foreground">{resolvedTickets.length}</p>
        <p className="text-xs text-muted-foreground mt-1">Successfully completed</p>
      </div>
    </div>
  )
}
