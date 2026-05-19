import { MyPageIcon } from "@/assets/icons";
import Tag from "@/components/common/Tag";

const ActionSection = ({ action }: { action: string }) => {
  return (
    <div className="bg-gray-850 rounded-12 p-4">
      <div className="flex flex-col gap-3 pb-2">
        <Tag variant="gray" className="text-gray-100">
          <MyPageIcon className="size-4" />
          행동
        </Tag>
        <p className="body-3 text-gray-100">
          목표를 위해 어떤 행동을 했고, <br />
          그렇게 한 이유도 있었나요?
        </p>
      </div>
      <p className="body-5 text-gray-500">{action}</p>
    </div>
  );
};

export default ActionSection;
