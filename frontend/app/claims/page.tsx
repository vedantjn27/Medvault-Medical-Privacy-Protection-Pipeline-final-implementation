"use client"
import useSWR from "swr"
import { fetcher } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts"

export default function ClaimsPage() {
  const { data, error, isLoading } = useSWR("/insurance/claims", fetcher)
  const rows: any[] = Array.isArray(data) ? data : []

  const byStatus = rows.reduce<Record<string, number>>((acc, r) => {
    const k = (r.status || "unknown").toLowerCase()
    acc[k] = (acc[k] || 0) + 1
    return acc
  }, {})
  const chartData = Object.entries(byStatus).map(([name, value]) => ({ name, value }))
  const COLORS = ["var(--color-chart-1)", "var(--color-chart-2)", "var(--color-chart-3)", "var(--color-chart-4)"]

  return (
    <main className="container mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-semibold">Insurance Claims</h1>
      <p className="text-sm text-muted-foreground">Live data from your backend.</p>

      {isLoading && <p className="mt-4 text-sm">Loading...</p>}
      {error && <p className="mt-4 text-sm text-destructive">Failed to load claims.</p>}

      <div className="mt-4 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>By Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={chartData} dataKey="value" nameKey="name" outerRadius={90} innerRadius={40}>
                    {chartData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="p-3 text-left">ID</th>
                    <th className="p-3 text-left">Patient</th>
                    <th className="p-3 text-left">Amount</th>
                    <th className="p-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r: any) => (
                    <tr key={r.id} className="border-t border-border">
                      <td className="p-3">{r.id}</td>
                      <td className="p-3">{r.patient}</td>
                      <td className="p-3">₹{r.amount}</td>
                      <td className="p-3 capitalize">{r.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
