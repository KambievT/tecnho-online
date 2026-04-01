// INTERNAL_API_URL — for server-side (SSR) calls inside Docker network
// NEXT_PUBLIC_API_URL — for client-side (browser) calls
const isServer = typeof window === "undefined";
const API_URL = isServer
  ? process.env.INTERNAL_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://5.42.117.178/api"
  : process.env.NEXT_PUBLIC_API_URL || "/api";

/** API base URL for use in server components */
export function getApiUrl(): string {
  return API_URL;
}

interface FetchOptions extends RequestInit {
  token?: string;
}

export async function apiFetch<T>(
  path: string,
  options: FetchOptions = {},
): Promise<T> {
  const { token, headers, ...rest } = options;

  const res = await fetch(`${API_URL}${path}`, {
    headers: {
      ...(rest.body instanceof FormData
        ? {}
        : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    ...rest,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `API error ${res.status}`);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}
