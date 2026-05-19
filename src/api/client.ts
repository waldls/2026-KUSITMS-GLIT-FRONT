import ky, { isNetworkError } from "ky";

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

// 동시에 여러 401이 발생해도 reissue는 한 번만 호출 (single-flight)
let refreshPromise: Promise<{ accessToken: string; refreshToken: string }> | null = null;

/**
 * 만료된 액세스 토큰을 갱신
 * refreshToken을 이용해 /api/auth/reissue를 호출
 */
async function reissue(): Promise<{ accessToken: string; refreshToken: string }> {
  const { refreshToken } = useAuthStore.getState();
  const options =
    process.env.NODE_ENV === "development" && refreshToken ? { json: { refreshToken } } : {};

  const json = await baseKy
    .post(getUrl("/api/auth/reissue"), options)
    .json<ApiResponse<{ accessToken: string; refreshToken: string }>>();

  if (!json.success || !json.data) throw new ApiError(json.code ?? "REISSUE_FAILED", json.message);
  return json.data;
}

/**
 * ApiResponse 래퍼를 벗겨 data를 반환
 * success가 false이면 ApiError를 throw하고,
 * data가 없으면 null을 반환한다.
 */
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
      ({ request }) => {
        // Zustand store(authStore)에서 현재 저장된 accessToken을 가져옴
        const { accessToken } = useAuthStore.getState();
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
          refreshPromise ??= reissue().finally(() => {
            refreshPromise = null;
          });
          const tokens = await refreshPromise;
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
  post: <T>(path: string, body?: unknown) =>
    clientKy
      .post(getUrl(path), { json: body })
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
