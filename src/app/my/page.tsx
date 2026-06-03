import { Suspense } from "react";

import Header from "@/components/common/Header";
import NavigationBar from "@/components/common/NavigationBar";
import MenuSection from "@/containers/my/MenuSection";
import ProfileSection from "@/containers/my/profile/ProfileSection";
import { getMe } from "@/lib/apis/user/user.server";

const ProfileSectionFetcher = async () => {
  const profile = await getMe();
  return <ProfileSection profile={profile} />;
};

const ProfileSectionSkeleton = () => (
  <div className="flex flex-col items-center gap-3">
    <div className="bg-card size-31 animate-pulse rounded-full" />
    <div className="flex flex-col items-center gap-0.5">
      <div className="bg-card h-5 w-24 animate-pulse rounded" />
      <div className="bg-card mt-0.5 h-4 w-32 animate-pulse rounded" />
    </div>
  </div>
);

const page = () => {
  return (
    <div className="flex h-full w-full flex-col">
      <Header title="마이페이지" leftIcon={null} />

      <div className="scrollbar-hide mt-2 flex-1 overflow-y-auto px-5">
        <div className="flex flex-col items-center gap-8">
          <Suspense fallback={<ProfileSectionSkeleton />}>
            <ProfileSectionFetcher />
          </Suspense>
          <MenuSection />
        </div>
      </div>

      <NavigationBar />
    </div>
  );
};

export default page;
