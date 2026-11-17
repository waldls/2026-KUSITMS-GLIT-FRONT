"use client";

import Modal from "@/components/common/Modal";
// 정적 import: 클릭 핸들러 안에서 바로 호출해야 iOS가 유저 제스처로 인정해 권한 팝업을 띄움
import { requestNotificationPermission } from "@/components/common/NotificationPermission";
import { markNotificationAsked } from "@/lib/utils/notification";

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationModal = ({ isOpen, onClose }: NotificationModalProps) => {
  const handleSkip = () => {
    markNotificationAsked();
    onClose();
  };

  const handleAllow = () => {
    markNotificationAsked();
    onClose();
    void requestNotificationPermission();
  };

  return (
    <Modal
      isOpen={isOpen}
      type="double"
      title="커리어 기록 알림을 설정할까요?"
      contents={
        <>
          원하는 시간에 알림을 보내드려요!
          <br />
          하루 커리어를 꾸준히 쌓아보세요
        </>
      }
      btnLLabel="건너뛰기"
      btnRLabel="알림 허용"
      onBtnLClick={handleSkip}
      onBtnRClick={handleAllow}
      contentClassName="px-7 py-5"
      btnLClassName="px-5"
      btnRClassName="px-5"
    />
  );
};

export default NotificationModal;
