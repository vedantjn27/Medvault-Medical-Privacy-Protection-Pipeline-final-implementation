export type PrivacyMode = "patient" | "research" | "insurance" | "legal"

export type Classification = {
  label: string
  confidence: number
  scores: Record<string, number>
  evidence: string[]
}

export type ComplianceInfo = {
  violations: string[]
  risk: "high" | "low"
  audit_log: {
    doc_id: string
    action: string
    user: string
    timestamp: string
    fingerprint: string
  }
  blockchain_hash: string
}

export type UploadResponse = {
  batch_id: string
  results: Array<Record<string, any>>
}

export type UploadProgress = {
  batch_id: string
  processed: number
  total: number
  results: Array<Record<string, any>>
}

export type BlockchainBlock = {
  index: number
  timestamp: string
  data?: {
    doc_id?: string
    action?: string
    user?: string
    violations?: string[]
  }
  previous_hash?: string
  previousHash?: string
  hash: string
}

export type VerifyResponse = {
  valid: boolean
  message?: string
  error?: string
}
