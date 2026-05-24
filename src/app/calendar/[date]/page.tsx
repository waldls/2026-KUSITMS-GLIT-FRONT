"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import CalendarProjectCard from "@/components/common/CalendarProjectCard";
import Header from "@/components/common/Header";
import Modal from "@/components/common/Modal";
import NavigationBar from "@/components/common/NavigationBar";
import Toast from "@/components/common/Toast";
import CalendarLogCard from "@/containers/calendar/CalendarLogCard";
import { type CalendarDailyResponse, getDailyCalendar } from "@/lib/apis/record/calendar";

const Page = () => {
  const { date } = useParams<{ date: string }>();
  const [dailyData, setDailyData] = useState<CalendarDailyResponse | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [isScrumDeleteModalOpen, setIsScrumDeleteModalOpen] = useState(false);
  const [deleteScrumId, setDeleteScrumId] = useState<number | null>(null);
  const [toastContent, setToastContent] = useState<string | null>(null);

  useEffect(() => {
    if (!toastContent) return;
    const timer = setTimeout(() => setToastContent(null), 4000);
    return () => clearTimeout(timer);
  }, [toastContent]);

  useEffect(() => {
    let ignore = false;

    const loadDailyCalendar = async () => {
      try {
        const dailyCalendar = await getDailyCalendar(date);
        if (!ignore) setDailyData(dailyCalendar);
      } catch {
        if (!ignore) setDailyData({ groups: [] });
      }
    };

    void loadDailyCalendar();

    return () => {
      ignore = true;
    };
  }, [date]);

  const handleDeleteConfirm = () => {
    // TODO: API call with deleteTargetId
    void deleteTargetId;
    setIsDeleteModalOpen(false);
    setDeleteTargetId(null);
    setIsEditMode(false);
    setToastContent("프로젝트가 삭제되었어요");
  };

  const handleScrumDeleteConfirm = () => {
    // TODO: API call with deleteScrumId
    void deleteScrumId;
    setIsScrumDeleteModalOpen(false);
    setDeleteScrumId(null);
    setIsEditMode(false);
    setToastContent("작업이 삭제되었어요");
  };

  return (
    <div className="relative flex h-full w-full flex-col">
      <Header
        title={date.replace(/-/g, ".")}
        rightLabel={isEditMode ? "완료" : "편집"}
        rightLabelClassName={isEditMode ? "text-sea-blue-400" : ""}
        onRightClick={() => setIsEditMode(prev => !prev)}
      />
      <div className="scrollbar-hide flex-1 overflow-y-auto px-5 pt-4">
        <div className="flex flex-col gap-5.75">
          <CalendarLogCard userName="다솔" tags={[]} />
          {dailyData?.groups?.map(group => (
            <CalendarProjectCard
              key={group.titleId}
              type={isEditMode && group.isEditable ? "delete" : "default"}
              name={group.freeText ?? ""}
              pjName={group.projectTag ?? ""}
              showIcoR={group.isEditable}
              popoverItems={
                group.isEditable
                  ? [
                      {
                        label: "삭제하기",
                        onClick: () => {
                          setDeleteTargetId(group.titleId ?? null);
                          setIsDeleteModalOpen(true);
                        },
                      },
                    ]
                  : undefined
              }
              scrumItems={(group.items ?? []).map(item => ({
                content: item.content ?? "",
              }))}
              onScrumDelete={i => {
                setDeleteScrumId(group.items?.[i].scrumId ?? null);
                setIsScrumDeleteModalOpen(true);
              }}
            />
          ))}
        </div>
      </div>
      <NavigationBar />
      {toastContent && (
        <div className="absolute right-0 bottom-29 left-0 z-40 flex justify-center">
          <Toast contents={toastContent} variant="success" showCloseButton={false} />
        </div>
      )}
      <Modal
        isOpen={isDeleteModalOpen}
        type="double"
        title="삭제하시겠어요?"
        contents={"기록과 심화기록이 함께 삭제되며,\n복구할 수 없어요"}
        btnLLabel="취소하기"
        btnRLabel="삭제하기"
        onClose={() => setIsDeleteModalOpen(false)}
        onBtnLClick={() => setIsDeleteModalOpen(false)}
        onBtnRClick={handleDeleteConfirm}
      />
      <Modal
        isOpen={isScrumDeleteModalOpen}
        type="double"
        title="삭제하시겠어요?"
        contents="삭제하면 다시 복구할 수 없어요"
        btnLLabel="취소하기"
        btnRLabel="삭제하기"
        onClose={() => setIsScrumDeleteModalOpen(false)}
        onBtnLClick={() => setIsScrumDeleteModalOpen(false)}
        onBtnRClick={handleScrumDeleteConfirm}
      />
    </div>
  );
};

export default Page;
