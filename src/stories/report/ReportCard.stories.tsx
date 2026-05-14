import type { Meta, StoryObj } from "@storybook/nextjs";

import ReportCard from "@/components/report/ReportCard";
import { mockReports } from "@/data/report";

const meta = {
  title: "Report/ReportCard",
  component: ReportCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    report: mockReports[0],
  },
  argTypes: {
    report: { control: false },
  },
} satisfies Meta<typeof ReportCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Playground ────────────────────────────────────────────────────────────

export const Playground: Story = {};

// ─── 개별 케이스 ────────────────────────────────────────────────────────────

export const Career: Story = {
  name: "CAREER — 커리어 리포트",
  args: { report: mockReports[1] },
};

export const Mini: Story = {
  name: "MINI — 미니 리포트",
  args: { report: mockReports[0] },
};

// ─── 전체 변형 모음 ────────────────────────────────────────────────────────

export const AllVariants: Story = {
  name: "전체 변형 모음",
  parameters: { layout: "fullscreen" },
  render: () => (
    <div className="min-h-screen bg-gray-900 p-10">
      <div className="mx-auto flex w-[390px] flex-col gap-4">
        {mockReports.map(report => (
          <ReportCard key={report.reportId} report={report} />
        ))}
      </div>
    </div>
  ),
};
