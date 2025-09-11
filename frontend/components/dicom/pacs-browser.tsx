"use client"

import useSWR from "swr"
import { useMemo, useState } from "react"
import dynamic from "next/dynamic"

type Study = {
  StudyDate: string
  StudyTime: string
  Modality: string
  PatientName: string
  StudyURL: string
}
type StudiesResponse = { count: number; studies: Study[] }
type SeriesItem = {
  SeriesInstanceUID: string
  SeriesDescription: string
  Modality: string
  BodyPartExamined: string
}
type SeriesResponse = { studyId: string; count: number; series: SeriesItem[] }

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

async function fetcher(url: string) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Request failed ${res.status}`)
  return res.json()
}

export function PacsBrowser() {
  const {
    data: studiesData,
    error: studiesError,
    isLoading: studiesLoading,
  } = useSWR<StudiesResponse>(`${API_BASE}/pacs/studies`, fetcher)
  const [selected, setSelected] = useState<string | null>(null)

  const {
    data: seriesData,
    error: seriesError,
    isLoading: seriesLoading,
  } = useSWR<SeriesResponse>(
    selected ? `${API_BASE}/pacs/studies/${encodeURIComponent(selected)}/series` : null,
    fetcher,
  )

  const ModalityChart = dynamic(() => import("./modality-chart").then((m) => m.ModalityChart), { ssr: false })

  const modalityCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    ;(studiesData?.studies || []).forEach((s) => {
      counts[s.Modality] = (counts[s.Modality] || 0) + 1
    })
    return Object.entries(counts).map(([modality, count]) => ({ modality, count }))
  }, [studiesData])

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-md border bg-card p-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-foreground">Studies</h3>
          {studiesLoading ? <span className="text-xs text-muted-foreground">Loading…</span> : null}
        </div>
        {studiesError ? <p className="mt-2 text-sm text-destructive">Failed to load studies.</p> : null}
        <ul className="mt-2 max-h-60 overflow-auto rounded-md border bg-background">
          {(studiesData?.studies || []).map((s) => {
            const studyId = s.StudyURL.split("/").pop() || s.StudyURL
            const active = selected === studyId
            return (
              <li
                key={studyId}
                className={`flex cursor-pointer items-center justify-between gap-3 border-b px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground ${active ? "bg-accent/60" : ""}`}
                onClick={() => setSelected(studyId)}
                aria-label={`Select study ${studyId}`}
              >
                <div className="min-w-0">
                  <p className="truncate font-medium">{s.PatientName}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {s.Modality} • {s.StudyDate} {s.StudyTime}
                  </p>
                </div>
                <span className="rounded bg-primary/10 px-2 py-0.5 text-[11px] text-primary">{s.Modality}</span>
              </li>
            )
          })}
          {studiesData && studiesData.studies.length === 0 ? (
            <li className="px-3 py-2 text-sm text-muted-foreground">No studies found.</li>
          ) : null}
        </ul>
      </div>

      <div className="rounded-md border bg-card p-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-foreground">Series</h3>
          {seriesLoading && selected ? <span className="text-xs text-muted-foreground">Loading…</span> : null}
        </div>
        {seriesError ? <p className="mt-2 text-sm text-destructive">Failed to load series.</p> : null}
        {selected ? (
          <ul className="mt-2 max-h-60 overflow-auto rounded-md border bg-background">
            {(seriesData?.series || []).map((ser) => (
              <li key={ser.SeriesInstanceUID} className="border-b px-3 py-2">
                <p className="text-sm font-medium text-foreground">{ser.SeriesDescription}</p>
                <p className="text-xs text-muted-foreground">
                  {ser.Modality} • {ser.BodyPartExamined} • UID: {ser.SeriesInstanceUID}
                </p>
              </li>
            ))}
            {seriesData && seriesData.series.length === 0 ? (
              <li className="px-3 py-2 text-sm text-muted-foreground">No series available for this study.</li>
            ) : null}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground">Select a study to view series.</p>
        )}
      </div>

      <div className="rounded-md border bg-card p-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-foreground">Modality Distribution</h3>
        </div>
        <div className="mt-3">
          <ModalityChart data={modalityCounts} />
        </div>
      </div>
    </div>
  )
}
