declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

// 픽셀 미로드(ID 없는 환경)면 아무 일도 하지 않음
export const trackMetaPixel = (event: string) => {
  if (typeof window === "undefined") return;
  window.fbq?.("track", event);
};

export const trackCompleteRegistration = () => trackMetaPixel("CompleteRegistration");
