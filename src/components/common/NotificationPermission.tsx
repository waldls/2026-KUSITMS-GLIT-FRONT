"use client";

import { getToken } from "firebase/messaging";
import { useEffect } from "react";

import { postDeviceToken } from "@/lib/apis/auth/deviceToken";
import { patchAlarmSettings } from "@/lib/apis/user/notification";
import { getMessagingInstance } from "@/lib/utils/fcm";

export const requestNotificationPermission = async () => {
  if (!("Notification" in window) || !("serviceWorker" in navigator)) return;

  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    await patchAlarmSettings({ isActive: false }).catch(console.error);
    return;
  }

  const messaging = getMessagingInstance();
  if (!messaging) return;

  try {
    const registration = await navigator.serviceWorker.ready;
    const token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
      serviceWorkerRegistration: registration,
    });
    if (!token) {
      console.warn("FCM 토큰을 가져오지 못했습니다.");
      return;
    }
    console.log("FCM token:", token);
    await postDeviceToken(token);
    // 알림 권한 허용시 기본값 평일 22:00
    await patchAlarmSettings({
      isActive: true,
      daysOfWeek: ["MON", "TUE", "WED", "THU", "FRI"],
      notifyTime: "22:00",
    }).catch(console.error);
  } catch (error) {
    console.error(error);
  }
};

const NotificationPermission = () => {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/firebase-messaging-sw.js");
  }, []);

  return null;
};

export default NotificationPermission;
