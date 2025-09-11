"use client"

import { useEffect, useState } from "react"
import { Sun, Moon } from "lucide-react"

export function ThemeSwitcher() {
  const [theme, setTheme] = useState<"light" | "dark">("light")

  useEffect(() => {
    const saved = (localStorage.getItem("medvault-theme") as "light" | "dark") || "light"
    setTheme(saved)
    const el = document.documentElement
    if (saved === "dark") el.classList.add("dark")
    else el.classList.remove("dark")
  }, [])

  function toggle() {
    const next = theme === "light" ? "dark" : "light"
    setTheme(next)
    const el = document.documentElement
    if (next === "dark") el.classList.add("dark")
    else el.classList.remove("dark")
    localStorage.setItem("medvault-theme", next)
  }

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      onClick={toggle}
      className="inline-flex items-center gap-2 rounded-md border border-[var(--color-border)] px-3 py-1.5 text-sm hover:bg-[var(--color-muted)]"
    >
      {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
      <span className="hidden sm:inline">{theme === "light" ? "Dark" : "Light"}</span>
    </button>
  )
}
