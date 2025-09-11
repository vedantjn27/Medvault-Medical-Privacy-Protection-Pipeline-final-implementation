"use client"

import type React from "react"
import { useEffect, useState } from "react"

export function HelpModal({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "?") setOpen((o) => !o)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b") {
        e.preventDefault()
        window.location.href = "/blockchain"
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  return (
    <>
      <span onClick={() => setOpen(true)} role="button" aria-haspopup="dialog">
        {children}
      </span>
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-lg rounded-lg bg-[var(--color-background)] p-5 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3">
              <h2 className="text-lg font-semibold">Keyboard shortcuts</h2>
              <p className="text-sm text-[var(--color-muted-foreground)]">Press “?” to toggle this help.</p>
            </div>
            <ul className="space-y-2 text-sm">
              <li>
                <kbd className="rounded border px-1">?</kbd> Toggle help
              </li>
              <li>
                <kbd className="rounded border px-1">Ctrl/Cmd</kbd> + <kbd className="rounded border px-1">B</kbd>{" "}
                Blockchain
              </li>
            </ul>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setOpen(false)}
                className="rounded-md border border-[var(--color-border)] px-3 py-1.5 text-sm hover:bg-[var(--color-muted)]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
