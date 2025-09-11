"use client"

import { useState } from "react"
import { usePrefs } from "@/components/prefs-context"
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

type Hl7Res = {
  original: string
  redacted: string
  compliance: {
    violations: string[]
    risk: "low" | "high"
    audit_log: { fingerprint: string }
    blockchain_hash: string
  }
  privacy_mode: string
  classification: any
}

export default function HL7Page() {
  const { privacyMode, user } = usePrefs()
  const [text, setText] = useState<string>(
    '{\n  "resourceType": "Patient",\n  "name": [{"given": ["John"], "family": "Doe"}]\n}',
  )
  const [file, setFile] = useState<File | null>(null)
  const [res, setRes] = useState<Hl7Res | null>(null)
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  async function submitFormData(fd: FormData) {
    setLoading(true)
    setErr(null)
    setRes(null)
    try {
      // include global prefs
      fd.append("privacy_mode", privacyMode)
      fd.append("user", user)
      const r = await fetch(`${API_BASE}/process/hl7`, { method: "POST", body: fd })
      if (!r.ok) throw new Error(`HTTP ${r.status}`)
      setRes(await r.json())
    } catch (e: any) {
      setErr(e.message)
    } finally {
      setLoading(false)
    }
  }

  async function submitText() {
    const fd = new FormData()
    fd.append("file", new Blob([text], { type: "application/json" }) as any, "payload.json")
    await submitFormData(fd)
  }

  async function submitFile() {
    if (!file) return
    const fd = new FormData()
    fd.append("file", file)
    await submitFormData(fd)
  }

  return (
    <main className="container mx-auto max-w-5xl px-4 py-8 space-y-6">
      <h1 className="text-2xl md:text-3xl font-semibold text-balance">HL7 / FHIR JSON Processor</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-3">
          <h3 className="font-medium">Paste JSON</h3>
          <textarea
            className="border rounded w-full h-56 p-2 text-sm"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button
            onClick={submitText}
            disabled={loading}
            className="rounded bg-[var(--color-primary)] text-white px-3 py-1.5 text-sm"
          >
            {loading ? "Processing…" : "Process JSON"}
          </button>
        </div>
        <div className="space-y-3">
          <h3 className="font-medium">Or Upload JSON/HL7 file</h3>
          <input type="file" accept=".json,.hl7" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          <button
            onClick={submitFile}
            disabled={loading || !file}
            className="rounded bg-[var(--color-primary)] text-white px-3 py-1.5 text-sm"
          >
            {loading ? "Processing…" : "Process File"}
          </button>
        </div>
      </div>

      {err && <p className="text-[var(--color-accent-red)] text-sm">Error: {err}</p>}

      {res && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ${res.compliance.risk === "high" ? "bg-[var(--color-accent-red)/10] text-[var(--color-accent-red)]" : "bg-emerald-50 text-emerald-700"}`}
            >
              Risk: {res.compliance.risk}
            </span>
            {res.compliance.violations?.length > 0 && (
              <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs bg-amber-50 text-amber-700">
                SMS alert scheduled
              </span>
            )}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-medium">Original</h4>
              <pre className="bg-muted rounded p-2 text-xs overflow-auto max-h-96 whitespace-pre-wrap">
                {res.original}
              </pre>
            </div>
            <div>
              <h4 className="font-medium">Redacted</h4>
              <pre className="bg-muted rounded p-2 text-xs overflow-auto max-h-96 whitespace-pre-wrap">
                {res.redacted}
              </pre>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
