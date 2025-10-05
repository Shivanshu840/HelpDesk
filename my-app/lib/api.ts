const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

export interface Ticket {
  id: number
  title: string
  description: string
  status: "open" | "in_progress" | "resolved" | "closed"
  priority: "low" | "medium" | "high" | "critical"
  created_at: string
  updated_at: string
  assigned_to?: string
  customer_email: string
  sla_breach_at?: string
  resolved_at?: string
  first_response_at?: string
  is_sla_breached: boolean
  time_to_resolution?: number
  comments?: Comment[]
}

export interface Comment {
  id: number
  ticket: number
  author: string
  content: string
  created_at: string
  is_internal: boolean
}

export interface SLA {
  id: number
  priority: string
  response_time_hours: number
  resolution_time_hours: number
}

export interface User {
  id: number
  name: string
  username: string
  email: string
}

async function fetchAPI(endpoint: string, options?: RequestInit) {
  // Get auth token
  let authToken: string | null = null
  if (typeof window !== "undefined") {
    authToken = localStorage.getItem("access_token")
  }

  // Build headers
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  }

  // Add auth token if available
  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`
    console.log("Auth token added to request")
  } else {
    console.warn("No access token found in localStorage")
  }

  const finalHeaders = {
    ...headers,
    ...(options?.headers as Record<string, string>),
  }
  
  console.log("Making request to:", `${API_BASE_URL}${endpoint}`)
  console.log("Headers:", finalHeaders)

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: finalHeaders,
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error("API Error:", response.status, errorText)
    
    // Handle 401 Unauthorized - token might be expired
    if (response.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("access_token")
        localStorage.removeItem("refresh_token")
        localStorage.removeItem("user")
        window.location.href = "/login"
      }
      throw new Error("Unauthorized. Please login again.")
    }
    
    // Handle 403 Forbidden - permission denied
    if (response.status === 403) {
      throw new Error("You don't have permission to perform this action.")
    }
    
    throw new Error(`API Error: ${response.statusText}`)
  }

  const data = await response.json()
  
  // Handle paginated responses from Django REST Framework
  if (data && typeof data === 'object' && 'results' in data) {
    return data.results
  }
  
  return data
}

export interface User {
  id: number
  name: string
  username: string
  email: string
}

export const api = {
  tickets: {
    list: () => fetchAPI("/tickets/"),
    get: (id: number) => fetchAPI(`/tickets/${id}/`),
    create: (data: Partial<Ticket>) =>
      fetchAPI("/tickets/", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: number, data: Partial<Ticket>) => {
      // Convert assigned_to name to ID if needed
      const updateData = { ...data }
      // The serializer will handle the conversion now
      return fetchAPI(`/tickets/${id}/`, {
        method: "PATCH",
        body: JSON.stringify(updateData),
      })
    },
    delete: (id: number) =>
      fetchAPI(`/tickets/${id}/`, {
        method: "DELETE",
      }),
    stats: () => fetchAPI("/tickets/stats/"),
  },
  users: {
    assignable: () => fetchAPI("/users/assignable/"),
  },
  comments: {
    list: (ticketId: number) => fetchAPI(`/tickets/${ticketId}/comments/`),
    create: (ticketId: number, data: Partial<Comment>) =>
      fetchAPI(`/tickets/${ticketId}/add_comment/`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
  },
  sla: {
    list: () => fetchAPI("/sla/"),
    create: (data: Partial<SLA>) =>
      fetchAPI("/sla/", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: number, data: Partial<SLA>) =>
      fetchAPI(`/sla/${id}/`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    delete: (id: number) =>
      fetchAPI(`/sla/${id}/`, {
        method: "DELETE",
      }),
  },
}