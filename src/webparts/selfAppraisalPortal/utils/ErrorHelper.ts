export class ErrorHelper {
  public static toUserMessage(error: unknown, fallback: string): string {
    if (!error) {
      return fallback;
    }
    return fallback;
  }
}

