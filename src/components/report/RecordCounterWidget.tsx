interface RecordCounterWidgetProps {
  selectedCount: number;
  totalCount: number;
  isActive?: boolean;
}

const RecordCounterWidget = ({
  selectedCount,
  totalCount,
  isActive = false,
}: RecordCounterWidgetProps) => (
  <div
    className={`rounded-8 bg-gray-850 flex items-center gap-4.5 border-l-4 px-4 py-1 shadow-[0_0_6px_-1px_rgba(210,252,255,0.14)] ${isActive ? "border-sea-blue-500" : "border-gray-300"}`}>
    <span className="body-2 text-gray-400">심화기록</span>
    <div className="h-4 w-px bg-gray-800" />
    <div className="flex items-end gap-1.5">
      <span className="head-3 text-sea-blue-100">{selectedCount}</span>
      <div className="body-2 flex items-center gap-1.5 pb-0.5 text-gray-600">
        <span>/</span>
        <span>{totalCount}</span>
      </div>
    </div>
  </div>
);

export default RecordCounterWidget;
