import { StarTwoIcon } from "@/assets/icons";
import Tag from "@/components/common/Tag";

const ResultSection = ({ result }: { result: string }) => {
  return (
    <div className="bg-gray-850 rounded-12 p-4">
      <div className="flex flex-col gap-3 pb-2">
        <Tag variant="gray" className="text-gray-100">
          <StarTwoIcon className="size-4" />
          결과
        </Tag>
        <p className="body-3 text-gray-100">
          어떤 결과로 이어졌고, <br /> 이 경험에서 무엇을 배웠나요?
        </p>
      </div>
      <p className="body-5 text-gray-500">{result}</p>
    </div>
  );
};

export default ResultSection;
