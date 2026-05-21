"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import CalendarLogCard from "@/components/calendar/CalendarLogCard";
import CalendarProjectCard from "@/components/common/CalendarProjectCard";
import Header from "@/components/common/Header";
import Modal from "@/components/common/Modal";
import NavigationBar from "@/components/common/NavigationBar";
import Toast from "@/components/common/Toast";
import { PRIMARY_CATEGORY_MAP } from "@/constants/competency";
import { CALENDAR_DAILY_MOCK } from "@/data/calendar/mock";
import type { CalendarDailyScrumItem } from "@/types/calendar/calendar";

// 임시 -> API에서 한번에 내려주면 처리 필요 없음
const getGroupSkillTags = (items: CalendarDailyScrumItem[]) => {
  const seen = new Set<string>();
  return items
    .filter(item => item.hasStar && item.primaryCategory)
    .flatMap(item => {
      const mapped = PRIMARY_CATEGORY_MAP[item.primaryCategory!];
      if (!mapped || seen.has(mapped.label)) return [];
      seen.add(mapped.label);
      return [mapped];
    });
};

const Page = () => {
  const { date } = useParams<{ date: string }>();
  const dailyData = CALENDAR_DAILY_MOCK[date];
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
          <CalendarLogCard userName="다솔" tags={dailyData?.receivedTags ?? []} />
          {dailyData?.groups.map(group => (
            <CalendarProjectCard
              key={group.titleId}
              type={isEditMode && group.isEditable ? "delete" : "default"}
              name={group.freeText}
              pjName={group.projectTag}
              showIcoR={group.isEditable}
              popoverItems={
                group.isEditable
                  ? [
                      {
                        label: "삭제하기",
                        onClick: () => {
                          setDeleteTargetId(group.titleId);
                          setIsDeleteModalOpen(true);
                        },
                      },
                    ]
                  : undefined
              }
              skillTags={getGroupSkillTags(group.items)}
              scrumItems={group.items.map(item => ({
                content: item.content,
                highlight:
                  item.hasStar && item.primaryCategory
                    ? PRIMARY_CATEGORY_MAP[item.primaryCategory]?.variant
                    : undefined,
              }))}
              onScrumDelete={i => {
                setDeleteScrumId(group.items[i].scrumId);
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
