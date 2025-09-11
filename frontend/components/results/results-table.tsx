"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronRight, Eye } from "lucide-react"
import { apiUrl } from "@/lib/api"
import { ExportButton } from "@/components/ui/export-button"
import React from "react"

type Item = {
  filename: string
  result: any
}

type SortKey = "filename" | "type" | "risk" | "label" | "confidence" | "violations"

export function ResultsTable({ items }: { items: Item[] }) {
  const [query, setQuery] = useState("")
  const [sortBy, setSortBy] = useState<SortKey>("filename")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set())

  const rows = useMemo(() => {
    const mapped = items.map(({ filename, result }) => {
      const classification = result?.classification || {}
      const label = classification?.label || "—"
      const confidence = classification?.confidence ?? null
      const compliance = result?.compliance
      const risk = compliance?.risk || "—"
      const violations = Array.isArray(compliance?.violations) ? compliance.violations.length : 0
      const downloadUrl = result?.download_url || result?.download?.url || null
      const type = result?.page_count
        ? "PDF"
        : result?.pages
          ? "Image"
          : result?.results && result?.filename
            ? "Word"
            : result?.sheets
              ? "Sheet"
              : result?.metadata
                ? "DICOM"
                : result?.original && result?.redacted
                  ? "JSON/HL7"
                  : "—"
      return { filename, type, label, confidence, risk, violations, downloadUrl }
    })

    const filtered = mapped.filter((r) => {
      const q = query.toLowerCase().trim()
      if (!q) return true
      return `${r.filename} ${r.type} ${r.label} ${r.risk}`.toLowerCase().includes(q)
    })

    const sorted = [...filtered].sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1
      const getVal = (k: SortKey, row: any) => {
        if (k === "confidence") return row.confidence ?? -1
        if (k === "violations") return row.violations ?? 0
        return String(row[k] ?? "")
      }
      const va = getVal(sortBy, a)
      const vb = getVal(sortBy, b)
      if (va < vb) return -1 * dir
      if (va > vb) return 1 * dir
      return 0
    })

    return sorted
  }, [items, query, sortBy, sortDir])

  const toggleRow = (index: number) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(index)) {
      newExpanded.delete(index)
    } else {
      newExpanded.add(index)
    }
    setExpandedRows(newExpanded)
  }

  const getBeforeAfterContent = (result: any) => {
    // Handle different processor response formats
    if (result.original && result.redacted) {
      // JSON/HL7 processor
      return {
        original: typeof result.original === "string" ? result.original : JSON.stringify(result.original, null, 2),
        redacted: typeof result.redacted === "string" ? result.redacted : JSON.stringify(result.redacted, null, 2),
      }
    }

    if (result.original_pages && result.redacted_pages) {
      // PDF processor
      return {
        original: Array.isArray(result.original_pages)
          ? result.original_pages.join("\n\n--- Page Break ---\n\n")
          : result.original_pages,
        redacted: Array.isArray(result.redacted_pages)
          ? result.redacted_pages.join("\n\n--- Page Break ---\n\n")
          : result.redacted_pages,
      }
    }

    if (result.results && Array.isArray(result.results)) {
      // Word processor (multiple pages)
      const original = result.results
        .map((r: any, i: number) => `Page ${i + 1}:\n${r.original || ""}`)
        .join("\n\n--- Page Break ---\n\n")
      const redacted = result.results
        .map((r: any, i: number) => `Page ${i + 1}:\n${r.redacted || ""}`)
        .join("\n\n--- Page Break ---\n\n")
      return { original, redacted }
    }

    // Single content (Image, Sheet, etc.)
    return {
      original: result.original || "No original content available",
      redacted: result.redacted || "No redacted content available",
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <CardTitle className="text-pretty">Processed Files</CardTitle>
        <div className="flex items-center gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search files, type, risk…"
            className="w-48 rounded-md border bg-background px-2 py-1 text-sm"
            aria-label="Search results"
          />
          <ExportButton rows={rows} filename="medvault-results.csv" />
        </div>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-muted-foreground">
            <tr className="border-b">
              {[
                { key: "expand", label: "" },
                { key: "filename", label: "File" },
                { key: "type", label: "Type" },
                { key: "label", label: "Classification" },
                { key: "confidence", label: "Confidence" },
                { key: "risk", label: "Risk" },
                { key: "violations", label: "Violations" },
                { key: "download", label: "Download" },
              ].map((col) => (
                <th
                  key={col.key}
                  className={`py-2 ${col.key === "expand" ? "w-8" : ""} ${col.key === "download" || col.key === "expand" ? "" : "cursor-pointer select-none"}`}
                  onClick={() => {
                    if (col.key === "download" || col.key === "expand") return
                    const k = col.key as SortKey
                    setSortBy((prev) => (prev === k ? prev : k))
                    setSortDir((prev) => (sortBy === k ? (prev === "asc" ? "desc" : "asc") : "asc"))
                  }}
                >
                  {col.label}
                  {col.key === sortBy ? (sortDir === "asc" ? " ▲" : " ▼") : ""}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, idx) => {
              const item = items.find((item) => item.filename === r.filename)
              const isExpanded = expandedRows.has(idx)

              return (
                <React.Fragment key={idx}>
                  <tr key={idx} className="border-b hover:bg-[var(--color-muted)]/50">
                    <td className="py-2 pr-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleRow(idx)}
                        className="h-6 w-6 p-0"
                        aria-label={isExpanded ? "Collapse details" : "Expand details"}
                      >
                        {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                      </Button>
                    </td>
                    <td className="py-2 pr-2">{r.filename}</td>
                    <td className="py-2 pr-2">{r.type}</td>
                    <td className="py-2 pr-2">{r.label}</td>
                    <td className="py-2 pr-2">{r.confidence !== null ? (r.confidence * 100).toFixed(1) + "%" : "—"}</td>
                    <td className="py-2 pr-2">
                      <span className={r.risk === "high" ? "text-destructive" : r.risk === "low" ? "text-accent" : ""}>
                        {r.risk}
                      </span>
                    </td>
                    <td className="py-2 pr-2">{r.violations}</td>
                    <td className="py-2 pr-2">
                      {r.downloadUrl ? (
                        <a
                          className="text-primary underline"
                          href={apiUrl(r.downloadUrl)}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Download
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                  </tr>
                  {isExpanded && item && (
                    <tr>
                      <td colSpan={8} className="py-4 bg-[var(--color-muted)]/30">
                        <div className="space-y-4">
                          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                            <Eye className="h-4 w-4" />
                            Before & After Redaction Comparison
                          </div>
                          <div className="grid gap-4 md:grid-cols-2">
                            {(() => {
                              const content = getBeforeAfterContent(item.result)
                              return (
                                <>
                                  <div className="space-y-2">
                                    <h4 className="text-sm font-medium text-foreground">Original Content</h4>
                                    <div className="max-h-64 overflow-y-auto rounded-md border bg-background p-3 text-xs font-mono">
                                      <pre className="whitespace-pre-wrap break-words">{content.original}</pre>
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <h4 className="text-sm font-medium text-foreground">Redacted Content</h4>
                                    <div className="max-h-64 overflow-y-auto rounded-md border bg-background p-3 text-xs font-mono">
                                      <pre className="whitespace-pre-wrap break-words">{content.redacted}</pre>
                                    </div>
                                  </div>
                                </>
                              )
                            })()}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              )
            })}
          </tbody>
        </table>
      </CardContent>
    </Card>
  )
}
