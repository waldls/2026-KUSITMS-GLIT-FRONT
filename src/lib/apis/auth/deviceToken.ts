import { api } from "@/lib/apis/client";

// 디바이스 푸시 토큰 등록
export const postDeviceTokens = (pushToken: string) =>
  api.post("/api/users/me/device-tokens", { platform: "WEB", pushToken });
