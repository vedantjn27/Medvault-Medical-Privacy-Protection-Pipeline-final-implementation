"use client"
import { useState } from "react"
import { usePathname } from "next/navigation"
import { usePrefs } from "@/components/prefs-context"
import Link from "next/link"
import { ThemeSwitcher } from "@/components/ui/theme-switcher"
import { HelpModal } from "@/components/ui/help-modal"

export function AppHeader() {
  const { privacyMode, setPrivacyMode, user, setUser } = usePrefs()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const isRoot = pathname === "/"
  const showBack = !isRoot

  const linkClass = (href: string) =>
    `px-2 py-1 rounded-md transition-colors ${
      pathname === href
        ? "text-foreground bg-[var(--color-muted)]"
        : "text-muted-foreground hover:text-foreground hover:bg-[var(--color-muted)]"
    }`

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <span className="h-6 w-6 rounded bg-[var(--color-primary)]" aria-hidden />
            <span className="font-semibold text-foreground">MedVault</span>
          </Link>

          {showBack && (
            <Link
              href="/"
              className="hidden md:inline-flex items-center text-sm text-muted-foreground hover:text-foreground hover:bg-[var(--color-muted)] px-2 py-1 rounded-md"
              aria-label="Back to Dashboard"
            >
              {"\u2190"} Back to Dashboard
            </Link>
          )}

          <nav className="hidden md:flex items-center gap-3 text-sm">
            <Link href="/upload" className={linkClass("/upload")}>
              Upload
            </Link>
            <Link href="/dicom" className={linkClass("/dicom")}>
              DICOM
            </Link>
            <Link href="/emr" className={linkClass("/emr")}>
              EMR
            </Link>
            <Link href="/labs" className={linkClass("/labs")}>
              Labs
            </Link>
            <Link href="/hl7" className={linkClass("/hl7")}>
              HL7
            </Link>
            <Link href="/claims" className={linkClass("/claims")}>
              Insurance
            </Link>
            <Link href="/audit" className={linkClass("/audit")}>
              Audit
            </Link>
            <Link href="/blockchain" className={linkClass("/blockchain")}>
              Blockchain
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          {showBack && (
            <Link
              href="/"
              className="md:hidden inline-flex items-center rounded-md border border-[var(--color-border)] px-2 py-1 text-sm hover:bg-[var(--color-muted)]"
              aria-label="Back to Dashboard"
              title="Back to Dashboard"
            >
              {"\u2190"} Back
            </Link>
          )}
          <ThemeSwitcher />
          <HelpModal>
            <button
              type="button"
              className="inline-flex items-center rounded-md border border-[var(--color-border)] px-2 py-1 text-sm hover:bg-[var(--color-muted)]"
              aria-label="Open help"
              title="Keyboard shortcuts (?)"
            >
              ?
            </button>
          </HelpModal>
          <div className="hidden sm:flex items-center gap-2 rounded-md border border-[var(--color-border)] px-2 py-1">
            <label className="text-sm text-muted-foreground" htmlFor="privacy">
              Privacy
            </label>
            <select
              id="privacy"
              className="rounded-md bg-background px-2 py-1 text-sm"
              value={privacyMode}
              onChange={(e) => setPrivacyMode(e.target.value as any)}
            >
              <option value="research">Research</option>
              <option value="patient">Patient</option>
              <option value="insurance">Insurance</option>
              <option value="legal">Legal</option>
            </select>
            <label className="text-sm text-muted-foreground ml-2" htmlFor="user">
              User
            </label>
            <input
              id="user"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              className="w-28 rounded-md bg-background px-2 py-1 text-sm"
              placeholder="username"
            />
          </div>
          <button
            type="button"
            className="md:hidden inline-flex items-center rounded-md border border-[var(--color-border)] px-2 py-1 text-sm hover:bg-[var(--color-muted)]"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            Menu
          </button>
        </div>
      </div>
      {open && (
        <nav id="mobile-nav" className="md:hidden border-t">
          <div className="mx-auto max-w-6xl px-4 py-2 grid gap-1">
            {showBack && (
              <Link onClick={() => setOpen(false)} href="/" className={linkClass("/")}>
                {"\u2190"} Back to Dashboard
              </Link>
            )}
            <Link onClick={() => setOpen(false)} href="/upload" className={linkClass("/upload")}>
              Upload
            </Link>
            <Link onClick={() => setOpen(false)} href="/dicom" className={linkClass("/dicom")}>
              DICOM
            </Link>
            <Link onClick={() => setOpen(false)} href="/emr" className={linkClass("/emr")}>
              EMR
            </Link>
            <Link onClick={() => setOpen(false)} href="/labs" className={linkClass("/labs")}>
              Labs
            </Link>
            <Link onClick={() => setOpen(false)} href="/hl7" className={linkClass("/hl7")}>
              HL7
            </Link>
            <Link onClick={() => setOpen(false)} href="/audit" className={linkClass("/audit")}>
              Audit
            </Link>
            <Link onClick={() => setOpen(false)} href="/blockchain" className={linkClass("/blockchain")}>
              Blockchain
            </Link>
            <div className="mt-2 flex items-center gap-2 rounded-md border border-[var(--color-border)] px-2 py-2">
              <label className="text-sm text-muted-foreground" htmlFor="privacy-mobile">
                Privacy
              </label>
              <select
                id="privacy-mobile"
                className="rounded-md bg-background px-2 py-1 text-sm"
                value={privacyMode}
                onChange={(e) => setPrivacyMode(e.target.value as any)}
              >
                <option value="research">Research</option>
                <option value="patient">Patient</option>
                <option value="insurance">Insurance</option>
                <option value="legal">Legal</option>
              </select>
              <label className="text-sm text-muted-foreground ml-2" htmlFor="user-mobile">
                User
              </label>
              <input
                id="user-mobile"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                className="w-28 rounded-md bg-background px-2 py-1 text-sm"
                placeholder="username"
              />
            </div>
          </div>
        </nav>
      )}
    </header>
  )
}
