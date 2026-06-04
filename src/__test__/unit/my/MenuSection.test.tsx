import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

vi.mock("@/store/authStore", () => ({
  useAuthStore: vi.fn(),
}));

vi.mock("@/lib/apis/auth/auth", () => ({
  postLogout: vi.fn(),
}));

vi.mock("@/lib/apis/user/user", () => ({
  deleteMe: vi.fn(),
}));

vi.mock("@/assets/icons", async importOriginal => {
  const actual = await importOriginal<typeof import("@/assets/icons")>();
  return { ...actual, ChevronRightIcon: () => null };
});

vi.mock("@/components/common/Modal", () => ({
  default: ({
    isOpen,
    title,
    contents,
    btnLLabel,
    btnRLabel,
    onBtnLClick,
    onBtnRClick,
  }: {
    isOpen: boolean;
    title: string;
    contents?: string;
    btnLLabel: string;
    btnRLabel: string;
    onBtnLClick: () => void;
    onBtnRClick: () => void;
    onClose: () => void;
    type?: string;
  }) =>
    isOpen ? (
      <div role="dialog" aria-label={title}>
        <p>{title}</p>
        {contents && <p>{contents}</p>}
        <button onClick={onBtnLClick}>{btnLLabel}</button>
        <button onClick={onBtnRClick}>{btnRLabel}</button>
      </div>
    ) : null,
}));

import { useRouter } from "next/navigation";

import MenuSection from "@/containers/my/MenuSection";
import { postLogout } from "@/lib/apis/auth/auth";
import { deleteMe } from "@/lib/apis/user/user";
import { useAuthStore } from "@/store/authStore";

const mockPush = vi.fn();
const mockClearTokens = vi.fn();

describe("MenuSection", () => {
  beforeEach(() => {
    vi.mocked(useRouter).mockReturnValue({ push: mockPush } as unknown as ReturnType<
      typeof useRouter
    >);
    vi.mocked(useAuthStore).mockImplementation(selector =>
      selector({
        accessToken: null,
        refreshToken: null,
        setTokens: vi.fn(),
        clearTokens: mockClearTokens,
      }),
    );
    mockPush.mockClear();
    mockClearTokens.mockClear();
  });

  it("모든 메뉴 아이템이 렌더링된다", () => {
    render(<MenuSection />);

    expect(screen.getByText("프로필 관리")).toBeInTheDocument();
    expect(screen.getByText("서비스 이용 가이드")).toBeInTheDocument();
    expect(screen.getByText("알림설정")).toBeInTheDocument();
    expect(screen.getByText("개인정보처리방침")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "로그아웃" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "회원탈퇴" })).toBeInTheDocument();
  });

  it("프로필 관리 링크가 /my/profile을 가리킨다", () => {
    render(<MenuSection />);

    expect(screen.getByRole("link", { name: "프로필 관리" })).toHaveAttribute(
      "href",
      "/my/profile",
    );
  });

  it("서비스 이용 가이드 링크가 /my/guide를 가리킨다", () => {
    render(<MenuSection />);

    expect(screen.getByRole("link", { name: "서비스 이용 가이드" })).toHaveAttribute(
      "href",
      "/my/guide",
    );
  });

  it("알림설정 링크가 /my/alarm을 가리킨다", () => {
    render(<MenuSection />);

    expect(screen.getByRole("link", { name: "알림설정" })).toHaveAttribute("href", "/my/alarm");
  });

  it("로그아웃 버튼 클릭 시 로그아웃 확인 모달이 열린다", async () => {
    render(<MenuSection />);

    await userEvent.click(screen.getByRole("button", { name: "로그아웃" }));

    expect(screen.getByRole("dialog", { name: "로그아웃 하시겠어요?" })).toBeInTheDocument();
  });

  it("로그아웃 모달에서 취소하기 클릭 시 모달이 닫힌다", async () => {
    render(<MenuSection />);

    await userEvent.click(screen.getByRole("button", { name: "로그아웃" }));
    await userEvent.click(
      within(screen.getByRole("dialog")).getByRole("button", { name: "취소하기" }),
    );

    expect(screen.queryByRole("dialog", { name: "로그아웃 하시겠어요?" })).not.toBeInTheDocument();
  });

  it("로그아웃 모달 확인 시 postLogout 호출 후 clearTokens 실행 후 /auth로 이동한다", async () => {
    vi.mocked(postLogout).mockResolvedValue(undefined as never);
    render(<MenuSection />);

    await userEvent.click(screen.getByRole("button", { name: "로그아웃" }));
    // 모달 내 "로그아웃" 확인 버튼 — 메뉴 버튼과 구분하기 위해 dialog 안에서 접근
    await userEvent.click(
      within(screen.getByRole("dialog")).getByRole("button", { name: "로그아웃" }),
    );

    await waitFor(() => {
      expect(postLogout).toHaveBeenCalled();
      expect(mockClearTokens).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith("/auth");
    });
  });

  it("postLogout이 실패해도 clearTokens 실행 후 /auth로 이동한다", async () => {
    vi.mocked(postLogout).mockRejectedValue(new Error("network error"));
    render(<MenuSection />);

    await userEvent.click(screen.getByRole("button", { name: "로그아웃" }));
    await userEvent.click(
      within(screen.getByRole("dialog")).getByRole("button", { name: "로그아웃" }),
    );

    // handleLogoutConfirm은 .catch(() => {})로 에러를 삼키므로 정상 흐름 유지
    await waitFor(() => {
      expect(mockClearTokens).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith("/auth");
    });
  });

  it("회원탈퇴 버튼 클릭 시 탈퇴 확인 모달이 열린다", async () => {
    render(<MenuSection />);

    await userEvent.click(screen.getByRole("button", { name: "회원탈퇴" }));

    expect(screen.getByRole("dialog", { name: "쌓아온 빛이 사라져요" })).toBeInTheDocument();
  });

  it("회원탈퇴 모달에 탈퇴 경고 문구가 표시된다", async () => {
    render(<MenuSection />);

    await userEvent.click(screen.getByRole("button", { name: "회원탈퇴" }));

    expect(
      screen.getByText(
        "탈퇴 시 모든 기록이 삭제되며, 다시 복구할 수 없습니다. 계속 진행하시겠어요?",
      ),
    ).toBeInTheDocument();
  });

  it("회원탈퇴 모달에서 취소하기 클릭 시 모달이 닫힌다", async () => {
    render(<MenuSection />);

    await userEvent.click(screen.getByRole("button", { name: "회원탈퇴" }));
    await userEvent.click(
      within(screen.getByRole("dialog")).getByRole("button", { name: "취소하기" }),
    );

    expect(screen.queryByRole("dialog", { name: "쌓아온 빛이 사라져요" })).not.toBeInTheDocument();
  });

  it("회원탈퇴 모달 확인 시 deleteMe 호출 후 clearTokens 실행 후 /auth로 이동한다", async () => {
    vi.mocked(deleteMe).mockResolvedValue(undefined as never);
    render(<MenuSection />);

    await userEvent.click(screen.getByRole("button", { name: "회원탈퇴" }));
    await userEvent.click(
      within(screen.getByRole("dialog")).getByRole("button", { name: "탈퇴하기" }),
    );

    await waitFor(() => {
      expect(deleteMe).toHaveBeenCalled();
      expect(mockClearTokens).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith("/auth");
    });
  });
});
