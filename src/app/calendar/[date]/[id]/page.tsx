import Header from "@/components/common/Header";
import ActionSection from "@/containers/calendar/ActionSection";
import ResultSection from "@/containers/calendar/ResultSection";
import ScrumInfoCard from "@/containers/calendar/ScrumInfoCard";
import SituationTaskSection from "@/containers/calendar/SituationTaskSection";
import { getStarRecordId } from "@/lib/apis/record/starRecord.server";

interface PageProps {
  params: Promise<{ date: string; id: string }>;
}

const page = async ({ params }: PageProps) => {
  const { id } = await params;

  let data: Awaited<ReturnType<typeof getStarRecordId>> | null = null;
  try {
    data = await getStarRecordId(Number(id));
  } catch {
    data = null;
  }

  if (!data) return null;

  return (
    <div className="flex h-screen w-full flex-col">
      <Header title={data.projectTag ?? ""} />
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

export default page;
