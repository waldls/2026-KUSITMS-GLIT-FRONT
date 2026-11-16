import { beforeEach, describe, expect, it } from "vitest";

import {
  ATTRIBUTION_COOKIE,
  clearAttribution,
  pickAttribution,
  withAttribution,
} from "@/lib/utils/attribution";

// proxy(NextResponse.cookies.set)와 같이 encodeURIComponent로 저장
const setAttributionCookie = (value: string) => {
  document.cookie = `${ATTRIBUTION_COOKIE}=${encodeURIComponent(value)}; path=/`;
};

describe("attribution", () => {
  beforeEach(() => {
    clearAttribution();
  });

  describe("pickAttribution", () => {
    it("utm·fbclid 키만 남긴다", () => {
      const params = new URLSearchParams(
        "utm_source=ig&utm_campaign=launch&fbclid=abc&access=token&foo=bar",
      );
      expect(pickAttribution(params)).toBe("utm_source=ig&utm_campaign=launch&fbclid=abc");
    });

    it("추적 키가 없으면 빈 문자열을 반환한다", () => {
      expect(pickAttribution(new URLSearchParams("foo=bar"))).toBe("");
    });
  });

  describe("withAttribution", () => {
    it("쿠키가 없으면 path를 그대로 반환한다", () => {
      expect(withAttribution("/auth")).toBe("/auth");
    });

    it("쿠키에 저장된 파라미터를 path에 붙인다", () => {
      setAttributionCookie("utm_source=ig&fbclid=abc");
      expect(withAttribution("/auth")).toBe("/auth?utm_source=ig&fbclid=abc");
    });

    it("기존 쿼리와 합치고, 이미 있는 키는 덮어쓰지 않는다", () => {
      setAttributionCookie("utm_source=ig&fbclid=abc");
      expect(withAttribution("/onboarding?step=2&utm_source=kakao")).toBe(
        "/onboarding?step=2&utm_source=kakao&fbclid=abc",
      );
    });

    it("clearAttribution 후에는 path를 그대로 반환한다", () => {
      setAttributionCookie("utm_source=ig");
      clearAttribution();
      expect(withAttribution("/")).toBe("/");
    });
  });
});
