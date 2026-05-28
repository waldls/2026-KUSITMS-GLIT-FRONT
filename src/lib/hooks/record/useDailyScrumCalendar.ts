import { useRef, useState } from "react";

import { getMonthlyCalendar } from "@/lib/apis/calendar/calendar";
import { isWithinSelectableRecordRange, parseApiDate } from "@/lib/utils/calendar";
import { isTodayTaskSubmitted } from "@/lib/utils/recordSession";
import { useRecordDraftStore } from "@/store/recordDraftStore";

type UseDailyScrumCalendarParams = {
  selectedDate: Date | null;
  onConfirmDate: (date: Date) => void;
  showScrumToast: (message: string) => void;
};

const formatDateForApi = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

const formatMonthForApi = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

const getToday = () => {
  const today = new Date();

  return new Date(today.getFullYear(), today.getMonth(), today.getDate());
};

const isSameCalendarDay = (left: Date, right: Date) =>
  formatDateForApi(left) === formatDateForApi(right);

export const useDailyScrumCalendar = ({
  selectedDate,
  onConfirmDate,
  showScrumToast,
}: UseDailyScrumCalendarParams) => {
  const isTodayWithExistingRecord = useRecordDraftStore(state => state.isTodayWithExistingRecord);
  const [calendarDraftDate, setCalendarDraftDate] = useState<Date | null>(null);
  const [calendarStarDates, setCalendarStarDates] = useState<Date[]>([]);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const calendarStarDateCacheRef = useRef<Record<string, boolean>>({});
  const lastRequestedMonthRef = useRef<string | null>(null);
  const isScrumDate = (date: Date) => {
    const dateKey = formatDateForApi(date);
    const cached = calendarStarDateCacheRef.current[dateKey];

    if (cached !== undefined) return cached;

    return calendarStarDates.some(starDate => formatDateForApi(starDate) === dateKey);
  };

  const isStarDate = (date: Date) => isScrumDate(date);

  const isRecordDateLocked = (date: Date) => {
    const dateKey = formatDateForApi(date);
    const isTodayLocked =
      isSameCalendarDay(date, getToday()) &&
      (isTodayTaskSubmitted(dateKey) || isTodayWithExistingRecord);

    return isScrumDate(date) || isTodayLocked;
  };

  const handleCalendarDateClick = () => {
    showScrumToast("이미 기록을 남긴 날이에요");
  };

  const openCalendarSheet = () => {
    setCalendarDraftDate(selectedDate);
    loadCalendarScrumDates(selectedDate ?? new Date());
    setIsCalendarOpen(true);
  };

  const closeCalendarSheet = () => {
    setCalendarDraftDate(selectedDate);
    setIsCalendarOpen(false);
  };

  const confirmCalendarDate = () => {
    if (!calendarDraftDate) return;

    if (isRecordDateLocked(calendarDraftDate)) {
      showScrumToast("이미 기록을 남긴 날이에요");
      return;
    }

    if (!isWithinSelectableRecordRange(calendarDraftDate)) {
      return;
    }

    onConfirmDate(calendarDraftDate);
    setIsCalendarOpen(false);
  };

  const loadCalendarScrumDates = (monthDate: Date) => {
    const requestMonth = formatMonthForApi(monthDate);
    lastRequestedMonthRef.current = requestMonth;

    const load = async () => {
      try {
        const monthlyCalendar = await getMonthlyCalendar(requestMonth);
        if (lastRequestedMonthRef.current !== requestMonth) return;

        const starDates =
          monthlyCalendar?.days
            ?.filter(day => day.hasStar && day.date)
            .map(day => parseApiDate(day.date!)) ?? [];

        monthlyCalendar?.days?.forEach(day => {
          if (day.date) {
            calendarStarDateCacheRef.current[day.date] = day.hasStar ?? false;
          }
        });

        setCalendarStarDates(starDates);
      } catch {
        if (lastRequestedMonthRef.current !== requestMonth) return;

        setCalendarStarDates([]);
      }
    };

    void load();
  };

  return {
    calendarDraftDate,
    calendarStarDates,
    isCalendarOpen,
    setCalendarDraftDate,
    openCalendarSheet,
    loadCalendarScrumDates,
    isScrumDate,
    isStarDate,
    isRecordDateLocked,
    handleCalendarDateClick,
    closeCalendarSheet,
    confirmCalendarDate,
  };
};
