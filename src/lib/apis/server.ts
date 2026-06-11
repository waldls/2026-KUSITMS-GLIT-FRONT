import "server-only";

import ky, { isNetworkError } from "ky";
import { cookies } from "next/headers";

import { ApiError, type ApiResponse } from "@/types/api";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
const getUrl = (path: string) => `${BASE_URL}${path}`;

function unwrap<T>(json: ApiResponse<T>): T | null {
  if (!json.success) throw new ApiError(json.code, json.message);
  return json.data ?? null;
}

async function getServerKy() {
  const cookieStore = await cookies();
  // Next.js 서버 쿠키(next/headers)에서 브라우저가 전송한 accessToken/refreshToken을 읽어옴
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  const cookieHeader = [
    accessToken && `accessToken=${accessToken}`,
    refreshToken && `refreshToken=${refreshToken}`,
  ]
    .filter(Boolean)
    .join("; ");

  return ky.create({
    throwHttpErrors: false,
    headers: {
      "Content-Type": "application/json",
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      ...(cookieHeader && { Cookie: cookieHeader }),
    },
    hooks: {
      beforeError: [
        ({ error }) => {
          if (isNetworkError(error))
            return new ApiError("NETWORK_ERROR", "서버와 통신 중 오류가 발생했습니다.");
          return error;
        },
      ],
      afterResponse: [
        ({ response }) => {
          if (response.status === 401) throw new ApiError("AUTH_EXPIRED", "Unauthorized");
        },
      ],
    },
  });
}

// 서버 컴포넌트는 데이터 조회(GET)만 담당하며, 변경 요청(POST/PUT/PATCH/DELETE)은 클라이언트에서 처리
export const serverApi = {
  get: async <T>(path: string, params?: Record<string, string | number>) => {
    const instance = await getServerKy();
    const json = await instance.get(getUrl(path), { searchParams: params }).json<ApiResponse<T>>();
    return unwrap<T>(json);
  },
};
