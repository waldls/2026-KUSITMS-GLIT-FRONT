import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

// next/image, next/link는 테스트용 단순 구현으로 대체
vi.mock("next/image", () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement> & { priority?: boolean }) => {
    const { priority: _p, ...rest } = props;
    void _p;
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...rest} />;
  },
}));

vi.mock("next/dynamic", () => ({
  default: () =>
    function DynamicStub() {
      return <div data-testid="dynamic-section" />;
    },
}));

vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

vi.mock("@/lib/hooks/user/userClient", () => ({
  useMe: vi.fn(),
  useInvalidateMe: vi.fn(() => vi.fn()),
}));

vi.mock("@/components/common/NotificationPermission", () => ({
  default: () => null,
  requestNotificationPermission: vi.fn(),
}));

vi.mock("@/components/common/NavigationBar", () => ({
  default: ({
    calendarOverlay,
  }: {
    activeHrefOverride?: string;
    className?: string;
    calendarOverlay?: React.ReactNode;
  }) => <nav data-testid="navigation-bar">{calendarOverlay}</nav>,
}));

vi.mock("@/components/home/SpeechBubble", () => ({
  default: () => <div data-testid="speech-bubble">캘린더 안내</div>,
}));

import Page from "@/app/page";
import { useInvalidateMe, useMe } from "@/lib/hooks/user/userClient";

const mockUseMe = vi.mocked(useMe);
const mockUseInvalidateMe = vi.mocked(useInvalidateMe);

describe("홈 페이지 (Page)", () => {
  beforeEach(() => {
    mockUseInvalidateMe.mockReturnValue(vi.fn());
    sessionStorage.clear();
  });

  it("닉네임이 있을 때 환영 문구에 닉네임을 표시한다", () => {
    mockUseMe.mockReturnValue({
      data: { nickname: "테스트유저", glaring: false },
    } as ReturnType<typeof useMe>);

    render(<Page />);

    expect(screen.getByText("테스트유저")).toBeInTheDocument();
  });

  it("닉네임이 없으면 빈 문자열로 표시된다", () => {
    mockUseMe.mockReturnValue({ data: undefined } as ReturnType<typeof useMe>);

    render(<Page />);

    expect(screen.getByText(/님의 강점을 확인해보세요/)).toBeInTheDocument();
  });

  it("기록하러 가기 링크가 렌더링된다", () => {
    mockUseMe.mockReturnValue({ data: undefined } as ReturnType<typeof useMe>);

    render(<Page />);

    const link = screen.getByRole("link", { name: "기록하러 가기" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/record/today-task");
  });

  it("glaring이 true이면 glaring 캐릭터 이미지를 표시한다", () => {
    mockUseMe.mockReturnValue({
      data: { nickname: "유저", glaring: true },
    } as ReturnType<typeof useMe>);

    render(<Page />);

    const images = screen.getAllByRole("img");
    const glaringImg = images.find(
      img => img.getAttribute("alt") === "캐릭터" && img.getAttribute("src")?.includes("glaring"),
    );
    expect(glaringImg).toBeDefined();
  });

  it("glaring이 false이면 기본 캐릭터 이미지를 표시한다", () => {
    mockUseMe.mockReturnValue({
      data: { nickname: "유저", glaring: false },
    } as ReturnType<typeof useMe>);

    render(<Page />);

    const images = screen.getAllByRole("img");
    const normalImg = images.find(
      img => img.getAttribute("alt") === "캐릭터" && !img.getAttribute("src")?.includes("glaring"),
    );
    expect(normalImg).toBeDefined();
  });

  it("isFirstStar가 true이면 캘린더 안내 오버레이가 표시된다", () => {
    sessionStorage.setItem("isFirstStar", "true");
    mockUseMe.mockReturnValue({ data: undefined } as ReturnType<typeof useMe>);

    render(<Page />);

    expect(screen.getByRole("button", { name: "캘린더 안내 닫기" })).toBeInTheDocument();
    expect(screen.getByTestId("speech-bubble")).toBeInTheDocument();
  });

  it("캘린더 안내 닫기 버튼 클릭 시 오버레이가 사라진다", async () => {
    sessionStorage.setItem("isFirstStar", "true");
    mockUseMe.mockReturnValue({ data: undefined } as ReturnType<typeof useMe>);

    render(<Page />);

    const closeButton = screen.getByRole("button", { name: "캘린더 안내 닫기" });
    await userEvent.click(closeButton);

    expect(screen.queryByRole("button", { name: "캘린더 안내 닫기" })).not.toBeInTheDocument();
    expect(sessionStorage.getItem("calendarGuideDismissed")).toBe("true");
  });

  it("isFirstStar가 false이면 오버레이가 표시되지 않는다", () => {
    mockUseMe.mockReturnValue({ data: undefined } as ReturnType<typeof useMe>);

    render(<Page />);

    expect(screen.queryByRole("button", { name: "캘린더 안내 닫기" })).not.toBeInTheDocument();
  });

  it("네비게이션 바가 렌더링된다", () => {
    mockUseMe.mockReturnValue({ data: undefined } as ReturnType<typeof useMe>);

    render(<Page />);

    expect(screen.getByTestId("navigation-bar")).toBeInTheDocument();
  });
});
