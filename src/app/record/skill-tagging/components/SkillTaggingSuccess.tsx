import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import HeartImage from "@/assets/images/record/hearts-3.png";
import CTA from "@/components/common/CTA";
import Modal from "@/components/common/Modal";
import Tag from "@/components/common/Tag";
import { RECORD_SKILL_TAGS } from "@/components/record/SkillTag";
import { mockReportGauge } from "@/data/report";

interface SkillTaggingTask {
  id: number;
  title: string;
  projectId: number;
  projectTag: string;
  projectTitle: string;
  skillId: number;
}

function getSkillIds(tasks: SkillTaggingTask[]) {
  return Array.from(new Set(tasks.map(task => task.skillId)));
}

function getExperienceTagLabels(tasks: SkillTaggingTask[]) {
  return Array.from(new Set(tasks.flatMap(task => [task.projectTag, task.title])));
}

function getHeartItems(count: number) {
  return Array.from({ length: Math.min(Math.max(count, 1), 20) }, (_, index) => ({
    id: index,
  }));
}

function getReportMilestone(currentCount: number) {
  if (currentCount < 10) return null;
  if (currentCount % 10 !== 0) return null;

  return currentCount / 10;
}

function FloatingHeart() {
  return (
    <Image
      src={HeartImage}
      alt="역량 태깅 성공"
      width={68}
      height={68}
      priority
      className="object-contain"
    />
  );
}

function SkillTaggingSuccess({
  tasks,
  shouldCheckMiniReport,
}: {
  tasks: SkillTaggingTask[];
  shouldCheckMiniReport: boolean;
}) {
  const router = useRouter();
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const skillIds = getSkillIds(tasks);
  const heartItems = getHeartItems(skillIds.length);
  const reportMilestone = getReportMilestone(mockReportGauge.currentCount);
  const isReportReady = shouldCheckMiniReport && reportMilestone !== null;
  const reportModalTitle =
    reportMilestone === 1 ? "커리어 미니 리포트를 발행해보세요" : "커리어 리포트를 발행해보세요";

  useEffect(() => {
    if (!isReportReady) return;

    const reportModalTimer = window.setTimeout(() => {
      setIsReportModalOpen(true);
    }, 1500);

    return () => {
      window.clearTimeout(reportModalTimer);
    };
  }, [isReportReady]);

  return (
    <section className="relative -mx-5 flex min-h-0 flex-1 flex-col overflow-hidden px-5">
      {/* TODO: 추후 gif 파일로 이미지 변경 예정 */}
      <div className="relative flex min-h-0 flex-1 flex-col items-center justify-center">
        <div className="flex max-w-48 flex-wrap justify-center gap-4.5">
          {heartItems.map(heart => (
            <FloatingHeart key={heart.id} />
          ))}
        </div>

        <div className="relative z-10 flex flex-col items-center">
          <div className="mt-3.75 flex flex-col items-center px-8">
            <p className="head-4 text-white">오늘의 경험이</p>
            <h1 className="head-4 text-sea-blue-500 text-center">
              [
              {skillIds
                .map(skillId => RECORD_SKILL_TAGS.find(skill => skill.id === skillId)?.label)
                .join("] [")}
              ]
            </h1>
            <p className="head-4 text-white">으로 기록됐어요</p>
          </div>

          <div className="scrollbar-hide mt-3 flex flex-wrap justify-center gap-1 overflow-y-auto px-3">
            {getExperienceTagLabels(tasks).map(tagLabel => (
              <Tag key={tagLabel} variant="gray" className="bg-gray-850">
                #{tagLabel}
              </Tag>
            ))}
          </div>
        </div>
      </div>
      <div className="relative z-10 shrink-0 py-4">
        <Link href="/">
          <CTA>홈으로 돌아가기</CTA>
        </Link>
      </div>

      {/* 심화기록 10개 단위로 달성 시 팝업 모달 */}
      <Modal
        isOpen={isReportModalOpen}
        type="double"
        title={reportModalTitle}
        contents={
          <>
            지금까지 쌓인 기록으로 만들어진
            <br />
            커리어 미니 리포트를 확인해보세요
          </>
        }
        btnLLabel="다음에 보기"
        btnRLabel="리포트 만들기"
        onBtnLClick={() => setIsReportModalOpen(false)}
        onBtnRClick={() => router.push("/report")}
        contentClassName="px-7 py-5"
        btnLClassName="px-5"
        btnRClassName="px-5"
      />
    </section>
  );
}

export default SkillTaggingSuccess;
