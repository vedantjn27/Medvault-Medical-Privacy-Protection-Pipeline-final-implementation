"use client"
import type React from "react"
import { createContext, useContext, useEffect, useMemo, useState } from "react"

type PrivacyMode = "research" | "patient" | "insurance" | "legal"
type Prefs = {
  privacyMode: PrivacyMode
  user: string
  setPrivacyMode: (m: PrivacyMode) => void
  setUser: (u: string) => void
}

const PrefsContext = createContext<Prefs | null>(null)

export function PrefsProvider({ children }: { children: React.ReactNode }) {
  const [privacyMode, setPrivacyMode] = useState<PrivacyMode>("research")
  const [user, setUser] = useState<string>("admin")

  useEffect(() => {
    try {
      const pm = (localStorage.getItem("medvault.privacyMode") as PrivacyMode | null) || "research"
      const u = localStorage.getItem("medvault.user") || "admin"
      setPrivacyMode(pm)
      setUser(u)
    } catch {}
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem("medvault.privacyMode", privacyMode)
      localStorage.setItem("medvault.user", user)
    } catch {}
  }, [privacyMode, user])

  const value = useMemo(() => ({ privacyMode, user, setPrivacyMode, setUser }), [privacyMode, user])

  return <PrefsContext.Provider value={value}>{children}</PrefsContext.Provider>
}

export function usePrefs() {
  const ctx = useContext(PrefsContext)
  if (!ctx) throw new Error("usePrefs must be used within PrefsProvider")
  return ctx
}
