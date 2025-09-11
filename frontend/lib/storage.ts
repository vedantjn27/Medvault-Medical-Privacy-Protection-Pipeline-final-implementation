export type StoredBatch = {
  id: string
  timestamp: number
  results: any[]
}

const KEY = "medvault:batches"

export function loadBatches(): StoredBatch[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as StoredBatch[]) : []
  } catch {
    return []
  }
}

export function saveBatch(batch: StoredBatch) {
  if (typeof window === "undefined") return
  const existing = loadBatches()

  const isDuplicate = existing.some((b) => b.id === batch.id)
  if (isDuplicate) {
    console.log("[v0] Skipping duplicate batch save:", batch.id)
    return
  }

  const merged = [batch, ...existing].slice(0, 20)
  localStorage.setItem(KEY, JSON.stringify(merged))
}

export function clearBatches() {
  if (typeof window === "undefined") return
  localStorage.removeItem(KEY)
}
