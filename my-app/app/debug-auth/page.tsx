"use client"

import { useState } from "react"
import { api } from "@/lib/api"

export default function DebugAuthPage() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testAuth = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem("access_token")
      const response = await fetch("http://localhost:8000/api/debug/headers/", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })
      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({ error: String(error) })
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <h1 className="text-2xl font-bold mb-4">Debug - Auth Headers</h1>
      
      <button
        onClick={testAuth}
        disabled={loading}
        className="px-4 py-2 bg-primary text-white rounded mb-4"
      >
        {loading ? "Testing..." : "Test Auth Headers"}
      </button>

      {result && (
        <div className="bg-card p-4 rounded border">
          <h2 className="font-semibold mb-2">Backend Response:</h2>
          <pre className="text-xs overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}
