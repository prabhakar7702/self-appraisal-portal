export class ErrorHelper {
  public static toUserMessage(error: unknown, fallback: string): string {
    const raw = typeof error === 'string'
      ? error
      : (error && typeof error === 'object' && 'message' in error ? String((error as { message: string }).message) : '');

    if (raw) {
      const lower = raw.toLowerCase();
      if (lower.indexOf('403') >= 0 || lower.indexOf('access denied') >= 0) {
        return 'You do not have permission to perform this action.';
      }
      if (lower.indexOf('404') >= 0) {
        return 'The requested SharePoint resource was not found.';
      }
      if (lower.indexOf('timeout') >= 0) {
        return 'The request timed out. Please try again.';
      }
      if (lower.indexOf('network') >= 0 || lower.indexOf('failed to fetch') >= 0) {
        return 'Network issue detected. Check connectivity and try again.';
      }
    }
    return fallback;
  }
}
