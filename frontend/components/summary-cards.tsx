"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldCheck, FileText, AlertTriangle } from "lucide-react"

type Props = {
  totalFiles: number
  highRisk: number
  lowRisk: number
}

export function SummaryCards({ totalFiles, highRisk, lowRisk }: Props) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground">Total Files Processed</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div className="text-3xl font-semibold">{totalFiles}</div>
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
            <FileText className="h-4 w-4" />
          </span>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground">Low Risk</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div className="text-3xl font-semibold text-accent">{lowRisk}</div>
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
            <ShieldCheck className="h-4 w-4" />
          </span>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground">High Risk</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div className="text-3xl font-semibold text-destructive">{highRisk}</div>
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-destructive)]/10 text-[var(--color-destructive)]">
            <AlertTriangle className="h-4 w-4" />
          </span>
        </CardContent>
      </Card>
    </div>
  )
}
