"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";

import characterLiedown from "@/assets/images/report/character_liedown.png";
import LoadingScreen from "@/components/common/LoadingScreen";
import { getStatus, postReports, postRetry } from "@/lib/apis/report/report";
import { getProgressStep } from "@/lib/utils/report";
import type { ReportCreateRequest, ReportStatus } from "@/types/report/report";

const GeneratePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get("type");

  const [reportId, setReportId] = useState<string | null>(searchParams.get("reportId"));
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [status, setStatus] = useState<ReportStatus>("GENERATING");
  const retryAvailableRef = useRef<boolean | null>(null);

  const progress = status === "SUCCESS" ? 100 : animatedProgress;
  const title =
    type === "mini" ? "미니 리포트를 생성하고 있어요!" : "커리어 리포트를 생성하고 있어요!";

  useEffect(() => {
    const raw = sessionStorage.getItem("pendingReport");
    if (!raw) return;
    sessionStorage.removeItem("pendingReport");

    const body = JSON.parse(raw) as ReportCreateRequest;
    const typeParam = body.reportType === "MINI" ? "mini" : "career";
    postReports(body).then(res => {
      if (res?.reportId) {
        const id = String(res.reportId);
        setReportId(id);
        router.replace(`/report/generate?type=${typeParam}&reportId=${id}`);
      }
    });
  }, [router]);

  // 폴링: 2초마다 상태 조회
  useEffect(() => {
    if (!reportId || status === "SUCCESS" || status === "FAILED") return;

    const poll = setInterval(async () => {
      const res = await getStatus(Number(reportId));
      if (res) {
        retryAvailableRef.current = res.retryAvailable;
        setStatus(res.status);
      }
    }, 2000);

    return () => clearInterval(poll);
  }, [reportId, status]);

  // FAILED 시 retryAvailable이면 자동 재시도, 아니면 생성 화면으로 복귀
  useEffect(() => {
    if (status !== "FAILED" || !reportId) return;

    if (!retryAvailableRef.current) {
      router.replace("/report/create");
      return;
    }

    const retry = async () => {
      const res = await postRetry(Number(reportId));
      if (res) {
        retryAvailableRef.current = null;
        setAnimatedProgress(0);
        setStatus("GENERATING");
      }
    };
    retry();
  }, [status, reportId, router]);

  // SUCCESS 시 2초 후 리포트 상세 페이지로 이동
  useEffect(() => {
    if (status !== "SUCCESS" || !reportId) return;

    const path = type === "mini" ? `/report/mini/${reportId}` : `/report/career/${reportId}`;
    const timer = setTimeout(() => router.push(path), 2000);
    return () => clearTimeout(timer);
  }, [status, reportId, type, router]);

  // 진행률 애니메이션: 초반 빠르게, 후반 느리게
  useEffect(() => {
    if (status !== "GENERATING" || animatedProgress >= 99) return;

    const { delay, step } = getProgressStep(animatedProgress);

    const timer = setTimeout(() => {
      setAnimatedProgress(prev => Math.min(prev + step, 99));
    }, delay);

    return () => clearTimeout(timer);
  }, [status, animatedProgress]);

  return (
    <section className="bg-star-complete-gradient flex h-full w-full flex-col items-center justify-center overflow-hidden">
      <div className="star-complete-wave" aria-hidden />
      <div className="star-analysis-wind star-analysis-wind-blue" aria-hidden />
      <div className="relative z-10 flex flex-col items-center">
        <Image
          src={characterLiedown}
          alt="리포트 생성 중"
          width={173}
          height={104}
          sizes="173px"
          priority
        />
        <p className="animate-star-complete-copy head-3 pb-1 text-gray-100">{title}</p>
        <p className="animate-star-complete-copy text-typo-tertiary body-2 pb-7">
          최대 1분 정도 소요될 수 있어요.
        </p>
        <p className="animate-star-complete-copy body-3 text-gradient-100">{progress}% 완료</p>
      </div>
    </section>
  );
};

const Page = () => (
  <Suspense fallback={<LoadingScreen />}>
    <GeneratePage />
  </Suspense>
);

export default Page;
