"use client"

export function ExportButton({ rows, filename = "export.csv" }: { rows: any[]; filename?: string }) {
  function toCSV(data: any[]) {
    if (!data?.length) return ""
    const headers = Array.from(
      data.reduce<Set<string>>((acc, row) => {
        Object.keys(row).forEach((k) => acc.add(k))
        return acc
      }, new Set()),
    )
    const escape = (v: any) =>
      `"${String(v ?? "")
        .replace(/"/g, '""')
        .replace(/\n/g, " ")
        .replace(/\r/g, " ")}"`
    const out = [headers.map(escape).join(","), ...data.map((row) => headers.map((h) => escape(row[h])).join(","))]
    return out.join("\n")
  }

  function download() {
    const csv = toCSV(rows)
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <button
      onClick={download}
      type="button"
      className="inline-flex items-center rounded-md border border-[var(--color-border)] px-3 py-1.5 text-sm hover:bg-[var(--color-muted)]"
      aria-label="Export table to CSV"
    >
      Export CSV
    </button>
  )
}
