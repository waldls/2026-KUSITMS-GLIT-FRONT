interface HeatmapIndicatorProps {
  total: number;
  current: number;
}

const HeatmapIndicator = ({ total, current }: HeatmapIndicatorProps) => {
  return (
    <div className="flex items-center justify-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`size-1.5 rounded-full transition-colors duration-300 ${
            i === current ? "bg-gray-100" : "bg-gray-800"
          }`}
        />
      ))}
    </div>
  );
};

export default HeatmapIndicator;
