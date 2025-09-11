"use client"

import type React from "react"
import { useState, useMemo, useCallback } from "react"
import { apiUrl } from "@/lib/api"
import { saveBatch } from "@/lib/storage"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import type { UploadProgress } from "@/types"
import { ProgressPanel } from "./progress-panel"
import { useRouter } from "next/navigation"

export function UploadForm() {
  const router = useRouter()
  const [files, setFiles] = useState<FileList | null>(null)
  const [privacyMode, setPrivacyMode] = useState("research")
  const [user, setUser] = useState("admin")
  const [loading, setLoading] = useState(false)
  const [batchId, setBatchId] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)

  const disabled = useMemo(() => !files || files.length === 0 || loading, [files, loading])

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      setDragging(false)
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const dt = new DataTransfer()
        if (files) {
          Array.from(files).forEach((f) => dt.items.add(f))
        }
        Array.from(e.dataTransfer.files).forEach((f) => dt.items.add(f))
        setFiles(dt.files)
      }
    },
    [files],
  )

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const dt = new DataTransfer()
        if (files) {
          Array.from(files).forEach((f) => dt.items.add(f))
        }
        Array.from(e.target.files).forEach((f) => dt.items.add(f))
        setFiles(dt.files)
      }
    },
    [files],
  )

  const removeFile = useCallback(
    (index: number) => {
      if (!files) return
      const dt = new DataTransfer()
      Array.from(files).forEach((f, i) => {
        if (i !== index) dt.items.add(f)
      })
      setFiles(dt.files.length > 0 ? dt.files : null)
    },
    [files],
  )

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!files || files.length === 0) return
    setLoading(true)

    const form = new FormData()
    Array.from(files).forEach((f) => form.append("files", f))
    form.append("privacy_mode", privacyMode)
    form.append("user", user)

    const res = await fetch(apiUrl("/upload"), {
      method: "POST",
      body: form,
    })
    if (!res.ok) {
      setLoading(false)
      const t = await res.text()
      throw new Error(`Upload failed: ${t}`)
    }
    const data = (await res.json()) as { batch_id: string }
    setBatchId(data.batch_id)
  }

  function handleDone(data: UploadProgress) {
    saveBatch({
      id: data.batch_id,
      timestamp: Date.now(),
      results: data.results,
    })
    setLoading(false)
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <Label htmlFor="privacyMode">Privacy Mode</Label>
              <select
                id="privacyMode"
                className="mt-2 w-full rounded border bg-background px-3 py-2"
                value={privacyMode}
                onChange={(e) => setPrivacyMode(e.target.value)}
              >
                <option value="research">Research</option>
                <option value="patient">Patient</option>
                <option value="insurance">Insurance</option>
                <option value="legal">Legal</option>
              </select>
            </div>
            <div>
              <Label htmlFor="user">User</Label>
              <Input id="user" className="mt-2" value={user} onChange={(e) => setUser(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="files">Files</Label>
              <div
                onDragOver={(e) => {
                  e.preventDefault()
                  setDragging(true)
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={onDrop}
                className={`mt-2 rounded border p-3 transition ${
                  dragging ? "border-[var(--color-primary)] bg-[var(--color-muted)]" : ""
                }`}
              >
                <Input
                  id="files"
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png,.tiff,.dcm,.doc,.docx,.xlsx,.xls,.csv,.json,.hl7"
                  onChange={handleFileChange}
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Drag & drop or click to select files. Files will be added to your selection.
                </p>
              </div>
            </div>
          </div>

          {files && files.length > 0 ? (
            <ul className="divide-y rounded border">
              {Array.from(files).map((f, i) => (
                <li key={i} className="flex items-center justify-between gap-4 p-2 text-sm">
                  <span className="truncate">{f.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">{(f.size / 1024).toFixed(1)} KB</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(i)}
                      className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                    >
                      ×
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          ) : null}

          <div className="flex items-center gap-3">
            <Button type="submit" disabled={disabled}>
              {loading ? "Uploading..." : "Upload & Process"}
            </Button>
            {files && files.length > 0 && (
              <Button type="button" variant="outline" onClick={() => setFiles(null)}>
                Clear All
              </Button>
            )}
            <Button type="button" variant="secondary" onClick={() => router.push("/")}>
              Back to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>

      {batchId ? <ProgressPanel batchId={batchId} onDone={handleDone} /> : null}
    </form>
  )
}
