import { NextRequest, NextResponse } from "next/server";

import { ATTRIBUTION_COOKIE, ATTRIBUTION_MAX_AGE, pickAttribution } from "@/lib/utils/attribution";

const PUBLIC_PATHS = ["/auth", "/auth/callback"];

const getAuthResponse = (request: NextRequest, attribution: string) => {
  const { pathname } = request.nextUrl;

  if (PUBLIC_PATHS.some(p => pathname.startsWith(p))) return NextResponse.next();

  // HTTPS에서는 refreshToken이 HttpOnly라 미들웨어에서 읽히지 않음
  // 만료 여부와 재발급은 AuthGate에서 처리
  if (request.nextUrl.protocol === "https:") return NextResponse.next();

  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  // HTTP(로컬)에서는 두 토큰 모두 없을 때만 바로 로그인 페이지로 (유입 파라미터는 유지)
  if (!accessToken && !refreshToken) {
    const authUrl = new URL("/auth", request.url);
    authUrl.search = attribution;
    return NextResponse.redirect(authUrl);
  }

  return NextResponse.next();
};

export async function proxy(request: NextRequest) {
  const attribution = pickAttribution(request.nextUrl.searchParams);
  const response = getAuthResponse(request, attribution);

  // 페이지 문서 요청일 때만 저장: 클라이언트 라우팅(RSC fetch)에서 다시 저장하면 플로우 끝에서 삭제한 쿠키가 되살아남
  // Next가 RSC 헤더를 proxy 전에 제거하므로 브라우저의 Sec-Fetch-Dest로 구분 (헤더 미지원 브라우저는 저장)
  const isDocumentRequest = (request.headers.get("sec-fetch-dest") ?? "document") === "document";
  if (attribution && isDocumentRequest) {
    response.cookies.set(ATTRIBUTION_COOKIE, attribution, {
      path: "/",
      maxAge: ATTRIBUTION_MAX_AGE,
      sameSite: "lax",
      secure: request.nextUrl.protocol === "https:",
    });
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
