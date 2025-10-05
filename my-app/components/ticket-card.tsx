import Link from "next/link"
import type { Ticket } from "@/lib/api"
import { ClockIcon, AlertTriangleIcon, MessageSquareIcon } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface TicketCardProps {
  ticket: Ticket
  onUpdate: () => void
}

export function TicketCard({ ticket }: TicketCardProps) {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "in_progress":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20"
      case "resolved":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "closed":
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
      default:
        return "bg-muted text-muted-foreground border-border"
    }
  }

  // Get comment count - handle both Array and number types
  const commentCount = Array.isArray(ticket.comments) 
    ? ticket.comments.length 
    : (typeof (ticket as any).comment_count === 'number' ? (ticket as any).comment_count : 0)

  return (
    <Link href={`/tickets/${ticket.id}`}>
      <div className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm text-muted-foreground">#{ticket.id}</span>
              {ticket.is_sla_breached && (
                <span className="flex items-center gap-1 text-xs text-red-500">
                  <AlertTriangleIcon className="w-3 h-3" />
                  SLA Breached
                </span>
              )}
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">{ticket.title}</h3>
            <p className="text-muted-foreground text-sm line-clamp-2">{ticket.description}</p>
          </div>

          <div className="flex flex-col items-end gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(ticket.priority)}`}>
              {ticket.priority}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(ticket.status)}`}>
              {ticket.status.replace("_", " ")}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground pt-3 border-t border-border">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <ClockIcon className="w-4 h-4" />
              {formatDistanceToNow(new Date(ticket.created_at), { addSuffix: true })}
            </span>
            <span className="flex items-center gap-1">
              <MessageSquareIcon className="w-4 h-4" />
              {commentCount}
            </span>
          </div>
          {ticket.assigned_to && <span className="text-xs">Assigned to: {ticket.assigned_to}</span>}
        </div>
      </div>
    </Link>
  )
}