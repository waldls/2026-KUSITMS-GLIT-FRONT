interface PatternSectionProps {
  pattern: string;
}

const PatternSection = ({ pattern }: PatternSectionProps) => {
  return (
    <div className="border-linear-100 rounded-8 px-10 py-5">
      <p className="body-2 mx-auto max-w-43.75 text-center break-keep text-gray-100">{pattern}</p>
    </div>
  );
};

export default PatternSection;
