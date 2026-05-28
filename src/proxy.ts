import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = ["/auth", "/auth/callback"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_PATHS.some(p => pathname.startsWith(p))) return NextResponse.next();

  // HTTPS에서는 refreshToken이 HttpOnly라 미들웨어에서 읽히지 않음
  // 만료 여부와 재발급은 AuthGate에서 처리
  if (request.nextUrl.protocol === "https:") return NextResponse.next();

  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  // HTTP(로컬)에서는 두 토큰 모두 없을 때만 바로 로그인 페이지로
  if (!accessToken && !refreshToken) return NextResponse.redirect(new URL("/auth", request.url));

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
