export interface PatchMeBody {
  jobRole: string;
  userStatus: string;
}

export interface UserProfile {
  profileImage: string | null;
  nickname: string;
  jobRole: string;
  userStatus: string;
  consecutiveRecordDays: number;
  glaring: boolean;
}
