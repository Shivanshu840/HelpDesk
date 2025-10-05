"use client"

import { useState } from "react"
import useSWR from "swr"
import Link from "next/link"
import { Header } from "@/components/header"
import { TicketCard } from "@/components/ticket-card"
import { TicketStats } from "@/components/ticket-stats"
import { api, type Ticket } from "@/lib/api"
import { Loader2Icon, PlusIcon } from "lucide-react"

const fetcher = () => api.tickets.list()

export default function TicketsPage() {
  const { data: tickets, error, isLoading, mutate } = useSWR<Ticket[]>("/tickets", fetcher)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")

  const ticketsArray = Array.isArray(tickets) ? tickets : []
  
  console.log("Tickets data:", { 
    rawTickets: tickets, 
    isArray: Array.isArray(tickets),
    ticketsArrayLength: ticketsArray.length 
  })
  
  const filteredTickets = ticketsArray.filter((ticket) => {
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter
    const matchesPriority = priorityFilter === "all" || ticket.priority === priorityFilter
    return matchesStatus && matchesPriority
  })
  
  console.log("Filtered tickets:", filteredTickets.length)

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 md:px-6 py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Support Tickets</h1>
            <p className="text-muted-foreground text-base md:text-lg">Manage and track all customer support requests</p>
          </div>
          <Link
            href="/tickets/new"
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 w-full md:w-auto justify-center"
          >
            <PlusIcon className="w-5 h-5" />
            New Ticket
          </Link>
        </div>

        <TicketStats />

        <div className="glass-card rounded-xl p-6 mb-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-foreground mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2.5 bg-background border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              >
                <option value="all">All Statuses</option>
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-foreground mb-2">Priority</label>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="w-full px-4 py-2.5 bg-background border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              >
                <option value="all">All Priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2Icon className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}

        {error && (
          <div className="bg-destructive/10 border border-destructive text-destructive rounded-lg p-4 text-center">
            Failed to load tickets. Please try again later.
          </div>
        )}

        {!isLoading && filteredTickets.length === 0 && (
          <div className="glass-card rounded-xl p-12 text-center">
            <p className="text-muted-foreground text-lg">No tickets found</p>
          </div>
        )}

        <div className="grid gap-4">
          {filteredTickets?.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} onUpdate={mutate} />
          ))}
        </div>
      </main>
    </div>
  )
}
