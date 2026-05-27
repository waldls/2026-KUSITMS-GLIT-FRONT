interface Props {
  nextFocusPoint: string;
}

const NextFocusPointSection = ({ nextFocusPoint }: Props) => {
  return (
    <div className="bg-gray-850 rounded-12 p-4 text-white">
      <div className="flex flex-col gap-2">
        <p className="body-3 text-gray-100">앞으로 주목할 포인트</p>
        <p className="body-4 text-gray-400">{nextFocusPoint}</p>
      </div>
    </div>
  );
};

export default NextFocusPointSection;
