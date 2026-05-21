"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { ChevronRightIcon } from "@/assets/icons";
import Modal from "@/components/common/Modal";
import { MENU_ITEMS } from "@/constants/my";
import { useAuthStore } from "@/store/authStore";

const STYLES = {
  menuRow: "flex w-full items-center justify-between py-3 pl-1 cursor-pointer",
  menuLabel: "body-2 text-gray-300",
  menuIcon: "size-6 text-gray-700",
} as const;

const MenuSection = () => {
  const router = useRouter();
  const clearTokens = useAuthStore(state => state.clearTokens);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);

  const handleMenuAction = (action: "logout" | "withdraw") => {
    if (action === "logout") setIsLogoutOpen(true);
    else setIsWithdrawOpen(true);
  };

  const handleLogoutConfirm = () => {
    clearTokens();
    router.push("/auth");
  };

  return (
    <>
      <div className="flex w-full flex-col">
        {MENU_ITEMS.map(item => {
          if ("href" in item) {
            return (
              <Link key={item.label} href={item.href} className={STYLES.menuRow}>
                <span className={STYLES.menuLabel}>{item.label}</span>
                <ChevronRightIcon className={STYLES.menuIcon} />
              </Link>
            );
          }

          return (
            <button
              key={item.label}
              type="button"
              onClick={() => handleMenuAction(item.action)}
              className={STYLES.menuRow}>
              <span className={STYLES.menuLabel}>{item.label}</span>
              <ChevronRightIcon className={STYLES.menuIcon} />
            </button>
          );
        })}
      </div>

      <Modal
        isOpen={isLogoutOpen}
        type="double"
        title="로그아웃 하시겠어요?"
        btnLLabel="취소하기"
        btnRLabel="로그아웃"
        onBtnLClick={() => setIsLogoutOpen(false)}
        onBtnRClick={handleLogoutConfirm}
        onClose={() => setIsLogoutOpen(false)}
      />
      <Modal
        isOpen={isWithdrawOpen}
        type="double"
        title="쌓아온 빛이 사라져요"
        contents="탈퇴 시 모든 기록이 삭제되며, 다시 복구할 수 없습니다. 계속 진행하시겠어요?"
        btnLLabel="취소하기"
        btnRLabel="탈퇴하기"
        onBtnLClick={() => setIsWithdrawOpen(false)}
        onBtnRClick={() => setIsWithdrawOpen(false)}
        onClose={() => setIsWithdrawOpen(false)}
      />
    </>
  );
};

export default MenuSection;
