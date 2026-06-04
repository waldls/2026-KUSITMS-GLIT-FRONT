import Image from "next/image";

import characterProfile from "@/assets/images/my/character_profile.png";
import type { UserProfile } from "@/types/user/user";

interface Props {
  profile: UserProfile | null;
}

const ProfileSection = ({ profile }: Props) => {
  const { nickname, jobRole, userStatus } = profile ?? {};

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="size-31 overflow-hidden rounded-full">
        <Image
          src={characterProfile}
          alt="프로필 이미지"
          width={124}
          height={124}
          className="size-full object-cover"
          priority
        />
      </div>
      <div className="flex flex-col items-center gap-0.5">
        <p className="head-5 text-white">{nickname}</p>
        {(jobRole || userStatus) && (
          <p className="body-2 text-gray-700">{[jobRole, userStatus].filter(Boolean).join(", ")}</p>
        )}
      </div>
    </div>
  );
};

export default ProfileSection;
