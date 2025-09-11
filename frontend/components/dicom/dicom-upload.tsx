"use client"

import type React from "react"

import { useState } from "react"

type DicomResult = {
  filename: string
  metadata: Record<string, string>
  message: string
  compliance: {
    violations: string[]
    risk: string
  }
  privacy_mode: string
  classification?: {
    label: string
    confidence: number
  }
  download_url: string
}

export function DicomUpload() {
  const [files, setFiles] = useState<FileList | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [results, setResults] = useState<DicomResult[]>([])
  const [error, setError] = useState<string | null>(null)

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

  const onSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files)
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!files || files.length === 0) {
      setError("Please select one or more .dcm files.")
      return
    }
    setSubmitting(true)
    try {
      const form = new FormData()
      Array.from(files).forEach((f) => form.append("files", f))
      const res = await fetch(`${API_BASE}/process/dicom`, {
        method: "POST",
        body: form,
      })
      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || "Upload failed")
      }
      const data = await res.json()
      const items = (data?.results || []) as DicomResult[]
      setResults(items)
    } catch (err: any) {
      setError(err?.message || "Something went wrong")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        <input
          onChange={onSelect}
          type="file"
          accept=".dcm,application/dicom"
          multiple
          className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
          aria-label="Select DICOM files"
        />
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:opacity-95 disabled:opacity-60"
          >
            {submitting ? "Processing…" : "Process DICOM"}
          </button>
          {files?.length ? (
            <span className="text-xs text-muted-foreground">{files.length} file(s) selected</span>
          ) : null}
        </div>
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
      </form>

      {results.length > 0 && (
        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-medium text-foreground">Results</h3>
          <ul className="flex flex-col gap-3">
            {results.map((r, idx) => (
              <li key={idx} className="rounded-lg border bg-card p-3">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground">{r.filename}</p>
                      <p className="text-xs text-muted-foreground">
                        {r.message} • Risk:{" "}
                        <span
                          className={
                            r.compliance?.risk === "high" ? "text-destructive" : "text-green-600 dark:text-green-500"
                          }
                        >
                          {r.compliance?.risk ?? "unknown"}
                        </span>
                        {r.classification?.label
                          ? ` • Type: ${r.classification.label} (${r.classification.confidence})`
                          : ""}
                      </p>
                    </div>
                    <a
                      href={`${API_BASE}${r.download_url}`}
                      target="_blank"
                      rel="noreferrer"
                      className="shrink-0 inline-flex h-8 items-center justify-center rounded-md border px-3 text-xs font-medium hover:bg-accent hover:text-accent-foreground"
                    >
                      Download redacted
                    </a>
                  </div>

                  {/* Violations */}
                  {Array.isArray(r.compliance?.violations) && r.compliance.violations.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {r.compliance.violations.map((v, i) => (
                        <span
                          key={i}
                          className="rounded-md bg-destructive/10 px-2 py-0.5 text-[11px] font-medium text-destructive"
                        >
                          {v}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">No HIPAA violations detected.</p>
                  )}

                  {/* Metadata preview */}
                  {r.metadata ? (
                    <div className="mt-1 grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {Object.entries(r.metadata)
                        .slice(0, 8)
                        .map(([k, v]) => (
                          <div key={k} className="rounded-md bg-muted/40 p-2">
                            <p className="text-[11px] font-medium text-muted-foreground">{k}</p>
                            <p className="truncate text-sm text-foreground">{v}</p>
                          </div>
                        ))}
                    </div>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
