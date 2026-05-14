import Header from "@/components/common/Header";
import NavigationBar from "@/components/common/NavigationBar";
import MenuSection from "@/components/my/MenuSection";
import ProfileSection from "@/components/my/ProfileSection";
import { mockUserProfile } from "@/data/user/user";

const page = () => {
  return (
    <div className="flex h-full flex-col">
      <Header title="마이페이지" leftIcon={null} />

      <div className="scrollbar-hide mt-2 flex-1 overflow-y-auto px-5">
        <div className="flex flex-col items-center gap-8">
          <ProfileSection
            profileImage={mockUserProfile.profileImage}
            nickname={mockUserProfile.nickname}
            jobRole={mockUserProfile.jobRole}
            userStatus={mockUserProfile.userStatus}
          />
          <MenuSection />
        </div>
      </div>

      <NavigationBar />
    </div>
  );
};

export default page;
