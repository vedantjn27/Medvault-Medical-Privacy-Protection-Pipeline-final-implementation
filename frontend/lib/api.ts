export const API_BASE =
  (typeof window !== "undefined" && (window as any).__MEDVAULT_API_BASE__) ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:8000"

export function apiUrl(path: string) {
  return `${API_BASE}${path.startsWith("/") ? path : `/${path}`}`
}

export async function jsonFetch<T>(input: string, init?: RequestInit): Promise<T> {
  const res = await fetch(apiUrl(input), {
    ...init,
    headers: {
      ...(init?.headers || {}),
    },
    cache: "no-store",
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Request failed: ${res.status} ${text}`)
  }
  return res.json()
}

export const fetcher = async <T = any>(path: string): Promise<T> => {
  return jsonFetch<T>(path)
}

export const fetcherJSON = async <T = any>(path: string): Promise<T> => jsonFetch<T>(path)
