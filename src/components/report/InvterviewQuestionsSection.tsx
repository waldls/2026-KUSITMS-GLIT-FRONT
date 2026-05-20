import type { InterviewQuestion } from "@/data/report";

interface InvterviewQuestionsSectionProps {
  interviewQuestions: InterviewQuestion[];
}

const InvterviewQuestionsSection = ({ interviewQuestions }: InvterviewQuestionsSectionProps) => {
  return (
    <div className="flex flex-col gap-4">
      {interviewQuestions.map((item, i) => (
        <div key={i} className="rounded-12 flex-1 bg-gray-300 px-3 py-4">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
              <p className="body-3 text-black">면접관이 파고들 포인트 {i + 1}</p>
              <p className="body-4 text-gray-900">{item.question}</p>
            </div>
            <div className="flex flex-col gap-1">
              {item.evidenceRecords.map(record => (
                <p key={record.starRecordId} className="body-5 text-gray-700 underline">
                  [{record.title}] {record.recordedAt}
                </p>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default InvterviewQuestionsSection;
