const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

export interface User {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  role: "admin" | "agent" | "customer"
  phone?: string
}

export interface AuthTokens {
  access: string
  refresh: string
}

export interface AuthResponse {
  user: User
  tokens: AuthTokens
}

class AuthService {
  private getTokens(): AuthTokens | null {
    if (typeof window === "undefined") return null
    const access = localStorage.getItem("access_token")
    const refresh = localStorage.getItem("refresh_token")
    if (!access || !refresh) return null
    return { access, refresh }
  }

  private setTokens(tokens: AuthTokens) {
    if (!tokens || !tokens.access || !tokens.refresh) {
      console.error("Invalid tokens received:", tokens)
      return
    }
    console.log("Storing tokens:", { 
      accessLength: tokens.access.length, 
      refreshLength: tokens.refresh.length 
    })
    localStorage.setItem("access_token", tokens.access)
    localStorage.setItem("refresh_token", tokens.refresh)
    
    // Verify tokens were stored
    const storedAccess = localStorage.getItem("access_token")
    const storedRefresh = localStorage.getItem("refresh_token")
    console.log("Tokens verified in localStorage:", {
      accessStored: !!storedAccess,
      refreshStored: !!storedRefresh
    })
  }

  private clearTokens() {
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
    localStorage.removeItem("user")
  }

  async register(data: {
    username: string
    email: string
    password: string
    password2: string
    first_name: string
    last_name: string
    role?: string
  }): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || "Registration failed")
    }

    const authData: AuthResponse = await response.json()
    this.setTokens(authData.tokens)
    localStorage.setItem("user", JSON.stringify(authData.user))
    return authData
  }

  async login(username: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Login failed")
    }

    const authData: AuthResponse = await response.json()
    console.log("Login response received:", { 
      hasTokens: !!authData.tokens, 
      hasUser: !!authData.user 
    })
    this.setTokens(authData.tokens)
    localStorage.setItem("user", JSON.stringify(authData.user))
    console.log("Tokens and user stored successfully")
    return authData
  }

  async logout() {
    const tokens = this.getTokens()
    if (tokens) {
      try {
        await fetch(`${API_BASE_URL}/auth/logout/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokens.access}`,
          },
          body: JSON.stringify({ refresh_token: tokens.refresh }),
        })
      } catch (error) {
        console.error("Logout error:", error)
      }
    }
    this.clearTokens()
  }

  getUser(): User | null {
    if (typeof window === "undefined") return null
    const userStr = localStorage.getItem("user")
    if (!userStr) return null
    return JSON.parse(userStr)
  }

  isAuthenticated(): boolean {
    return this.getTokens() !== null
  }

  getAccessToken(): string | null {
    const tokens = this.getTokens()
    return tokens?.access || null
  }
}

export const authService = new AuthService()
