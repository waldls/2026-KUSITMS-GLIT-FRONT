import type { Meta, StoryObj } from "@storybook/nextjs";

import { ClosedEyeIcon, ErrorIcon, OpenEyeIcon, SearchIcon } from "@/assets/icons";
import TextField from "@/components/common/TextField";

const meta = {
  title: "Common/TextField",
  component: TextField,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: "내용 입력",
  },
};

export const DefaultWithIcon: Story = {
  args: {
    placeholder: "검색어를 입력하세요",
    rightIcon: <SearchIcon />,
  },
};

export const FilledBlurred: Story = {
  args: {
    placeholder: "내용 입력",
    defaultValue: "입력된 텍스트",
  },
};

export const FilledBlurredWithIcon: Story = {
  args: {
    placeholder: "비밀번호 입력",
    defaultValue: "mypassword123",
    rightIcon: <OpenEyeIcon />,
  },
};

export const FilledFocused: Story = {
  args: {
    placeholder: "내용 입력",
    defaultValue: "입력된 텍스트",
  },
};

export const FilledFocusedWithIcon: Story = {
  args: {
    placeholder: "비밀번호 입력",
    defaultValue: "mypassword123",
    rightIcon: <ClosedEyeIcon />,
  },
};

export const WithCount: Story = {
  args: {
    placeholder: "내용 입력",
    showCount: true,
    maxLength: 12,
  },
};

export const WithCountAndIcon: Story = {
  args: {
    placeholder: "내용 입력",
    rightIcon: <SearchIcon />,
    showCount: true,
    maxLength: 12,
  },
};

export const Error: Story = {
  args: {
    variant: "error",
    id: "email-error",
    placeholder: "이메일 입력",
    errorMessage: "이메일 형식이 올바르지 않습니다",
    rightIcon: <ErrorIcon />,
  },
};

export const ErrorWithCount: Story = {
  args: {
    id: "count-error",
    variant: "error",
    placeholder: "내용 입력",
    defaultValue: "입력된 텍스트입니다",
    errorMessage: "내용이 올바르지 않습니다",
    showCount: true,
    maxLength: 12,
  },
};

export const ErrorWithCountAndIcon: Story = {
  args: {
    id: "count-icon-error",
    variant: "error",
    placeholder: "내용 입력",
    defaultValue: "입력된 텍스트입니다",
    errorMessage: "내용이 올바르지 않습니다",
    rightIcon: <ErrorIcon />,
    showCount: true,
    maxLength: 12,
  },
};

export const AllStates: Story = {
  render: () => (
    <div className="mt-12 flex flex-col gap-12">
      <div className="flex flex-col gap-2">
        <label className="body-5 text-gray-600">Default</label>
        <TextField placeholder="내용 입력" />
      </div>

      <div className="flex flex-col gap-2">
        <label className="body-5 text-gray-600">Default + Icon</label>
        <TextField placeholder="검색어를 입력하세요" rightIcon={<SearchIcon />} />
      </div>

      <div className="flex flex-col gap-2">
        <label className="body-5 text-gray-600">Filled</label>
        <TextField placeholder="내용 입력" defaultValue="입력된 텍스트" />
      </div>

      <div className="flex flex-col gap-2">
        <label className="body-5 text-gray-600">Filled + Icon</label>
        <TextField
          placeholder="비밀번호 입력"
          defaultValue="mypassword123"
          rightIcon={<OpenEyeIcon />}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="body-5 text-gray-600">Error</label>
        <TextField
          id="email-field"
          variant="error"
          placeholder="이메일 입력"
          errorMessage="이메일 형식이 올바르지 않습니다"
          rightIcon={<ErrorIcon />}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="body-5 text-gray-600">With Count</label>
        <TextField placeholder="내용 입력" showCount maxLength={12} />
      </div>

      <div className="flex flex-col gap-2">
        <label className="body-5 text-gray-600">With Count + Icon</label>
        <TextField placeholder="내용 입력" rightIcon={<SearchIcon />} showCount maxLength={12} />
      </div>

      <div className="flex flex-col gap-2">
        <label className="body-5 text-gray-600">Error + Count</label>
        <TextField
          id="count-error-field"
          variant="error"
          placeholder="내용 입력"
          errorMessage="내용이 올바르지 않습니다"
          showCount
          maxLength={12}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="body-5 text-gray-600">Error + Count + Icon</label>
        <TextField
          id="count-icon-error-field"
          variant="error"
          placeholder="내용 입력"
          errorMessage="내용이 올바르지 않습니다"
          rightIcon={<ErrorIcon />}
          showCount
          maxLength={12}
        />
      </div>
    </div>
  ),
};
