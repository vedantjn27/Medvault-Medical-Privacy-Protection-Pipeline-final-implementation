"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2, AlertTriangle } from "lucide-react"
import type { VerifyResponse } from "@/types"

export function VerifyBanner({ verify, error }: { verify?: VerifyResponse; error?: Error }) {
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Verification failed</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    )
  }

  if (!verify) return null

  if (verify.valid) {
    return (
      <Alert>
        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
        <AlertTitle className="text-emerald-700">Chain verified</AlertTitle>
        <AlertDescription>{verify.message ?? "Blockchain integrity verified"}</AlertDescription>
      </Alert>
    )
  }

  return (
    <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Chain compromised</AlertTitle>
      <AlertDescription>{verify.error ?? "Integrity checks failed"}</AlertDescription>
    </Alert>
  )
}
