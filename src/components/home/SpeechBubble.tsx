import SpeechBubbleTail from "@/assets/images/home/speechbubbletail.svg";

const SpeechBubble = () => {
  return (
    <div className="relative inline-flex w-max shrink-0 flex-col items-center">
      <div className="rounded-8 bg-gray-800 px-4.5 py-2.5 whitespace-nowrap">
        <p className="body-5 text-white">여기서 내 기록을 모아볼 수 있어요!</p>
      </div>
      <SpeechBubbleTail className="absolute bottom-2 left-1/2 size-4.5 -translate-x-1/2 translate-y-full" />
    </div>
  );
};

export default SpeechBubble;
