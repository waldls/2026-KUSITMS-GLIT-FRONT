import type { Meta, StoryObj } from "@storybook/nextjs";

import NavigationBar from "@/components/common/NavigationBar";

const meta = {
  title: "Common/NavigationBar",
  component: NavigationBar,
  parameters: {
    layout: "fullscreen",
    nextjs: { appDirectory: true },
  },
  decorators: [
    (Story, context) =>
      context.viewMode === "docs" ? (
        <div className="flex flex-col justify-end" style={{ height: 140 }}>
          <Story />
        </div>
      ) : (
        <div className="flex h-screen flex-col items-center justify-center">
          <Story />
        </div>
      ),
  ],
  tags: ["autodocs"],
} satisfies Meta<typeof NavigationBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Home: Story = {
  parameters: {
    nextjs: { appDirectory: true, navigation: { pathname: "/" } },
  },
};

export const Calendar: Story = {
  parameters: {
    nextjs: { appDirectory: true, navigation: { pathname: "/calendar" } },
  },
};

export const Write: Story = {
  parameters: {
    nextjs: { appDirectory: true, navigation: { pathname: "/record" } },
  },
};

export const Report: Story = {
  parameters: {
    nextjs: { appDirectory: true, navigation: { pathname: "/report" } },
  },
};

export const Mypage: Story = {
  parameters: {
    nextjs: { appDirectory: true, navigation: { pathname: "/my" } },
  },
};
