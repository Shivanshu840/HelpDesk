"use client"

import type React from "react"

import { useState, useEffect } from "react"
import useSWR from "swr"
import { api, type Comment } from "@/lib/api"
import { authService } from "@/lib/auth"
import { MessageSquareIcon, Loader2Icon, LockIcon, SendIcon } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface CommentsListProps {
  ticketId: number
}

const fetcher = (ticketId: number) => api.comments.list(ticketId)

export function CommentsList({ ticketId }: CommentsListProps) {
  const [user, setUser] = useState<any>(null)
  const [showForm, setShowForm] = useState(false)
  
  useEffect(() => {
    const currentUser = authService.getUser()
    setUser(currentUser)
  }, [])

  const isCustomer = user && user.role === 'customer'

  const {
    data: comments,
    error,
    isLoading,
    mutate,
  } = useSWR<Comment[]>(
    isCustomer ? null : `/tickets/${ticketId}/comments`, 
    () => fetcher(ticketId)
  )

  // Don't show comments for customers - they don't have permission
  if (isCustomer) {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <MessageSquareIcon className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold text-foreground">Comments</h2>
        </div>
        <div className="bg-muted rounded-lg p-6 text-center">
          <LockIcon className="w-8 h-8 text-muted-foreground mx-auto mb-3 opacity-50" />
          <p className="text-muted-foreground">Comments are only visible to support staff</p>
          <p className="text-sm text-muted-foreground mt-1">Our team uses this section for internal notes</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <MessageSquareIcon className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold text-foreground">Comments</h2>
          {comments && <span className="text-sm text-muted-foreground">({comments.length})</span>}
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity text-sm"
        >
          {showForm ? "Cancel" : "Add Comment"}
        </button>
      </div>

      {showForm && (
        <div className="mb-6">
          <CommentForm
            ticketId={ticketId}
            onSuccess={() => {
              setShowForm(false)
              mutate()
            }}
          />
        </div>
      )}

      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <Loader2Icon className="w-6 h-6 animate-spin text-primary" />
        </div>
      )}

      {error && (
        <div className="bg-destructive/10 border border-destructive text-destructive rounded-lg p-4 text-center text-sm">
          {error.message?.includes('permission') || error.message?.includes('403') 
            ? "You don't have permission to view comments. Please contact your administrator." 
            : "Failed to load comments. Please try again later."}
        </div>
      )}

      {comments && comments.length === 0 && (
        <div className="text-center py-8">
          <MessageSquareIcon className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
          <p className="text-muted-foreground">No comments yet</p>
          <p className="text-sm text-muted-foreground mt-1">Be the first to add a comment</p>
        </div>
      )}

      <div className="space-y-4">
        {comments?.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  )
}

function CommentItem({ comment }: { comment: Comment }) {
  const authorName = typeof comment.author === 'string' 
    ? comment.author 
    : (comment as any).author_name || 'Unknown'
  
  return (
    <div
      className={`p-4 rounded-lg ${comment.is_internal ? "bg-yellow-500/5 border border-yellow-500/20" : "bg-muted"}`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-primary">
              {authorName && authorName.length > 0 ? authorName.charAt(0).toUpperCase() : 'U'}
            </span>
          </div>
          <div>
            <p className="font-medium text-foreground text-sm">{authorName}</p>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
            </p>
          </div>
        </div>
        {comment.is_internal && (
          <span className="flex items-center gap-1 px-2 py-1 bg-yellow-500/10 text-yellow-600 rounded text-xs">
            <LockIcon className="w-3 h-3" />
            Internal
          </span>
        )}
      </div>
      <p className="text-foreground leading-relaxed whitespace-pre-wrap ml-10">{comment.content}</p>
    </div>
  )
}

function CommentForm({ ticketId, onSuccess }: { ticketId: number; onSuccess: () => void }) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    author_name: "",
    content: "",
    is_internal: false,
  })
  
  useEffect(() => {
    const user = authService.getUser()
    if (user) {
      const displayName = user.first_name && user.last_name 
        ? `${user.first_name} ${user.last_name}` 
        : user.username
      setFormData(prev => ({ ...prev, author_name: displayName }))
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await api.comments.create(ticketId, formData)
      setFormData({ author_name: formData.author_name, content: "", is_internal: false })
      onSuccess()
    } catch (error) {
      console.error("Failed to create comment:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-muted rounded-lg p-4 space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="author_name" className="block text-sm font-medium text-foreground mb-2">
            Your Name *
          </label>
          <input
            type="text"
            id="author_name"
            required
            value={formData.author_name}
            onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
            className="w-full px-3 py-2 bg-background border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="Enter your name"
          />
        </div>

        <div className="flex items-end">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.is_internal}
              onChange={(e) => setFormData({ ...formData, is_internal: e.target.checked })}
              className="w-4 h-4 rounded border-input text-primary focus:ring-2 focus:ring-ring"
            />
            <span className="text-sm text-foreground">Internal comment (not visible to customer)</span>
          </label>
        </div>
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-foreground mb-2">
          Comment *
        </label>
        <textarea
          id="content"
          required
          rows={4}
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          className="w-full px-3 py-2 bg-background border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
          placeholder="Write your comment here..."
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        <SendIcon className="w-4 h-4" />
        {loading ? "Posting..." : "Post Comment"}
      </button>
    </form>
  )
}