export function isTokenExpired(token: string): boolean {
  try {
    const rawPayload = token.split(".")[1];
    if (!rawPayload) return true;

    const normalized = rawPayload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), "=");
    const payload = JSON.parse(atob(padded)) as { exp?: number };

    return typeof payload.exp !== "number" || payload.exp * 1000 <= Date.now();
  } catch {
    return true;
  }
}
