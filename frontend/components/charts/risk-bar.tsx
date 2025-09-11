"use client"

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

export function RiskBar({ high, low }: { high: number; low: number }) {
  const data = [
    { name: "Low", value: low, fill: "var(--color-accent)" },
    { name: "High", value: high, fill: "var(--color-destructive)" },
  ]
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="value" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
