import { NextRequest, NextResponse } from "next/server";

// 인증 없이 접근 가능한 경로 목록
const PUBLIC_PATHS = ["/auth", "/auth/callback"];
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// JWT 토큰이 만료되었는지 확인하는 함수
function isExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

async function tryReissue(request: NextRequest): Promise<NextResponse | null> {
  if (!BASE_URL) return null;

  const refreshToken = request.cookies.get("refreshToken")?.value;
  if (!refreshToken) return null;

  try {
    // const isDev = process.env.NODE_ENV === "development";
    // const isNonProdServer = BASE_URL?.includes("stg") ?? false;
    const isHttp = request.nextUrl.protocol === "http:";
    const cookieHeader = `refreshToken=${refreshToken}`;

    const response = await fetch(`${BASE_URL}/api/auth/reissue`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      // ...(isDev ? { body: JSON.stringify({ refreshToken }) } : {}),
      // ...(isNonProdServer ? { body: JSON.stringify({ refreshToken }) } : {}),
      ...(isHttp ? { body: JSON.stringify({ refreshToken }) } : {}),
    });

    if (!response.ok) return null;

    const data = await response.json();
    if (!data.success || !data.data) return null;

    const { accessToken, refreshToken: newRefreshToken } = data.data;
    if (!accessToken) return null;

    const secure = process.env.NODE_ENV === "production";
    const res = NextResponse.redirect(request.url);

    res.cookies.set("accessToken", accessToken, {
      path: "/",
      maxAge: 60 * 60 * 24,
      sameSite: "lax",
      secure,
    });
    if (newRefreshToken) {
      res.cookies.set("refreshToken", newRefreshToken, {
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
        sameSite: "lax",
        secure,
      });
    }
    return res;
  } catch {
    return null;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_PATHS.some(p => pathname.startsWith(p))) return NextResponse.next();

  const accessToken = request.cookies.get("accessToken")?.value;
  if (accessToken && !isExpired(accessToken)) return NextResponse.next();

  const reissued = await tryReissue(request);
  if (reissued) return reissued;

  return NextResponse.redirect(new URL("/auth", request.url));
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
