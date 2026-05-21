import RadarChart from "@/components/home/RadarChart";
import { mockRadarChartData } from "@/data/radarchart";

const RadarChartSection = () => {
  return (
    <div className="bg-card rounded-12 flex w-full flex-col p-4">
      <p className="body-3 text-white">다솔님의 역량 기록 분포</p>
      <div className="flex items-center justify-center">
        <RadarChart data={mockRadarChartData} />
      </div>
    </div>
  );
};

export default RadarChartSection;
