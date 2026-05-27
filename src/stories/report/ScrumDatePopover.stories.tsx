import type { Meta, StoryObj } from "@storybook/nextjs";
import { useState } from "react";

import ScrumDatePopover from "@/components/report/ScrumDatePopover";
import type { DailySelectableRecord } from "@/types/report/report";

const oneRecord: DailySelectableRecord[] = [
  { starRecordId: 1, projectName: "공모전", scrumContent: "사용성 테스트 5명 진행하고 결과 정리" },
];

const twoRecords: DailySelectableRecord[] = [
  { starRecordId: 1, projectName: "공모전", scrumContent: "사용성 테스트 5명 진행하고 결과 정리" },
  {
    starRecordId: 2,
    projectName: "글리트",
    scrumContent: "스프린트 회고 작성 완료 및 다음 스프린트 계획",
  },
];

const manyRecords: DailySelectableRecord[] = [
  { starRecordId: 1, projectName: "공모전", scrumContent: "사용성 테스트 5명 진행하고 결과 정리" },
  {
    starRecordId: 2,
    projectName: "글리트",
    scrumContent: "스프린트 회고 작성 완료 및 다음 스프린트 계획",
  },
  { starRecordId: 3, projectName: "사이드", scrumContent: "API 설계 문서 초안 작성" },
  { starRecordId: 4, projectName: "스터디", scrumContent: "React Query 발표 자료 준비" },
];

const meta = {
  title: "Report/ScrumDatePopover",
  component: ScrumDatePopover,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  args: {
    scrums: oneRecord,
    selectedIds: new Set<number>([1]),
    onToggle: () => {},
  },
  decorators: [
    Story => (
      <div className="relative mt-40 flex justify-center">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ScrumDatePopover>;

export default meta;
type Story = StoryObj<typeof meta>;

const InteractiveRender = ({ scrums }: { scrums: DailySelectableRecord[] }) => {
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set([scrums[0].starRecordId]));
  const toggle = (id: number) =>
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  return <ScrumDatePopover scrums={scrums} selectedIds={selectedIds} onToggle={toggle} />;
};

export const OneRecord: Story = {
  name: "1개",
  render: () => <InteractiveRender scrums={oneRecord} />,
};

export const TwoRecords: Story = {
  name: "2개",
  render: () => <InteractiveRender scrums={twoRecords} />,
};

export const ManyRecords: Story = {
  name: "4개",
  render: () => <InteractiveRender scrums={manyRecords} />,
};
