import Image from "next/image";

import HeartImage from "@/assets/images/record/hearts-3.png";

const StarAllComplete = () => {
  return (
    <section className="bg-star-complete-gradient -mx-5 flex min-h-0 flex-1 flex-col px-5">
      <div className="flex-[0.4]" />
      <div className="flex flex-col items-center">
        <Image src={HeartImage} alt="모든 작업 기록 완료" width={128} height={128} priority />
        <p className="head-4 mt-3.75 text-white">모든 작업 기록 완료</p>
      </div>
      <div className="flex-[0.4]" />
    </section>
  );
};

export default StarAllComplete;
