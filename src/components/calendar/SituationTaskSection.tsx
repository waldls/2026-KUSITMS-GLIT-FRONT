import { SearchIcon } from "@/assets/icons";
import Tag from "@/components/common/Tag";

const SituationTaskSection = ({ situationTask }: { situationTask: string }) => {
  return (
    <div className="bg-gray-850 rounded-12 p-4">
      <div className="flex flex-col gap-3 pb-2">
        <Tag variant="gray" className="text-gray-100">
          <SearchIcon className="size-4" />
          상황/과제
        </Tag>
        <p className="body-3 text-gray-100">
          어떤 상황에서 이 일을 맡게 됐고, <br />
          목표는 무엇이었나요?
        </p>
      </div>
      <p className="body-5 text-gray-500">{situationTask}</p>
    </div>
  );
};

export default SituationTaskSection;
