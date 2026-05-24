import ProfileForm from "@/containers/my/profile/ProfileForm";
import { getMeServer } from "@/lib/apis/user/userServer";

const Page = async () => {
  const profile = await getMeServer();

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
