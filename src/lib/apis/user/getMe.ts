import { serverApi } from "@/api/server";
import type { UserProfile } from "@/types/user/user";

export const getMe = () => serverApi.get<UserProfile>("/api/users/me");
