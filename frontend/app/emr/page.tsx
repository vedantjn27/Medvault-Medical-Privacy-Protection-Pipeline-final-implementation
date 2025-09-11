"use client"

import useSWR from "swr"
import { jsonFetch } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useMemo, useState } from "react"

function getPatientName(p: any) {
  const name = p?.name?.[0]
  if (!name) return "Unknown"
  const given = (name.given || []).join(" ")
  const family = name.family || ""
  return [given, family].filter(Boolean).join(" ")
}

export default function EMRPage() {
  const { data, error } = useSWR<any>("/emr/patients", (url) => jsonFetch<any>(url))
  const [q, setQ] = useState("")
  const [selected, setSelected] = useState<any | null>(null)

  const entries = data?.entry || []
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return entries
    return entries.filter((e: any) => {
      const p = e.resource
      return getPatientName(p).toLowerCase().includes(s) || (p.id || "").toLowerCase().includes(s)
    })
  }, [entries, q])

  if (error) {
    return (
      <main className="container mx-auto max-w-5xl px-4 py-8">
        <p className="text-red-600">Failed to load patients: {error.message}</p>
      </main>
    )
  }

  return (
    <main className="container mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-semibold text-balance mb-2">EMR Patients</h1>
      <p className="text-muted-foreground mb-4 text-pretty">Live data fetched from HAPI FHIR via your backend.</p>

      <div className="mb-4">
        <input
          placeholder="Search by name or ID…"
          className="w-full md:w-72 border rounded px-3 py-2 text-sm"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-pretty">Patients</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-muted-foreground">
              <tr className="border-b">
                <th className="py-2">Name</th>
                <th className="py-2">Gender</th>
                <th className="py-2">Birth Date</th>
                <th className="py-2">ID</th>
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 25).map((e: any, idx: number) => {
                const p = e.resource
                return (
                  <tr
                    key={idx}
                    className={`border-b cursor-pointer hover:bg-muted/50 ${selected?.id === p.id ? "bg-muted" : ""}`}
                    onClick={() => setSelected(p)}
                  >
                    <td className="py-2 pr-2">{getPatientName(p)}</td>
                    <td className="py-2 pr-2">{p.gender || "—"}</td>
                    <td className="py-2 pr-2">{p.birthDate || "—"}</td>
                    <td className="py-2 pr-2">{p.id || "—"}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {selected && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-pretty">Patient Detail: {getPatientName(selected)}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            <div className="text-sm space-y-1">
              <div>
                <span className="text-muted-foreground">ID: </span>
                {selected.id || "—"}
              </div>
              <div>
                <span className="text-muted-foreground">Gender: </span>
                {selected.gender || "—"}
              </div>
              <div>
                <span className="text-muted-foreground">Birth Date: </span>
                {selected.birthDate || "—"}
              </div>
            </div>
            <div className="md:col-span-2">
              <pre className="bg-muted rounded p-3 text-xs overflow-auto max-h-80 whitespace-pre-wrap">
                {JSON.stringify(selected, null, 2)}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}
    </main>
  )
}
