export const capitalize = (word: string) =>
  word ? `${word[0].toUpperCase()}${word.slice(1)}` : word

export const initials = (name?: string | null, fallback?: string | null) => {
  const source = (name || fallback || "?").trim()
  const parts = source.split(/[\s@.]+/).filter(Boolean)
  return ((parts[0]?.[0] ?? "?") + (parts[1]?.[0] ?? "")).toUpperCase()
}

export const firstName = (name?: string | null) => name?.trim().split(/\s+/)[0]

export default {}
