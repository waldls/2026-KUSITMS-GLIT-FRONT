"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import Header from "@/components/common/Header";
import ActionSection from "@/containers/calendar/ActionSection";
import ResultSection from "@/containers/calendar/ResultSection";
import ScrumInfoCard from "@/containers/calendar/ScrumInfoCard";
import SituationTaskSection from "@/containers/calendar/SituationTaskSection";
import { getStarDetail } from "@/lib/apis/record/starRecord";

const Page = () => {
  const router = useRouter();
  const { date, id } = useParams<{ date: string; id: string }>();
  const [data, setData] = useState<Awaited<ReturnType<typeof getStarDetail>> | null>(null);

  useEffect(() => {
    let ignore = false;

    const loadStarDetail = async () => {
      try {
        const starDetail = await getStarDetail(Number(id));
        if (!ignore) setData(starDetail);
      } catch {
        if (!ignore) setData(null);
      }
    };

    void loadStarDetail();

    return () => {
      ignore = true;
    };
  }, [id]);

  if (!data) return null;

  return (
    <div className="flex h-screen w-full flex-col">
      <Header title={data.projectTag ?? ""} onLeftClick={() => router.push(`/calendar/${date}`)} />
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
              <SituationTaskSection situationTask={data.situationTask ?? ""} />
              <ActionSection action={data.action ?? ""} />
              <ResultSection result={data.result ?? ""} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
