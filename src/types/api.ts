export type ApiResponse<T> =
  | { success: true; code: string; message: string; data: T | null }
  | { success: false; code: string; message: string; data?: null };

export class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}
