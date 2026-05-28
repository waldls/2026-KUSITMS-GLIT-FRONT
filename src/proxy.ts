import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = ["/auth", "/auth/callback"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_PATHS.some(p => pathname.startsWith(p))) return NextResponse.next();

  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  // 토큰이 아예 없으면 바로 로그인 페이지로
  if (!accessToken && !refreshToken) return NextResponse.redirect(new URL("/auth", request.url));

  // 토큰이 하나라도 있으면 통과 — 만료 여부는 AuthGate에서 처리
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
