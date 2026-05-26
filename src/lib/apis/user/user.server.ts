import { serverApi } from "@/api/server";
import type { UserProfile } from "@/types/user/user";

// 내 정보 조회
export const getMe = () => serverApi.get<UserProfile>("/api/users/me");
