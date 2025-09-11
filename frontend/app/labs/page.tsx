"use client"

import useSWR from "swr"
import { jsonFetch } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function LabsPage() {
  const [count, setCount] = useState(5)
  const [category, setCategory] = useState("laboratory")
  const { data, error, isLoading, mutate } = useSWR<any>(
    `/labs/observations?category=${encodeURIComponent(category)}&_count=${count}`,
    (url:any) => jsonFetch<any>(url),
  )

  return (
    <main className="container mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-semibold text-balance mb-2">Laboratory Observations</h1>
      <p className="text-muted-foreground mb-6 text-pretty">
        Live observations from HAPI FHIR via your backend. Adjust category and count to fetch more.
      </p>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        {/* Category selector */}
        <label className="text-sm text-muted-foreground" htmlFor="cat">
          Category
        </label>
        <input
          id="cat"
          className="border rounded px-2 py-1 text-sm"
          value={category}
          onChange={(e) => {
            setCategory(e.target.value)
            mutate()
          }}
          placeholder="laboratory"
        />
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            onClick={() => {
              setCount((c) => Math.max(1, c - 5))
              mutate()
            }}
          >
            -5
          </Button>
          <span className="text-sm">Count: {count}</span>
          <Button
            variant="secondary"
            onClick={() => {
              setCount((c) => c + 5)
              mutate()
            }}
          >
            +5
          </Button>
        </div>
      </div>

      {error ? <p className="text-red-600">Failed to load: {error.message}</p> : null}

      <Card>
        <CardHeader>
          <CardTitle className="text-pretty">Observations</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {isLoading ? <p className="text-sm text-muted-foreground">Loading...</p> : null}
          <table className="w-full text-sm">
            <thead className="text-left text-muted-foreground">
              <tr className="border-b">
                <th className="py-2">Code</th>
                <th className="py-2">Value</th>
                <th className="py-2">Unit</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {(data?.entry || []).map((e: any, i: number) => {
                const o = e.resource || {}
                const code = o.code?.text || o.code?.coding?.[0]?.display || "—"
                const val = o.valueQuantity?.value ?? o.valueString ?? o.valueCodeableConcept?.text ?? "—"
                const unit = o.valueQuantity?.unit ?? "—"
                return (
                  <tr key={i} className="border-b">
                    <td className="py-2 pr-2">{code}</td>
                    <td className="py-2 pr-2">{val}</td>
                    <td className="py-2 pr-2">{unit}</td>
                    <td className="py-2 pr-2">{o.status || "—"}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </main>
  )
}
