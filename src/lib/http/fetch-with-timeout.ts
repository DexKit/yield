const DEFAULT_TIMEOUT_MS = 8_000;

/**
 * fetch() with AbortSignal timeout so slow APIs/RPC do not block compile or page render.
 */
export async function fetchWithTimeout(
  input: RequestInfo | URL,
  init?: RequestInit & { timeoutMs?: number },
): Promise<Response> {
  const timeoutMs = init?.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const { timeoutMs: _timeout, ...rest } = init ?? {};

  return fetch(input, {
    ...rest,
    signal: rest.signal ?? AbortSignal.timeout(timeoutMs),
  });
}
