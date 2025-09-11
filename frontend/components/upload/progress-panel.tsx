"use client"

import useSWR from "swr"
import { jsonFetch } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { UploadProgress } from "@/types"
import { useRef } from "react"
import { useEffect } from "react"

export function ProgressPanel({
  batchId,
  onDone,
}: {
  batchId: string
  onDone?: (data: UploadProgress) => void
}) {
  const completedRef = useRef(false)

  const { data } = useSWR<UploadProgress>(
    batchId ? `/upload/progress/${batchId}` : null,
    (url) => jsonFetch<UploadProgress>(url),
    { refreshInterval: 1200 },
  )

  const processed = data?.processed ?? 0
  const total = data?.total ?? 0
  const pct = total > 0 ? Math.round((processed / total) * 100) : 0

  // ✅ only call onDone after render when conditions are met
  useEffect(() => {
    if (data && processed === total && total > 0 && onDone) {
      onDone(data)
    }
  }, [data, processed, total, onDone])


  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-pretty">Processing Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-2 text-sm text-muted-foreground">
          {processed} of {total} files processed
        </div>
        <div className="h-3 w-full rounded bg-muted">
          <div
            className="h-3 rounded bg-primary transition-all"
            style={{ width: `${pct}%` }}
            aria-valuenow={pct}
            aria-valuemin={0}
            aria-valuemax={100}
            role="progressbar"
          />
        </div>
      </CardContent>
    </Card>
  )
}
