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

/** 빈 칸, 포커스 없음 — placeholder·밑줄 gray-800 */
export const Default: Story = {
  args: {
    placeholder: "내용 입력",
  },
};

/** 빈 칸, 포커스 없음 + 아이콘 */
export const DefaultWithIcon: Story = {
  args: {
    placeholder: "검색어를 입력하세요",
    rightIcon: <SearchIcon />,
  },
};

/** 입력 후 손 뗌 — 글자·밑줄 gray-500 */
export const FilledBlurred: Story = {
  args: {
    placeholder: "내용 입력",
    defaultValue: "입력된 텍스트",
  },
};

/** 입력 후 손 뗌 + 아이콘 */
export const FilledBlurredWithIcon: Story = {
  args: {
    placeholder: "비밀번호 입력",
    defaultValue: "mypassword123",
    rightIcon: <OpenEyeIcon />,
  },
};

/** 입력 중 (포커스) — 글자·밑줄 gray-300 */
export const FilledFocused: Story = {
  args: {
    placeholder: "내용 입력",
    defaultValue: "입력된 텍스트",
    autoFocus: true,
  },
};

/** 입력 중 (포커스) + 아이콘 */
export const FilledFocusedWithIcon: Story = {
  args: {
    placeholder: "비밀번호 입력",
    defaultValue: "mypassword123",
    autoFocus: true,
    rightIcon: <ClosedEyeIcon />,
  },
};

/** 글자수 카운트 */
export const DefaultWithCount: Story = {
  args: {
    placeholder: "내용 입력",
    showCount: true,
    maxLength: 12,
  },
};

/** 글자수 카운트 + 아이콘 */
export const DefaultWithCountAndIcon: Story = {
  args: {
    placeholder: "내용 입력",
    rightIcon: <SearchIcon />,
    showCount: true,
    maxLength: 12,
  },
};

/** 글자수 카운트 + 에러 */
export const ErrorStateWithCount: Story = {
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

/** 글자수 카운트 + 아이콘 + 에러 */
export const ErrorStateWithCountAndIcon: Story = {
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

/** 에러 상태 */
export const ErrorState: Story = {
  args: {
    variant: "error",
    id: "email-error",
    placeholder: "이메일 입력",
    errorMessage: "이메일 형식이 올바르지 않습니다",
    rightIcon: <ErrorIcon />,
  },
};

/** 전체 상태 한눈에 보기 */
export const AllStates: Story = {
  render: () => (
    <div className="mt-12 flex flex-col gap-12">
      <div className="flex flex-col gap-2">
        <label className="body-4 text-gray-600">빈 칸 (포커스 없음)</label>
        <TextField placeholder="내용 입력" />
      </div>

      <div className="flex flex-col gap-2">
        <label className="body-4 text-gray-600">빈 칸 (포커스 없음) + 아이콘</label>
        <TextField placeholder="검색어를 입력하세요" rightIcon={<SearchIcon />} />
      </div>

      <div className="flex flex-col gap-2">
        <label className="body-4 text-gray-600">입력 후 손 뗌 — 글자·밑줄 gray-500</label>
        <TextField placeholder="내용 입력" defaultValue="입력된 텍스트" />
      </div>

      <div className="flex flex-col gap-2">
        <label className="body-4 text-gray-600">입력 후 손 뗌 + 아이콘 — 글자·밑줄 gray-500</label>
        <TextField
          placeholder="비밀번호 입력"
          defaultValue="mypassword123"
          rightIcon={<OpenEyeIcon />}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="body-4 text-gray-600">입력 중 (포커스) — 글자·밑줄 gray-300</label>
        <TextField placeholder="내용 입력" defaultValue="입력된 텍스트" autoFocus />
      </div>

      <div className="flex flex-col gap-2">
        <label className="body-4 text-gray-600">
          입력 중 (포커스) + 아이콘 — 글자·밑줄 gray-300
        </label>
        <TextField
          placeholder="비밀번호 입력"
          defaultValue="mypassword123"
          autoFocus
          rightIcon={<ClosedEyeIcon />}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="body-4 text-gray-600">에러 상태</label>
        <TextField
          id="email-field"
          variant="error"
          placeholder="이메일 입력"
          errorMessage="이메일 형식이 올바르지 않습니다"
          rightIcon={<ErrorIcon />}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="body-4 text-gray-600">글자 수 카운트</label>
        <TextField placeholder="내용 입력" showCount maxLength={12} />
      </div>

      <div className="flex flex-col gap-2">
        <label className="body-4 text-gray-600">글자 수 카운트 + 아이콘</label>
        <TextField placeholder="내용 입력" rightIcon={<SearchIcon />} showCount maxLength={12} />
      </div>

      <div className="flex flex-col gap-2">
        <label className="body-4 text-gray-600">글자 수 카운트 + 에러</label>
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
        <label className="body-4 text-gray-600">글자 수 카운트 + 아이콘 + 에러</label>
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
