import { api } from "@/lib/apis/client";
import type { AlarmData } from "@/types/user/notification";

// 내 알림 설정 조회
export const getNotificationSettings = () =>
  api.get<AlarmData>("/api/users/me/notification-settings");

// 내 알림 설정 저장
export const patchNotificationSettings = (body: Partial<AlarmData>) =>
  api.patch("/api/users/me/notification-settings", body);
