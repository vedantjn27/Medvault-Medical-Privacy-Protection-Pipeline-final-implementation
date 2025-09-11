export function getPrefsClient() {
  if (typeof window === "undefined") {
    return { privacyMode: "research", user: "admin" }
  }
  try {
    return {
      privacyMode:
        (localStorage.getItem("medvault.privacyMode") as "research" | "patient" | "insurance" | "legal") || "research",
      user: localStorage.getItem("medvault.user") || "admin",
    }
  } catch {
    return { privacyMode: "research", user: "admin" }
  }
}
