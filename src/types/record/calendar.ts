// GET /api/calendar/daily
export interface DailyCalendarItem {
  scrumId?: number;
  content?: string;
  hasStar?: boolean;
  primaryCategory?: string | null;
  starRecordId?: number | null;
  isEditable?: boolean;
}

export interface DailyCalendarGroup {
  titleId?: number;
  projectTag?: string;
  freeText?: string;
  isEditable?: boolean;
  items?: DailyCalendarItem[];
}

export interface DailyCalendarData {
  detailTags?: string[];
  groups?: DailyCalendarGroup[];
}
