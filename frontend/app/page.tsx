"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SummaryCards } from "@/components/summary-cards"
import { ClassificationPie } from "@/components/charts/classification-pie"
import { RiskBar } from "@/components/charts/risk-bar"
import { FileTypeBar } from "@/components/charts/filetype-bar"
import { loadBatches, clearBatches } from "@/lib/storage"
import { useMemo, useState, useEffect } from "react"
import { ExportButton } from "@/components/ui/export-button"

type FlatItem = { filename: string; result: any }

export default function DashboardPage() {
  const [items, setItems] = useState<FlatItem[]>([])
  const [showOnlyHigh, setShowOnlyHigh] = useState(false)

  useEffect(() => {
    const batches = loadBatches()
    const flattened: FlatItem[] = []
    for (const b of batches) {
      for (const entry of b.results) {
        const [filename, result] = Object.entries(entry)[0] as [string, any]
        flattened.push({ filename, result })
      }
    }
    setItems(flattened)
  }, [])

  // Filter view (client-only)
  const viewItems = useMemo(
    () => (showOnlyHigh ? items.filter((it) => it.result?.compliance?.risk === "high") : items),
    [items, showOnlyHigh],
  )

  const { total, high, low, typeCounts, classCounts } = useMemo(() => {
    const typeCounts: Record<string, number> = {}
    const classCounts: Record<string, number> = {}
    let high = 0
    let low = 0
    for (const it of viewItems) {
      const res = it.result
      const compliance = res?.compliance
      if (compliance?.risk === "high") high++
      else if (compliance?.risk === "low") low++

      const label = res?.classification?.label || "unknown"
      classCounts[label] = (classCounts[label] || 0) + 1

      const typeGuess = res?.page_count
        ? "pdf"
        : res?.pages
          ? "image"
          : res?.results && res?.filename
            ? "word"
            : res?.sheets
              ? "sheet"
              : res?.metadata
                ? "dicom"
                : res?.original && res?.redacted
                  ? "json/hl7"
                  : "other"
      typeCounts[typeGuess] = (typeCounts[typeGuess] || 0) + 1
    }
    return { total: viewItems.length, high, low, typeCounts, classCounts }
  }, [viewItems])

  const classData = useMemo(() => Object.entries(classCounts).map(([name, value]) => ({ name, value })), [classCounts])

  // CSV export (client-only)
  const csvRows = useMemo(() => {
    return viewItems.map(({ filename, result }) => {
      const risk = result?.compliance?.risk ?? ""
      const violations = (result?.compliance?.violations ?? []).join(";")
      const label = result?.classification?.label ?? ""
      const confidence = result?.classification?.confidence ?? ""
      const pageCount = result?.page_count ?? result?.pages ?? ""
      const typeGuess = result?.page_count
        ? "pdf"
        : result?.pages
          ? "image"
          : result?.results && result?.filename
            ? "word"
            : result?.sheets
              ? "sheet"
              : result?.metadata
                ? "dicom"
                : result?.original && result?.redacted
                  ? "json/hl7"
                  : "other"
      return { filename, type: typeGuess, risk, violations, label, confidence, pageCount }
    })
  }, [viewItems])

  return (
    <main className="container mx-auto max-w-6xl px-4 py-8">
      {/* Hero banner with subtle healthcare image and copy */}
      <div className="relative mb-8 overflow-hidden rounded-lg border">
        <div className="absolute inset-0">
          <img
            src="/images/health-abstract.png"
            alt=""
            className="h-full w-full object-cover opacity-15"
            aria-hidden="true"
          />
        </div>
        <div className="relative grid gap-3 p-6 sm:p-8">
          <h1 className="text-2xl md:text-3xl font-semibold text-balance">MedVault – Trusted Healthcare Privacy</h1>
          <p className="max-w-2xl text-pretty text-muted-foreground">
            Process and de-identify medical documents with confidence. Visualize risk, audit trails, and classifications
            powered by your backend.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Button asChild>
              <Link href="/upload">Upload & Process Documents</Link>
            </Button>
            <Button variant="secondary" asChild>
              <Link href="/emr">EMR Patients</Link>
            </Button>
            <Button variant="secondary" asChild>
              <Link href="/labs">Lab Observations</Link>
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                clearBatches()
                location.reload()
              }}
            >
              Clear Local Session
            </Button>

            {/* Client-only enhancements */}
            <div className="ml-auto flex items-center gap-2">
              <label className="text-sm text-muted-foreground inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-[var(--color-primary)]"
                  checked={showOnlyHigh}
                  onChange={(e) => setShowOnlyHigh(e.target.checked)}
                />
                High risk only
              </label>
              <ExportButton rows={csvRows} filename="medvault-results.csv" />
            </div>
          </div>
        </div>
      </div>

      {/* Keep the rest of the dashboard unchanged */}
      <div className="space-y-6">
        <SummaryCards totalFiles={total} highRisk={high} lowRisk={low} />

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-pretty">Classification Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              {classData.length > 0 ? (
                <ClassificationPie data={classData} />
              ) : (
                <p className="text-sm text-muted-foreground">No data yet. Process documents to see charts.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-pretty">Risk Overview</CardTitle>
            </CardHeader>
            <CardContent>
              {total > 0 ? (
                <RiskBar high={high} low={low} />
              ) : (
                <p className="text-sm text-muted-foreground">No data yet. Process documents to see charts.</p>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-pretty">File Types Processed</CardTitle>
          </CardHeader>
          <CardContent>
            {total > 0 ? (
              <FileTypeBar counts={typeCounts} />
            ) : (
              <p className="text-sm text-muted-foreground">No files processed yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
