"use client";

import { useRouter } from "next/navigation";

import Header from "@/components/common/Header";

interface Props {
  title: string;
}

const ReportDetailHeader = ({ title }: Props) => {
  const router = useRouter();
  return <Header title={title} onLeftClick={() => router.push("/report")} />;
};

export default ReportDetailHeader;
