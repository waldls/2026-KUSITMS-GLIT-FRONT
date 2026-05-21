"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import Chip from "@/components/common/Chip";
import Header from "@/components/common/Header";
import Toast from "@/components/common/Toast";
import Toggle from "@/components/common/Toggle";
import WheelTimePicker, { type TimeValue } from "@/components/my/WheelTimePicker";
import { mockAlarmData } from "@/data/user/notification";
import { cn } from "@/lib/utils/cn";
import { type Day, fromAlarmData } from "@/lib/utils/notification";

const DAYS = ["월", "화", "수", "목", "금", "토", "일"] as const satisfies Day[];

type AlarmSettings = {
  isActive: boolean;
  selectedDays: Day[];
  time: TimeValue;
};

const DEFAULT = fromAlarmData(mockAlarmData);

const AlarmForm = () => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [saved, setSaved] = useState<AlarmSettings>(DEFAULT);
  const [draft, setDraft] = useState<AlarmSettings>(DEFAULT);

  const current = isEditing ? draft : saved;

  const handleEdit = () => {
    setDraft(saved);
    setIsEditing(true);
  };

  const handleSave = () => {
    setSaved(draft);
    setIsEditing(false);
  };

  const handleBack = () => {
    if (isEditing) {
      setIsEditing(false);
      return;
    }
    router.back();
  };

  const toggleDay = (day: Day) =>
    setDraft(prev => ({
      ...prev,
      selectedDays: prev.selectedDays.includes(day)
        ? prev.selectedDays.filter(d => d !== day)
        : [...prev.selectedDays, day],
    }));

  return (
    <div className="flex h-full w-full flex-col">
      <Header
        title="알림 설정"
        onLeftClick={handleBack}
        rightLabel={isEditing ? "완료" : "편집"}
        rightLabelClassName={isEditing ? "text-sea-blue-400" : "text-gray-700"}
        onRightClick={isEditing ? handleSave : handleEdit}
      />

      <div className="scrollbar-hide flex-1 overflow-y-auto px-5 pt-4">
        <div className="flex flex-col gap-5.5">
          <Toast
            contents="푸시 알림을 받으려면 기기 알림 허용이 필요해요"
            showCloseButton={false}
            className="w-full"
          />

          {/* 푸시 알림 토글 */}
          <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
              <p className="body-2 text-gray-300">푸시 알림</p>
              <div className={cn(!isEditing && "pointer-events-none")}>
                <Toggle
                  checked={current.isActive}
                  onChange={v => setDraft(prev => ({ ...prev, isActive: v }))}
                />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <p className="body-2 text-gray-300">알림 받는 시간</p>

              <div className="flex flex-col gap-5">
                <div className="flex w-full justify-between">
                  {DAYS.map(day => {
                    const selected = current.selectedDays.includes(day);
                    return (
                      <Chip
                        key={day}
                        state={selected ? "selected" : isEditing ? "default" : "unselected"}
                        onClick={isEditing ? () => toggleDay(day) : undefined}
                        className="size-10 justify-center">
                        {day}
                      </Chip>
                    );
                  })}
                </div>

                <WheelTimePicker
                  value={current.time}
                  disabled={!isEditing}
                  onChange={time => setDraft(prev => ({ ...prev, time }))}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlarmForm;
