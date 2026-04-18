export function getGuestId(): string {
  if (typeof window === "undefined") return ""
  const key = "guest_id"
  let id = localStorage.getItem(key)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(key, id)
  }
  return id
}
