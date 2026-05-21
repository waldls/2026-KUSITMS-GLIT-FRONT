import { api } from "@/api/client";
import type { AlarmData } from "@/types/user/notification";

// 내 알림 설정 조회
export const getAlarmSettings = () => api.get<AlarmData>("/api/users/me/notification-settings");

// 내 알림 설정 저장
export const patchAlarmSettings = (body: Partial<AlarmData>) =>
  api.patch("/api/users/me/notification-settings", body);
