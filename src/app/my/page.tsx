import Header from "@/components/common/Header";
import NavigationBar from "@/components/common/NavigationBar";
import MenuSection from "@/containers/my/MenuSection";
import ProfileSection from "@/containers/my/profile/ProfileSection";
import { getMe } from "@/lib/apis/user/user";

const page = async () => {
  const profile = await getMe();

  return (
    <div className="flex h-full w-full flex-col">
      <Header title="마이페이지" leftIcon={null} />

      <div className="scrollbar-hide mt-2 flex-1 overflow-y-auto px-5">
        <div className="flex flex-col items-center gap-8">
          <ProfileSection profile={profile} />
          <MenuSection />
        </div>
      </div>

      <NavigationBar />
    </div>
  );
};

export default page;
