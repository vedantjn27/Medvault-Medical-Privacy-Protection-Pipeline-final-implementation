"use client"

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
import type { BlockchainBlock } from "@/types"

export function ActionsBarChart({ blocks }: { blocks: BlockchainBlock[] }) {
  const map: Record<string, number> = {}
  blocks.forEach((b) => {
    const a = b.data?.action || "unknown"
    map[a] = (map[a] || 0) + 1
  })
  const data = Object.entries(map).map(([name, value]) => ({ name, value }))
  if (data.length === 0) return <div className="text-sm text-muted-foreground">No actions yet.</div>

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="value" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
