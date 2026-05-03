/**
 * Detects errors that are caused by an in-flight async operation being
 * aborted — typically because the user navigated away mid-render or a React
 * effect unmounted before its fetch / promise resolved.
 *
 * These are not real failures and should not surface a route-level error UI.
 * The Next.js error boundary can simply call `reset()` when one is detected.
 */
export function isBenignAbortError(error: unknown): boolean {
  if (!error) return false

  // DOMException / fetch abort: `error.name === 'AbortError'`.
  // Native fetch in the browser also throws errors whose `.name` is
  // 'AbortError' with the message "The user aborted a request.".
  const name =
    typeof error === 'object' && error !== null && 'name' in error
      ? String((error as { name?: unknown }).name ?? '')
      : ''

  if (name === 'AbortError' || name === 'AbortSignal') return true

  const message =
    error instanceof Error
      ? error.message
      : typeof error === 'object' && error !== null && 'message' in error
        ? String((error as { message?: unknown }).message ?? '')
        : ''

  if (!message) return false

  const normalized = message.toLowerCase()
  return (
    normalized.includes('aborted a request') ||
    normalized.includes('the operation was aborted') ||
    normalized.includes('signal is aborted') ||
    normalized === 'aborterror'
  )
}

export default isBenignAbortError
