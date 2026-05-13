import type { Meta, StoryObj } from "@storybook/nextjs";

import { HeatmapCell, statusToLevel } from "@/components/home/Heatmap";
import { mockHeatmapData } from "@/data/heatmap";

const cellMeta = {
  title: "Home/HeatmapCell",
  component: HeatmapCell,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    date: { control: "text" },
  },
} satisfies Meta<typeof HeatmapCell>;

export default cellMeta;
type CellStory = StoryObj<typeof cellMeta>;

const CellWrapper = (args: React.ComponentProps<typeof HeatmapCell>) => (
  <div className="size-7.5">
    <HeatmapCell {...args} />
  </div>
);

export const Default: CellStory = {
  render: args => <CellWrapper {...args} />,
  args: { level: "default", date: "2026-05-08" },
};
export const Level1: CellStory = {
  render: args => <CellWrapper {...args} />,
  args: { level: 1, date: "2026-05-01" },
};
export const Level2: CellStory = {
  render: args => <CellWrapper {...args} />,
  args: { level: 2, date: "2026-05-02" },
};
export const Full: CellStory = {
  render: args => <CellWrapper {...args} />,
  args: { level: "full", date: "2026-05-03" },
};

export const AllVariants: CellStory = {
  args: { level: "default", date: "2026-05-08" },
  render: () => (
    <div className="grid grid-cols-9 gap-1">
      {mockHeatmapData.days.map(({ date, status }) => (
        <HeatmapCell key={date} level={statusToLevel[status]} date={date} />
      ))}
    </div>
  ),
};
