"use client"

import useSWR from "swr"
import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { BlockchainBlock, VerifyResponse } from "@/types"
import { VerifyBanner } from "@/components/blockchain/verify-banner"
import { ActionsBarChart } from "@/components/blockchain/actions-bar-chart"
import { ViolationsPieChart } from "@/components/blockchain/violations-pie-chart"
import { fetcherJSON } from "@/lib/api"

function SummaryCards({ blocks }: { blocks: BlockchainBlock[] }) {
  const stats = useMemo(() => {
    const total = blocks.length
    const latest = blocks[blocks.length - 1]
    const violations = blocks.reduce((acc, b) => acc + ((b.data?.violations?.length ?? 0) > 0 ? 1 : 0), 0)
    return { total, latestTs: latest?.timestamp, latestIdx: latest?.index, violations }
  }, [blocks])

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="py-3">
          <CardTitle className="text-sm text-muted-foreground">Total Blocks</CardTitle>
        </CardHeader>
        <CardContent className="text-2xl font-semibold">{stats.total}</CardContent>
      </Card>
      <Card>
        <CardHeader className="py-3">
          <CardTitle className="text-sm text-muted-foreground">Latest Index</CardTitle>
        </CardHeader>
        <CardContent className="text-2xl font-semibold">{stats.latestIdx ?? "-"}</CardContent>
      </Card>
      <Card>
        <CardHeader className="py-3">
          <CardTitle className="text-sm text-muted-foreground">Latest Timestamp</CardTitle>
        </CardHeader>
        <CardContent className="text-sm">{stats.latestTs ?? "-"}</CardContent>
      </Card>
      <Card>
        <CardHeader className="py-3">
          <CardTitle className="text-sm text-muted-foreground">Violations (Blocks)</CardTitle>
        </CardHeader>
        <CardContent className="text-2xl font-semibold">{stats.violations}</CardContent>
      </Card>
    </div>
  )
}

export default function BlockchainPage() {
  const {
    data: chainData,
    error: chainErr,
    isLoading,
  } = useSWR<{ chain: BlockchainBlock[] }>("/blockchain", fetcherJSON, { refreshInterval: 15000 })
  const { data: verifyData, error: verifyErr } = useSWR<VerifyResponse>("/blockchain/verify", fetcherJSON, {
    refreshInterval: 30000,
  })

  const blocks: BlockchainBlock[] = chainData?.chain ?? []

  return (
    <main className="container mx-auto p-4 space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-balance">Blockchain Explorer</h1>
        <Badge variant="outline" className="text-xs">
          Live refresh
        </Badge>
      </div>

      <VerifyBanner verify={verifyData} error={verifyErr as any} />

      {isLoading ? (
        <div className="text-muted-foreground">Loading chain...</div>
      ) : chainErr ? (
        <div className="text-red-600">Failed to load blockchain</div>
      ) : (
        <>
          <SummaryCards blocks={blocks} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Actions Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ActionsBarChart blocks={blocks} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Violations</CardTitle>
              </CardHeader>
              <CardContent>
                <ViolationsPieChart blocks={blocks} />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Chain</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Doc ID</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Violations</TableHead>
                    <TableHead>Prev Hash</TableHead>
                    <TableHead>Hash</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {blocks.map((b) => {
                    const prev = (b.previous_hash || b.previousHash || "").toString()
                    const prevShort = prev ? `${prev.slice(0, 8)}…${prev.slice(-6)}` : "-"
                    const hashShort = b.hash ? `${b.hash.slice(0, 8)}…${b.hash.slice(-6)}` : "-"
                    const vio = b.data?.violations ?? []
                    return (
                      <TableRow key={`${b.index}-${b.hash}`}>
                        <TableCell className="font-mono">{b.index}</TableCell>
                        <TableCell className="text-sm">{b.timestamp}</TableCell>
                        <TableCell className="text-sm">{b.data?.doc_id || "-"}</TableCell>
                        <TableCell className="text-sm">{b.data?.action || "-"}</TableCell>
                        <TableCell className="text-sm">{b.data?.user || "-"}</TableCell>
                        <TableCell>
                          {vio.length > 0 ? (
                            <Badge className="bg-red-600/90 hover:bg-red-600 text-white">{vio.length}</Badge>
                          ) : (
                            <Badge variant="secondary">0</Badge>
                          )}
                        </TableCell>
                        <TableCell className="font-mono text-xs">{prevShort}</TableCell>
                        <TableCell className="font-mono text-xs">{hashShort}</TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </main>
  )
}
