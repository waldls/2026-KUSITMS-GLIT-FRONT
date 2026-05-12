import { useAuthStore } from "@/store/authStore";
import { ApiError, ApiResponse } from "@/types/api";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface RequestOptions {
  params?: Record<string, string | number>;
  headers?: HeadersInit;
}

const getAuthHeaders = (accessToken?: string | null): HeadersInit => ({
  "Content-Type": "application/json",
  ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
});

const toJson = async <T>(res: Response): Promise<T | null> => {
  const body: ApiResponse<T> = await res.json().catch(() => {
    throw new ApiError("NETWORK_ERROR", "서버와 통신 중 오류가 발생했습니다.");
  });
  if (!body.success) throw new ApiError(body.code, body.message);
  return body.data;
};

const buildUrl = (baseUrl: string, path: string, params?: Record<string, string | number>) => {
  const url = new URL(path, baseUrl);
  if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)));
  return url.toString();
};

function createFetch(baseUrl: string) {
  const request = async <T>(
    method: HttpMethod,
    path: string,
    body?: unknown,
    options?: RequestOptions,
  ): Promise<T | null> => {
    const { accessToken, refreshToken, setTokens, clearTokens } = useAuthStore.getState();
    const url = buildUrl(baseUrl, path, options?.params);
    const init: RequestInit = {
      method,
      credentials: "include",
      headers: { ...getAuthHeaders(accessToken), ...options?.headers },
      ...(body !== undefined && { body: JSON.stringify(body) }),
    };

    const res = await fetch(url, init);

    if (res.status !== 401) return toJson<T>(res);

    try {
      const reissueBody =
        process.env.NODE_ENV === "development" && refreshToken
          ? JSON.stringify({ refreshToken })
          : undefined;

      const reissueRes = await fetch(`${baseUrl}/api/auth/reissue`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        ...(reissueBody && { body: reissueBody }),
      });

      const tokens = await toJson<{ accessToken: string; refreshToken: string }>(reissueRes);
      if (!tokens) throw new Error();
      setTokens(tokens.accessToken, tokens.refreshToken);

      const retryRes = await fetch(url, {
        ...init,
        headers: { ...getAuthHeaders(tokens.accessToken), ...options?.headers },
      });
      return toJson<T>(retryRes);
    } catch {
      clearTokens();
      throw new ApiError("AUTH_EXPIRED", "인증이 만료되었습니다. 다시 로그인해주세요.");
    }
  };

  return {
    get: <T>(path: string, options?: RequestOptions) => request<T>("GET", path, undefined, options),
    post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
      request<T>("POST", path, body, options),
    put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
      request<T>("PUT", path, body, options),
    patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
      request<T>("PATCH", path, body, options),
    delete: <T>(path: string, options?: RequestOptions) =>
      request<T>("DELETE", path, undefined, options),
  };
}

export const api = createFetch(process.env.NEXT_PUBLIC_API_BASE_URL ?? "");
