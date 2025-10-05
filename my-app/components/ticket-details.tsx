"use client"

import { useState, useEffect } from "react"
import { api, type Ticket, type User } from "@/lib/api"
import { authService } from "@/lib/auth"
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Loader2,
  ChevronDown,
  AlertTriangle
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface TicketDetailsProps {
  ticket: Ticket
  onUpdate: () => void
}

export function TicketDetails({ ticket, onUpdate }: TicketDetailsProps) {
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const [formData, setFormData] = useState({
    status: ticket.status,
    priority: ticket.priority,
    assigned_to: ticket.assigned_to || "",
    assigned_to_id: null as number | null,
  })

  const user = authService.getUser()
  const canEdit = user && (user.role === 'admin' || user.role === 'agent')

  useEffect(() => {
    if (editing && canEdit && users.length === 0) {
      setLoadingUsers(true)
      api.users.assignable()
        .then(setUsers)
        .catch(err => console.error("Failed to load users:", err))
        .finally(() => setLoadingUsers(false))
    }
  }, [editing, canEdit, users.length])

  const handleUpdate = async () => {
    setLoading(true)
    try {
      const updateData: any = {
        status: formData.status,
        priority: formData.priority,
      }

      if (formData.assigned_to_id !== null) {
        updateData.assigned_to = formData.assigned_to_id
      }

      await api.tickets.update(ticket.id, updateData)
      await onUpdate()
      setEditing(false)
    } catch (error) {
      console.error("Failed to update ticket:", error)
      alert("Failed to update ticket. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      status: ticket.status,
      priority: ticket.priority,
      assigned_to: ticket.assigned_to || "",
      assigned_to_id: null,
    })
    setEditing(false)
    setShowUserDropdown(false)
  }

  const handleUserSelect = (selectedUser: User | null) => {
    setFormData({
      ...formData,
      assigned_to: selectedUser ? selectedUser.name : "",
      assigned_to_id: selectedUser ? selectedUser.id : null,
    })
    setShowUserDropdown(false)
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      open: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      in_progress: "bg-purple-500/10 text-purple-500 border-purple-500/20",
      resolved: "bg-green-500/10 text-green-500 border-green-500/20",
      closed: "bg-gray-500/10 text-gray-500 border-gray-500/20"
    }
    return colors[status] || "bg-muted text-muted-foreground border-border"
  }

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      critical: "bg-red-500/10 text-red-500 border-red-500/20",
      high: "bg-orange-500/10 text-orange-500 border-orange-500/20",
      medium: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
      low: "bg-blue-500/10 text-blue-500 border-blue-500/20"
    }
    return colors[priority] || "bg-muted text-muted-foreground border-border"
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm text-muted-foreground">Ticket #{ticket.id}</span>
            {ticket.is_sla_breached && (
              <span className="flex items-center gap-1 px-2 py-1 bg-red-500/10 text-red-500 rounded text-xs">
                <AlertTriangle className="w-3 h-3" />
                SLA Breached
              </span>
            )}
          </div>
          <h1 className="text-2xl font-bold text-foreground">{ticket.title}</h1>
        </div>

        {canEdit && !editing && (
          <button
            onClick={() => setEditing(true)}
            className="px-4 py-2 bg-muted text-foreground rounded-lg font-medium hover:bg-muted/80 transition-colors"
          >
            Edit
          </button>
        )}
      </div>

      {editing ? (
        <div className="space-y-4 mb-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-3 py-2 bg-background border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                className="w-full px-3 py-2 bg-background border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-foreground mb-2">Assign To</label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="w-full px-3 py-2 bg-background border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring text-left flex items-center justify-between"
              >
                <span>{formData.assigned_to || "Select user..."}</span>
                {loadingUsers ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
              
              {showUserDropdown && users.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-background border border-input rounded-lg shadow-lg max-h-60 overflow-auto">
                  <div
                    onClick={() => handleUserSelect(null)}
                    className="px-3 py-2 hover:bg-muted cursor-pointer text-foreground border-b border-border"
                  >
                    Unassigned
                  </div>
                  {users.map((user) => (
                    <div
                      key={user.id}
                      onClick={() => handleUserSelect(user)}
                      className="px-3 py-2 hover:bg-muted cursor-pointer"
                    >
                      <div className="font-medium text-foreground">{user.name}</div>
                      <div className="text-xs text-muted-foreground">{user.email}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleUpdate}
              disabled={loading}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? "Saving..." : "Save Changes"}
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-muted text-foreground rounded-lg font-medium hover:bg-muted/80 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-3 mb-6">
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(ticket.status)}`}>
              {ticket.status.replace("_", " ")}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(ticket.priority)}`}>
              {ticket.priority}
            </span>
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              {formatDistanceToNow(new Date(ticket.created_at), { addSuffix: true })}
            </span>
          </div>

          <div className="prose prose-sm max-w-none">
            <h3 className="text-foreground font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{ticket.description}</p>
          </div>

          {ticket.sla_breach_at && (
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  SLA Deadline: {new Date(ticket.sla_breach_at).toLocaleString()}
                </span>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}