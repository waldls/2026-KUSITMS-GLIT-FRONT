import ProfileForm from "@/components/my/ProfileForm";
import { mockUserProfile } from "@/data/user/user";

const Page = () => {
  return (
    <ProfileForm
      initialProfile={{
        nickname: mockUserProfile.nickname,
        jobRole: mockUserProfile.jobRole,
        userStatus: mockUserProfile.userStatus,
      }}
    />
  );
};

export default Page;
