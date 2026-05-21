import { Suspense } from "react";

import SkillTaggingSection from "@/containers/record/skill-tagging/SkillTaggingSection";

const page = () => (
  <Suspense>
    <SkillTaggingSection />
  </Suspense>
);

export default page;
