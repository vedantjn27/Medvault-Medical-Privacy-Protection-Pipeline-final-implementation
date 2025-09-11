"use client"

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

export function FileTypeBar({ counts }: { counts: Record<string, number> }) {
  const data = Object.entries(counts).map(([k, v]) => ({
    type: k.toUpperCase(),
    value: v,
    fill: "var(--color-primary)",
  }))
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="type" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="value" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
