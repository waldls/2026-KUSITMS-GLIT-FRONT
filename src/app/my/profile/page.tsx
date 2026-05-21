import ProfileForm from "@/containers/my/profile/ProfileForm";
import { getMe } from "@/lib/apis/user/getMe";

const Page = async () => {
  const profile = await getMe();

  return (
    <ProfileForm
      initialProfile={{
        nickname: profile!.nickname,
        jobRole: profile!.jobRole,
        userStatus: profile!.userStatus,
      }}
    />
  );
};

export default Page;
