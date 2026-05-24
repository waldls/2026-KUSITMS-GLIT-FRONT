import { useRef, useState } from "react";

import { getMonthlyCalendar } from "@/lib/apis/calendar/calendar";
import { isWithinSelectableRecordRange, parseApiDate } from "@/lib/utils/calendar";

type UseDailyScrumCalendarParams = {
  selectedDate: Date | null;
  onConfirmDate: (date: Date) => void;
  showScrumToast: (message: string) => void;
};

const formatDateForApi = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

const formatMonthForApi = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

export const useDailyScrumCalendar = ({
  selectedDate,
  onConfirmDate,
  showScrumToast,
}: UseDailyScrumCalendarParams) => {
  const [calendarDraftDate, setCalendarDraftDate] = useState<Date | null>(null);
  const [calendarStarDates, setCalendarStarDates] = useState<Date[]>([]);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const calendarStarDateCacheRef = useRef<Record<string, boolean>>({});
  const lastRequestedMonthRef = useRef<string | null>(null);

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

  const isScrumDate = (date: Date) => {
    const dateKey = formatDateForApi(date);
    const cached = calendarStarDateCacheRef.current[dateKey];

    if (cached !== undefined) return cached;

    return calendarStarDates.some(starDate => formatDateForApi(starDate) === dateKey);
  };

  const isStarDate = (date: Date) => isScrumDate(date);

  const handleCalendarDateClick = (date: Date) => {
    if (isStarDate(date)) {
      showScrumToast("이미 기록을 남긴 날이에요");
    }
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

    if (isStarDate(calendarDraftDate)) {
      showScrumToast("이미 기록을 남긴 날이에요");
      return;
    }

    if (!isWithinSelectableRecordRange(calendarDraftDate)) {
      return;
    }

    onConfirmDate(calendarDraftDate);
    setIsCalendarOpen(false);
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
    handleCalendarDateClick,
    closeCalendarSheet,
    confirmCalendarDate,
  };
};
