"use client"

import { useEffect, useState } from "react"

export default function DebugPage() {
  const [tokens, setTokens] = useState<any>({})

  useEffect(() => {
    const access = localStorage.getItem("access_token")
    const refresh = localStorage.getItem("refresh_token")
    const user = localStorage.getItem("user")
    
    setTokens({
      access: access ? `${access.substring(0, 30)}...` : "NOT FOUND",
      refresh: refresh ? `${refresh.substring(0, 30)}...` : "NOT FOUND",
      user: user || "NOT FOUND"
    })
  }, [])

  return (
    <div className="min-h-screen bg-background p-8">
      <h1 className="text-2xl font-bold mb-4">Debug - Auth Tokens</h1>
      
      <div className="space-y-4">
        <div className="bg-card p-4 rounded border">
          <h2 className="font-semibold mb-2">Access Token:</h2>
          <code className="text-xs break-all">{tokens.access}</code>
        </div>

        <div className="bg-card p-4 rounded border">
          <h2 className="font-semibold mb-2">Refresh Token:</h2>
          <code className="text-xs break-all">{tokens.refresh}</code>
        </div>

        <div className="bg-card p-4 rounded border">
          <h2 className="font-semibold mb-2">User Data:</h2>
          <code className="text-xs break-all">{tokens.user}</code>
        </div>

        <button
          onClick={() => {
            localStorage.clear()
            window.location.reload()
          }}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          Clear All & Reload
        </button>
      </div>
    </div>
  )
}
