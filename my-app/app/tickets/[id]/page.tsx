"use client"

import { use } from "react"
import useSWR from "swr"
import { Header } from "@/components/header"
import { TicketDetails } from "@/components/ticket-details"
import { CommentsList } from "@/components/comments-list"
import { api, type Ticket } from "@/lib/api"
import { ArrowLeftIcon, Loader2Icon } from "lucide-react"
import Link from "next/link"

const fetcher = (id: number) => api.tickets.get(id)

export default function TicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const ticketId = Number.parseInt(resolvedParams.id)
  const {
    data: ticket,
    error,
    isLoading,
    mutate,
  } = useSWR<Ticket>(ticketId ? `/tickets/${ticketId}` : null, () => fetcher(ticketId))

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

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2Icon className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}

        {error && (
          <div className="bg-destructive/10 border border-destructive text-destructive rounded-lg p-4 text-center">
            Failed to load ticket. Please try again later.
          </div>
        )}

        {ticket && (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <TicketDetails ticket={ticket} onUpdate={mutate} />
              <div className="mt-6">
                <CommentsList ticketId={ticket.id} />
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="font-semibold text-foreground mb-4">Ticket Information</h3>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm text-muted-foreground">Ticket ID</dt>
                    <dd className="text-foreground font-medium">#{ticket.id}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">Customer Email</dt>
                    <dd className="text-foreground font-medium">{ticket.customer_email}</dd>
                  </div>
                  {ticket.assigned_to && (
                    <div>
                      <dt className="text-sm text-muted-foreground">Assigned To</dt>
                      <dd className="text-foreground font-medium">{ticket.assigned_to}</dd>
                    </div>
                  )}
                  <div>
                    <dt className="text-sm text-muted-foreground">Created</dt>
                    <dd className="text-foreground font-medium">{new Date(ticket.created_at).toLocaleString()}</dd>
                  </div>
                  {ticket.resolved_at && (
                    <div>
                      <dt className="text-sm text-muted-foreground">Resolved</dt>
                      <dd className="text-foreground font-medium">{new Date(ticket.resolved_at).toLocaleString()}</dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}