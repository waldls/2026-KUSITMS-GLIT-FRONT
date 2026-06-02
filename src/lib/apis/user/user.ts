import { api } from "@/lib/apis/client";
import type { PatchMeBody } from "@/types/user/user";

// 회원 탈퇴
export const deleteMe = () => api.delete("/api/users/me");

// 프로필 수정
export const patchMe = (body: PatchMeBody) => api.patch("/api/users/me", body);
