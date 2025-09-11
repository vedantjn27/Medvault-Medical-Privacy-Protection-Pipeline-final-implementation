"use client"

import { UploadForm } from "@/components/upload/uploadform"
import { ResultsTable } from "@/components/results/results-table"
import { loadBatches } from "@/lib/storage"
import { useEffect, useState } from "react"

type FlatItem = { filename: string; result: any }

export default function UploadPage() {
  const [items, setItems] = useState<FlatItem[]>([])

  useEffect(() => {
    const batches = loadBatches()
    const latest = batches[0]
    if (!latest) return
    const flattened: FlatItem[] = []
    for (const entry of latest.results) {
      const [filename, result] = Object.entries(entry)[0] as [string, any]
      flattened.push({ filename, result })
    }
    setItems(flattened)
  }, [])

  return (
    <main className="container mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-semibold text-balance mb-2">Upload & Process Documents</h1>
      <p className="text-muted-foreground mb-6 text-pretty">
        Select multiple files, choose privacy mode and user, then process. Progress and results are updated live.
      </p>

      <UploadForm />

      <div className="mt-8">{items.length > 0 ? <ResultsTable items={items} /> : null}</div>
    </main>
  )
}
