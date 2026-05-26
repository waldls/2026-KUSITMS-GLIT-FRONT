"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import CalendarProjectCard from "@/components/common/CalendarProjectCard";
import Header from "@/components/common/Header";
import Modal from "@/components/common/Modal";
import NavigationBar from "@/components/common/NavigationBar";
import Toast from "@/components/common/Toast";
import { PRIMARY_CATEGORY_MAP } from "@/constants/competency";
import CalendarLogCard from "@/containers/calendar/CalendarLogCard";
import { getDailyCalendar } from "@/lib/apis/record/calendar";
import { deleteScrum, deleteScrumTitle } from "@/lib/apis/record/scrum";
import { useMe } from "@/lib/hooks/user/userClient";
import type { DailyCalendarData } from "@/types/record/calendar";

const Page = () => {
  const { date } = useParams<{ date: string }>();
  const router = useRouter();
  const { data: profile } = useMe();
  const [dailyData, setDailyData] = useState<DailyCalendarData | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [isScrumDeleteModalOpen, setIsScrumDeleteModalOpen] = useState(false);
  const [deleteScrumId, setDeleteScrumId] = useState<number | null>(null);
  const [deleteScrumHasStar, setDeleteScrumHasStar] = useState(false);
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

  const handleDeleteConfirm = async () => {
    if (deleteTargetId === null) return;
    try {
      await deleteScrumTitle(deleteTargetId);
      const updated = await getDailyCalendar(date);
      if (!updated || (updated.groups?.length ?? 0) === 0) {
        router.back();
        return;
      }
      setDailyData(updated);
      setToastContent("프로젝트가 삭제되었어요");
    } catch {
      setToastContent("삭제에 실패했어요");
    } finally {
      setIsDeleteModalOpen(false);
      setDeleteTargetId(null);
      setIsEditMode(false);
    }
  };

  const handleScrumDeleteConfirm = async () => {
    if (deleteScrumId === null) return;
    try {
      await deleteScrum(deleteScrumId);
      const updated = await getDailyCalendar(date);
      if (!updated || (updated.groups?.length ?? 0) === 0) {
        router.back();
        return;
      }
      setDailyData(updated);
      setToastContent("작업이 삭제되었어요");
    } catch {
      setToastContent("삭제에 실패했어요");
    } finally {
      setIsScrumDeleteModalOpen(false);
      setDeleteScrumId(null);
      setDeleteScrumHasStar(false);
      setIsEditMode(false);
    }
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
          <CalendarLogCard userName={profile?.nickname ?? ""} tags={dailyData?.detailTags ?? []} />
          {dailyData?.groups?.map(group => (
            <CalendarProjectCard
              key={group.titleId}
              type={isEditMode ? "delete" : "default"}
              name={group.freeText ?? ""}
              pjName={group.projectTag ?? ""}
              skillTags={Array.from(
                new Set(
                  (group.items ?? [])
                    .filter(item => item.hasStar && item.primaryCategory)
                    .map(item => item.primaryCategory!),
                ),
              )
                .map(cat => PRIMARY_CATEGORY_MAP[cat])
                .filter(Boolean)}
              onDelete={() => {
                setDeleteTargetId(group.titleId ?? null);
                setIsDeleteModalOpen(true);
              }}
              scrumItems={(group.items ?? []).map(item => ({
                content: item.content ?? "",
                highlight:
                  item.hasStar && item.primaryCategory
                    ? (PRIMARY_CATEGORY_MAP[item.primaryCategory]?.variant ?? undefined)
                    : undefined,
                onClick:
                  item.hasStar && item.starRecordId
                    ? () => router.push(`/calendar/${date}/${item.starRecordId}`)
                    : undefined,
              }))}
              onScrumDelete={i => {
                setDeleteScrumId(group.items?.[i].scrumId ?? null);
                setDeleteScrumHasStar(group.items?.[i].hasStar ?? false);
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
        contents={
          deleteScrumHasStar
            ? "기록과 심화기록이 함께 삭제되며,\n복구할 수 없어요"
            : "삭제하면 다시 복구할 수 없어요"
        }
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
