"use client"

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts"
import type { BlockchainBlock } from "@/types"

export function ViolationsPieChart({ blocks }: { blocks: BlockchainBlock[] }) {
  const withVio = blocks.filter((b) => (b.data?.violations?.length ?? 0) > 0).length
  const clean = blocks.length - withVio
  const data = [
    { name: "Violations", value: withVio },
    { name: "Clean", value: clean },
  ]
  const colors = ["var(--chart-2)", "var(--chart-3)"]

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie dataKey="value" data={data} outerRadius={90} innerRadius={50}>
            {data.map((_, i) => (
              <Cell key={i} fill={colors[i % colors.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
