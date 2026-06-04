import type { Meta, StoryObj } from "@storybook/nextjs";

import ReportCard from "@/components/report/ReportCard";
import type { Report } from "@/types/report/report";

const mockReports: Report[] = [
  {
    reportId: 3,
    reportType: "CAREER",
    status: "GENERATING",
    createdAt: "2026.04.12",
    title: "디솔님은 문제를 구조화하고, 데이터로 해결하는 기획자입니다.",
    previewText:
      '"꾸준함이 만든 변화"가 가장 크게 보인 시기였어요. 기록을 통해 스스로를 돌아보는 빈도가 늘어나면서, 작은 행동이 쌓여 실력이 되는 과정을 직접 체감하고 있습니다.',
    competencyStatSummary: null,
  },
  {
    reportId: 2,
    reportType: "CAREER",
    status: "SUCCESS",
    createdAt: "2026.04.10",
    title: "다솔님은 복잡한 문제를 구조로 풀어내는 '설계형 기획자'입니다.",
    previewText:
      "복수의 프로젝트를 동시에 진행하면서도 각 과제의 핵심을 놓치지 않는 집중력이 돋보였어요. 혼란스러운 상황일수록 구조를 먼저 잡고 움직이는 패턴이 뚜렷하게 나타났습니다.",
    competencyStatSummary: null,
  },
  {
    reportId: 1,
    reportType: "MINI",
    status: "SUCCESS",
    createdAt: "2026.03.01",
    title: "다솔님은 어떤 기획자로 성장하고 있을까요?",
    previewText:
      "이번 달은 실행보다 고민이 앞섰던 시기예요. 방향을 잡기 위해 많은 에너지를 쏟았고, 그 과정에서 스스로의 판단 기준이 조금씩 선명해지고 있다는 걸 느꼈을 거예요.",
    competencyStatSummary: null,
  },
];

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

export const Playground: Story = {};

export const Career: Story = {
  name: "Career Report",
  args: { report: mockReports[1] },
};

export const Mini: Story = {
  name: "Mini Report",
  args: { report: mockReports[2] },
};

export const AllVariants: Story = {
  parameters: { layout: "fullscreen" },
  render: () => (
    <div className="min-h-screen bg-gray-900 p-10">
      <div className="mx-auto flex w-97.5 flex-col gap-4">
        {mockReports.map(report => (
          <ReportCard key={report.reportId} report={report} />
        ))}
      </div>
    </div>
  ),
};
