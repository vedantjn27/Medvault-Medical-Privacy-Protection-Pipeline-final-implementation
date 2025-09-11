"use client"

import type React from "react"

import { useState } from "react"
import { usePrefs } from "@/components/prefs-context"

type AuditResponse = {
  hipaa_compliant: boolean
  violations: string[]
  audit_log: { doc_id: string; action: string; user: string; timestamp: string; fingerprint: string }
  blockchain_hash: string
  risk: "low" | "high"
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

export default function AuditPage() {
  const { user: defaultUser } = usePrefs()
  const [docId, setDocId] = useState<string>(`doc-${Date.now()}`)
  const [action, setAction] = useState<string>("file_processed")
  const [user, setUser] = useState<string>(defaultUser)
  const [content, setContent] = useState<string>("")
  const [res, setRes] = useState<AuditResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setRes(null)
    try {
      const r = await fetch(`${API_BASE}/audit/process`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doc: { id: docId, content }, action: { action, user } }),
      })
      if (!r.ok) throw new Error(`HTTP ${r.status}`)
      const data = (await r.json()) as AuditResponse
      setRes(data)
    } catch (err: any) {
      setError(err.message || "Request failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="container mx-auto max-w-5xl px-4 py-8 space-y-6">
      <h1 className="text-2xl md:text-3xl font-semibold text-balance">Audit Console</h1>
      <p className="text-muted-foreground">
        Send documents to audit/log/blockchain. SMS alerts are triggered by backend.
      </p>

      <form onSubmit={onSubmit} className="space-y-3">
        <div className="grid gap-3 md:grid-cols-3">
          <div className="flex flex-col gap-1">
            <label className="text-sm text-muted-foreground">Doc ID</label>
            <input className="border rounded px-2 py-1" value={docId} onChange={(e) => setDocId(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm text-muted-foreground">Action</label>
            <input className="border rounded px-2 py-1" value={action} onChange={(e) => setAction(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm text-muted-foreground">User</label>
            <input className="border rounded px-2 py-1" value={user} onChange={(e) => setUser(e.target.value)} />
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm text-muted-foreground">Content</label>
          <textarea
            className="border rounded px-2 py-2 h-40"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <button
          disabled={loading}
          className="inline-flex items-center rounded bg-[var(--color-primary)] px-3 py-1.5 text-white text-sm"
        >
          {loading ? "Processing…" : "Submit for Audit"}
        </button>
      </form>

      {error && <p className="text-[var(--color-accent-red)] text-sm">Error: {error}</p>}

      {res && (
        <div className="rounded border p-4 space-y-3">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ${
                res.risk === "high"
                  ? "bg-[var(--color-accent-red)/10] text-[var(--color-accent-red)]"
                  : "bg-emerald-50 text-emerald-700"
              }`}
            >
              Risk: {res.risk}
            </span>
            {res.violations?.length > 0 && (
              <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs bg-amber-50 text-amber-700">
                SMS alert scheduled
              </span>
            )}
          </div>
          <div>
            <h3 className="font-medium">Violations</h3>
            {res.violations?.length ? (
              <ul className="list-disc ml-5 text-sm">
                {res.violations.map((v, i) => (
                  <li key={i}>{v}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">None</p>
            )}
          </div>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <h4 className="font-medium">Audit Log</h4>
              <div className="rounded bg-muted p-2">
                <div>doc_id: {res.audit_log.doc_id}</div>
                <div>action: {res.audit_log.action}</div>
                <div>user: {res.audit_log.user}</div>
                <div>timestamp: {new Date(res.audit_log.timestamp).toLocaleString()}</div>
                <div className="break-all">fingerprint: {res.audit_log.fingerprint}</div>
              </div>
            </div>
            <div className="space-y-1">
              <h4 className="font-medium">Blockchain</h4>
              <div className="rounded bg-muted p-2 break-all">hash: {res.blockchain_hash}</div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
