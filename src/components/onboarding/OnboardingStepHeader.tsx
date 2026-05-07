interface OnboardingStepHeaderProps {
  title: string;
  description: string;
}

const OnboardingStepHeader = ({ title, description }: OnboardingStepHeaderProps) => {
  return (
    <div>
      <h2 className="head-3 text-white">{title}</h2>
      <p className="body-4 mt-0.5 text-gray-700">{description}</p>
    </div>
  );
};

export default OnboardingStepHeader;
