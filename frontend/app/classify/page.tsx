"use client"
import { useState } from "react"
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

type ClassifyResult = {
  label: string
  confidence: number
  scores: Record<string, number>
  evidence: string[]
  preview?: string
  filename?: string
}

export default function ClassifyPage() {
  const [tab, setTab] = useState<"text" | "file">("text")
  const [text, setText] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [res, setRes] = useState<ClassifyResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  async function classifyText() {
    setLoading(true)
    setErr(null)
    setRes(null)
    try {
      const r = await fetch(`${API_BASE}/classify/text`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      })
      if (!r.ok) throw new Error(`HTTP ${r.status}`)
      setRes(await r.json())
    } catch (e: any) {
      setErr(e.message)
    } finally {
      setLoading(false)
    }
  }

  async function classifyFile() {
    if (!file) return
    setLoading(true)
    setErr(null)
    setRes(null)
    try {
      const fd = new FormData()
      fd.append("file", file)
      const r = await fetch(`${API_BASE}/classify/file`, { method: "POST", body: fd })
      if (!r.ok) throw new Error(`HTTP ${r.status}`)
      setRes(await r.json())
    } catch (e: any) {
      setErr(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="space-y-6">
      <h2 className="text-xl font-semibold">Document Classifier</h2>

      <div className="flex gap-2">
        <button
          onClick={() => setTab("text")}
          className={`rounded px-3 py-1.5 text-sm border ${tab === "text" ? "bg-[var(--color-primary)] text-white" : "bg-background"}`}
        >
          Text
        </button>
        <button
          onClick={() => setTab("file")}
          className={`rounded px-3 py-1.5 text-sm border ${tab === "file" ? "bg-[var(--color-primary)] text-white" : "bg-background"}`}
        >
          File
        </button>
      </div>

      {tab === "text" ? (
        <div className="space-y-3">
          <textarea className="border rounded w-full h-40 p-2" value={text} onChange={(e) => setText(e.target.value)} />
          <button
            onClick={classifyText}
            disabled={loading}
            className="rounded bg-[var(--color-primary)] text-white px-3 py-1.5 text-sm"
          >
            {loading ? "Classifying…" : "Classify Text"}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          <button
            onClick={classifyFile}
            disabled={loading || !file}
            className="rounded bg-[var(--color-primary)] text-white px-3 py-1.5 text-sm"
          >
            {loading ? "Classifying…" : "Classify File"}
          </button>
        </div>
      )}

      {err && <p className="text-[var(--color-accent-red)] text-sm">Error: {err}</p>}
      {res && (
        <div className="rounded border p-4 space-y-2">
          <div className="flex items-center gap-3">
            <div className="text-sm">
              <span className="font-medium">Label:</span> {res.label}
            </div>
            <div className="text-sm">
              <span className="font-medium">Confidence:</span> {res.confidence}
            </div>
          </div>
          <div>
            <h3 className="font-medium">Scores</h3>
            <ul className="grid grid-cols-2 md:grid-cols-3 gap-1 text-sm">
              {Object.entries(res.scores || {}).map(([k, v]) => (
                <li key={k} className="flex justify-between border rounded px-2 py-1">
                  <span>{k}</span>
                  <span>{v}</span>
                </li>
              ))}
            </ul>
          </div>
          {res.evidence?.length > 0 && (
            <div>
              <h3 className="font-medium">Evidence</h3>
              <ul className="list-disc ml-5 text-sm">
                {res.evidence.map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ul>
            </div>
          )}
          {res.preview && (
            <div>
              <h3 className="font-medium">Preview</h3>
              <pre className="bg-muted rounded p-2 whitespace-pre-wrap text-xs">{res.preview}</pre>
            </div>
          )}
        </div>
      )}
    </section>
  )
}
