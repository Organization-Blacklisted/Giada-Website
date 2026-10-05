// Shared response envelope — update once the real Laravel API contract is known.
export type ApiResponse<T> = {
  success: boolean;
  data: T;
};

// Carries the HTTP status so callers can tell "genuinely not found" (404)
// apart from a transient network/server failure — the two should not be
// treated the same way (e.g. one deserves notFound(), the other doesn't).
export class ApiError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export function isNotFoundError(err: unknown): boolean {
  return err instanceof ApiError && err.status === 404;
}

type FetchOptions = {
  revalidate?: number | false;
  tags?: string[];
};

const MAX_ATTEMPTS = 4; // 1 initial + 3 retries
const TIMEOUT_MS = 15_000; // abort a hung request so it can't stall a build
const RETRY_BASE_MS = 500; // exponential backoff base

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const backoff = (attempt: number) =>
  RETRY_BASE_MS * 2 ** (attempt - 1) + Math.floor(Math.random() * 300);

export async function apiFetch<T>(
  endpoint: string,
  { revalidate = 3600, tags }: FetchOptions = {}
): Promise<T> {
  const API_BASE = process.env.API_URL;
  // Checked here, not at module load — this file gets imported by every
  // lib/api/<page>.ts as the "ready to swap in" fetcher, most of which
  // don't call it yet (still static mock data). Throwing at import time
  // would crash the whole app the moment ANY page's data layer imports
  // this file, even ones that never actually call apiFetch() — found
  // during an audit, not hypothetical (confirmed 4 lib/api/*.ts files
  // already reference it in comments without a configured API_URL).
  if (!API_BASE) {
    throw new Error("API_URL environment variable is not set.");
  }

  const url = `${API_BASE}${endpoint}`;
  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

    let res: Response;
    try {
      res = await fetch(url, {
        headers: { Accept: "application/json" },
        next: { revalidate, ...(tags ? { tags } : {}) },
        signal: controller.signal,
      });
    } catch (err) {
      clearTimeout(timeout);
      lastError = err;
      if (attempt < MAX_ATTEMPTS) {
        await sleep(backoff(attempt));
        continue;
      }
      throw err instanceof Error ? err : new Error(`API request failed — ${url}`);
    }
    clearTimeout(timeout);

    // Retry transient server errors (5xx). 4xx (e.g. 404) is not transient,
    // so it falls through and throws immediately.
    if (res.status >= 500 && attempt < MAX_ATTEMPTS) {
      lastError = new ApiError(`API error ${res.status}: ${res.statusText} — ${url}`, res.status);
      await sleep(backoff(attempt));
      continue;
    }

    if (!res.ok) {
      throw new ApiError(`API error ${res.status}: ${res.statusText} — ${url}`, res.status);
    }

    return res.json() as Promise<T>;
  }

  throw lastError instanceof Error ? lastError : new Error(`API request failed — ${url}`);
}
