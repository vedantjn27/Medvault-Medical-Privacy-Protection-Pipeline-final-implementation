"use client"

import dynamic from "next/dynamic"
import { useState } from "react"

export default function DicomPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground text-balance">DICOM / PACS Viewer</h1>
        <p className="text-sm text-muted-foreground">
          Upload DICOM files for redaction and browse PACS studies/series.
        </p>
      </header>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-lg border bg-card p-4">
          <h2 className="mb-2 text-lg font-medium text-foreground">Upload & Redact DICOM</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            We remove PII tags on-device using your backend and provide a secure download.
          </p>
          {/* DICOM Upload */}
          {/* Keeping components split for maintainability */}
          <DicomUpload />
        </div>

        <div className="rounded-lg border bg-card p-4">
          <h2 className="mb-2 text-lg font-medium text-foreground">PACS Browser</h2>
          <p className="mb-4 text-sm text-muted-foreground">Explore studies and series via your PACS endpoints.</p>
          {/* PACS Browser */}
          <PacsBrowser />
        </div>
      </section>

      <section className="mt-6 rounded-lg border bg-card p-4">
        <QuickDicomUrlViewer />
      </section>
    </main>
  )
}

// Lazy-load client components
const DicomUpload = dynamic(() => import("@/components/dicom/dicom-upload").then((m) => m.DicomUpload), { ssr: false })
const PacsBrowser = dynamic(() => import("@/components/dicom/pacs-browser").then((m) => m.PacsBrowser), { ssr: false })
const DicomViewer = dynamic(() => import("@/components/dicom/dicom-viewer").then((m) => m.DicomViewer), { ssr: false })

function QuickDicomUrlViewer() {
  const [url, setUrl] = useState("")

  return (
    <div>
      <h2 className="mb-2 text-lg font-medium text-foreground">Render DICOM by Download URL</h2>
      <p className="text-sm text-muted-foreground mb-3">
        Paste a DICOM download URL returned by the upload flow, then render inline with CornerstoneJS.
      </p>
      <div className="flex flex-col md:flex-row gap-3">
        <input
          className="flex-1 border rounded px-3 py-2 text-sm"
          placeholder="/download/your-redacted-file.dcm or full URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      </div>
      {url ? (
        <div className="mt-3">
          <DicomViewer downloadPath={url} />
        </div>
      ) : null}
    </div>
  )
}
