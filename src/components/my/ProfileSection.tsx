import Image from "next/image";

import type { UserProfile } from "@/types/user/user";

type Props = Pick<UserProfile, "profileImage" | "nickname" | "jobRole" | "userStatus">;

const ProfileSection = ({ profileImage, nickname, jobRole, userStatus }: Props) => {
  return (
    <div className="flex flex-col items-center gap-3">
      {profileImage ? (
        <div className="size-31 overflow-hidden rounded-full">
          <Image
            src={profileImage}
            alt="프로필 이미지"
            width={124}
            height={124}
            className="size-full object-cover"
          />
        </div>
      ) : (
        <div className="size-31 rounded-full bg-gray-700" />
      )}
      <div className="flex flex-col items-center gap-0.5">
        <p className="head-5 text-white">{nickname}</p>
        <p className="body-2 text-gray-700">
          {jobRole}, {userStatus}
        </p>
      </div>
    </div>
  );
};

export default ProfileSection;
