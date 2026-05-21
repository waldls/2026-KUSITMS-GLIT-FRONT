// API: GET /api/reports/selectable-records/{date}
export interface DailySelectableRecord {
  starRecordId: number;
  projectName: string;
  scrumContent: string;
}

export interface DailySelectableRecords {
  date: string; // "YYYY-MM-DD"
  starRecords: DailySelectableRecord[];
}
