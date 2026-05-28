import ky, { isNetworkError } from "ky";

import { isTokenExpired } from "@/lib/utils/token";
import { useAuthStore } from "@/store/authStore";
import { ApiError, type ApiResponse } from "@/types/api";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
const getUrl = (path: string) => `${BASE_URL}${path}`;

// reissue 전용 인스턴스
const baseKy = ky.create({
  credentials: "include",
  throwHttpErrors: false,
  retry: 0,
});

type TokenPair = {
  accessToken: string;
  refreshToken?: string;
};

let refreshPromise: Promise<TokenPair> | null = null;

async function requestReissue(): Promise<TokenPair> {
  const { refreshToken } = useAuthStore.getState();
  const options = refreshToken ? { json: { refreshToken } } : {};

  const json = await baseKy
    .post(getUrl("/api/auth/reissue"), options)
    .json<ApiResponse<TokenPair>>();

  if (!json.success || !json.data) throw new ApiError(json.code ?? "REISSUE_FAILED", json.message);
  return json.data;
}

export function reissue(): Promise<TokenPair> {
  refreshPromise ??= requestReissue().finally(() => {
    refreshPromise = null;
  });
  return refreshPromise;
}

function unwrap<T>(json: ApiResponse<T>): T | null {
  if (!json.success) throw new ApiError(json.code, json.message);
  return json.data ?? null;
}

const clientKy = ky.create({
  credentials: "include",
  throwHttpErrors: false,
  retry: {
    limit: 1,
    statusCodes: [],
    methods: ["get", "post", "put", "patch", "delete", "head"],
  },
  hooks: {
    beforeRequest: [
      async ({ request }) => {
        let { accessToken } = useAuthStore.getState();

        if (accessToken && isTokenExpired(accessToken)) {
          const tokens = await reissue();
          useAuthStore.getState().setTokens(tokens.accessToken, tokens.refreshToken);
          accessToken = tokens.accessToken;
        }

        if (accessToken) request.headers.set("Authorization", `Bearer ${accessToken}`);
      },
    ],
    beforeError: [
      ({ error }) => {
        if (isNetworkError(error))
          return new ApiError("NETWORK_ERROR", "서버와 통신 중 오류가 발생했습니다.");
        return error;
      },
    ],
    afterResponse: [
      async ({ request, response, retryCount }) => {
        if (response.status !== 401 || retryCount > 0) return;

        try {
          const { setTokens } = useAuthStore.getState();
          const tokens = await reissue();
          setTokens(tokens.accessToken, tokens.refreshToken);

          const headers = new Headers(request.headers);
          headers.set("Authorization", `Bearer ${tokens.accessToken}`);

          // 새 토큰으로 헤더를 교체한 요청을 ky에 재시도 지시 (retryCount → 1, 무한루프 방지)
          return ky.retry({
            request: new Request(request, { headers }),
            code: "TOKEN_REFRESHED",
          });
        } catch {
          useAuthStore.getState().clearTokens();
          throw new ApiError("AUTH_EXPIRED", "인증이 만료되었습니다. 다시 로그인해주세요.");
        }
      },
    ],
  },
});

export const clientApi = {
  get: <T>(path: string, params?: Record<string, string | number>) =>
    clientKy
      .get(getUrl(path), { searchParams: params })
      .json<ApiResponse<T>>()
      .then(json => unwrap<T>(json)),
  post: <T>(path: string, body?: unknown, options?: { timeout?: number | false }) =>
    clientKy
      .post(getUrl(path), { json: body, timeout: options?.timeout })
      .json<ApiResponse<T>>()
      .then(json => unwrap<T>(json)),
  put: <T>(path: string, body?: unknown) =>
    clientKy
      .put(getUrl(path), { json: body })
      .json<ApiResponse<T>>()
      .then(json => unwrap<T>(json)),
  patch: <T>(path: string, body?: unknown) =>
    clientKy
      .patch(getUrl(path), { json: body })
      .json<ApiResponse<T>>()
      .then(json => unwrap<T>(json)),
  delete: <T>(path: string) =>
    clientKy
      .delete(getUrl(path))
      .json<ApiResponse<T>>()
      .then(json => unwrap<T>(json)),
};

export { clientApi as api };
