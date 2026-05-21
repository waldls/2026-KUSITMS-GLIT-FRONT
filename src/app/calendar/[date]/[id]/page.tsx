"use client";

import { useParams, useRouter } from "next/navigation";

import Header from "@/components/common/Header";
import ActionSection from "@/containers/calendar/ActionSection";
import ResultSection from "@/containers/calendar/ResultSection";
import ScrumInfoCard from "@/containers/calendar/ScrumInfoCard";
import SituationTaskSection from "@/containers/calendar/SituationTaskSection";
import { mockStarRecordDetail } from "@/data/calendar";

const Page = () => {
  const router = useRouter();
  const params = useParams();

  const data = mockStarRecordDetail;

  return (
    <div className="flex h-screen w-full flex-col">
      <Header title={data.projectName} onLeftClick={() => router.push(`/calendar/${params.id}`)} />
      <div className="scrollbar-hide flex-1 overflow-y-auto px-5 py-4">
        <div className="flex flex-col gap-6.25">
          <ScrumInfoCard
            freeText={data.freeText}
            scrumContent={data.scrumContent}
            primaryCategory={data.primaryCategory}
            detailTags={data.detailTags}
            images={data.images}
          />
          <div className="flex flex-col gap-3">
            <p className="body-3 text-gray-100">STAR 회고</p>
            <div className="flex flex-col gap-4">
              <SituationTaskSection situationTask={data.situationTask} />
              <ActionSection action={data.action} />
              <ResultSection result={data.result} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
