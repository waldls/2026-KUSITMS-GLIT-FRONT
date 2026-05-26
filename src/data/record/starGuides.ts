import type { Competency } from "@/types/competency";

export const STAR_JOB_KEYS = ["planner", "developer", "designer"] as const;

export type StarJobKey = (typeof STAR_JOB_KEYS)[number];
export type StarStepKey = "situation" | "action" | "result";
export type StarSkillId = 1 | 2 | 3 | 4 | 5;

type StarGuideExample = Record<StarStepKey, string>;
type StarGuideExamples = Record<StarJobKey, Record<StarSkillId, StarGuideExample>>;

const FALLBACK_STAR_JOB_KEY: StarJobKey = "planner";
const STAR_COMPETENCY_TO_SKILL_ID: Record<Competency, StarSkillId> = {
  DISCOVERY_ANALYSIS: 1,
  PLANNING_EXECUTION: 2,
  COLLABORATION: 3,
  PROBLEM_SOLVING: 4,
  REFLECTION_GROWTH: 5,
};

export const STAR_JOB_LABEL_TO_KEY: Record<string, StarJobKey> = {
  기획자: "planner",
  개발자: "developer",
  디자이너: "designer",
  planner: "planner",
  developer: "developer",
  designer: "designer",
};

export const STAR_GUIDE_EXAMPLES: StarGuideExamples = {
  planner: {
    1: {
      situation:
        "Ex. 팀 프로젝트에서 유저 설문을 돌렸는데 응답 결과가 예상과 너무 달라서 원인을 직접 파악해야 했다",
      action:
        "Ex. 설문 응답을 항목별로 나눠 패턴을 찾고, 답변이 갈리는 지점을 중심으로 직접 인터뷰 대상을 골라 추가 질문을 했다",
      result:
        "Ex. 예상과 달리 유저가 기능 자체보다 워딩에 의해 어려움을 겪는다는 것을 발견해 UX를 고려하여 워딩을 더 친절하게 수정했다",
    },
    2: {
      situation:
        "Ex. 팀 프로젝트에서 개발과 디자인 작업이 병렬로 진행될 수 있도록, 핵심 사용자 플로우와 MVP 범위를 먼저 정의해 기능명세서 초안을 작성해야 했다",
      action:
        "Ex. 핵심 사용자 플로우를 기준으로 페이지별 기능 우선순위를 정리하고, 변경 가능성이 있는 영역은 별도로 구분해 기능명세서를 작성했다",
      result:
        "Ex. 와이어프레임을 효율적으로 빠르게 그릴 수 있게 되었고, 이를 바탕으로 기능명세서도 수월하게 고도화할 수 있었다",
    },
    3: {
      situation:
        "Ex. 나는 서비스 특성 상 해당 기능이 꼭 필요하다 말했지만, 디자이너는 사용성이 너무 불편해서 안될 것 같다고 하여 의견이 충돌하게 됐다",
      action:
        "Ex. 각자 왜 그렇게 생각하는지 먼저 물어보고 나서 두 의견의 공통점을 찾아 절충안을 제시했다",
      result:
        "Ex. 합의된 방향으로 프로젝트가 다시 진행됐고, 이후 기획 시에 더욱 사용성을 고려해야겠다 생각하게 되었다",
    },
    4: {
      situation:
        "Ex. 개발 중 기능 요구사항이 계속 추가되면서 초기 기획 범위가 흔들리고 있다는 것을 깨달았다",
      action:
        "Ex. 기능별 우선순위를 MVP와 고도화 범위로 나눠 재정의하고, 추가 요청은 다음 스프린트로 미루기로 기준을 정했다",
      result: "Ex. 개발 스코프가 안정됐고, 기한 내에 핵심 기능을 완성할 수 있었다",
    },
    5: {
      situation:
        "Ex. 디자이너에게 현재 서비스의 설계가 이해는 가능하지만, 유저가 이해하기 어려울 것 같다는 피드백을 들었다",
      action: "Ex. 처음 서비스를 접하는 유저라는 페르소나를 설정하고, 플로우를 꼼꼼하게 검토했다",
      result:
        "Ex. 내가 너무 기획자의 시점에서 설계했다는 것을 깨달았고, 서비스를 처음 접하는 유저를 더욱 고려해야겠다는 생각이 들었다",
    },
  },
  developer: {
    1: {
      situation: "Ex. 버그가 반복해서 발생하는데 왜 그런지 원인을 끝까지 찾아야 했다",
      action:
        "Ex. 버그가 어떤 조건에서만 생기는지 케이스를 나눠 로깅해보다 특정 입력값에서만 발생한다는 걸 발견하고 원인을 좁혔다",
      result:
        "Ex. 버그 원인을 찾아 수정하고 나서 비슷한 케이스에도 같은 로직을 적용해 추가 버그를 미리 막았다",
    },
    2: {
      situation:
        "Ex. 기한 안에 기능을 완성해야 하는데 처음 써보는 기술 스택이라 어디서부터 시작해야 할지 막막했다",
      action:
        "Ex. 공식 문서와 예제를 먼저 따라 해보면서 감을 잡은 뒤, 실제 기능에 어떻게 적용할지 작게 테스트를 만들어봤다",
      result:
        "Ex. 낯선 기술 스택도 작은 예제부터 시작하면 빠르게 익힐 수 있다는 걸 알게 됐고, 기한 안에 기능을 완성했다",
    },
    3: {
      situation: "Ex. 프로젝트 시작 시 협업 규칙을 정하지 않아 팀원과의 코드에 충돌이 생겼다",
      action:
        "Ex. 충돌이 난 부분을 같이 보면서 어떤 방식이 더 유지보수하기 쉬운지 기준을 잡고 합의했다",
      result: "Ex. 이후 컨트리뷰팅 가이드를 팀 깃헙에 정리해두었고, 비슷한 충돌이 줄었다",
    },
    4: {
      situation:
        "Ex. 프로젝트 마감이 얼마 안 남은 시점에 핵심 기능에서 버그가 발견돼서 빠르게 해결해야 했다",
      action:
        "Ex. 버그를 빠르게 임시 수정해 서비스를 먼저 살려놓고, 이후 원인을 천천히 파고들어 근본 수정을 했다",
      result:
        'Ex. 마감 안에 버그를 해결했고, "빠른 임시 수정 → 근본 원인 파악" 순서가 내 문제 해결 방식으로 자리 잡았다',
    },
    5: {
      situation:
        "Ex. 코드 리뷰에서 내가 당연하다고 생각했던 방식에 대해 피드백을 받고 나서 다시 생각해보게 됐다",
      action:
        "Ex. 피드백받은 부분을 찾아보면서 왜 그 방식이 더 나은지 이해하려 했고, 기술 블로그에 두 방식의 차이에 대한 아티클을 작성했다",
      result:
        "Ex. 그 방식이 더 나은 이유를 이해한 뒤 이후 코드에 적용했고, 다음 리뷰에서 같은 피드백이 나오지 않았다",
    },
  },
  designer: {
    1: {
      situation:
        "Ex. 팀 프로젝트에서 만든 화면을 테스트해봤는데 사람들이 다음으로 넘어가는 버튼을 못 찾는 이슈를 알 수 있었다",
      action:
        "Ex. 테스트 참여자가 어느 지점에서 멈추거나 헷갈리는지를 옆에서 관찰하면서 기록했고, 공통으로 막히는 지점을 추려냈다.",
      result:
        "Ex. 버튼 위치와 사이즈 조정 등의 과정을 거쳤더니 테스트에서 모두 버튼을 찾는 시간이 줄었다",
    },
    2: {
      situation: "Ex. 디자인 작업 전에 화면별 레퍼런스를 직접 수집하고 디자인 방향성을 확립했다",
      action: "Ex. 레퍼런스 중 사용할 요소를 정리하고, 이를 기획팀과 공유하며 ux플로우를 짰다",
      result:
        "Ex. 레퍼런스를 공유하며 이야기하니까 이해도 높은 대화를 나눴고, 디자인이 흔들리지 않았다",
    },
    3: {
      situation: 'Ex. 개발자가 "이 디자인은 구현이 어렵다"고 해서 다른 디자인을 찾아야했다',
      action:
        "Ex. 개발자에게 어떤 부분이 어려운지 물어보고, 비슷한 효과를 낼 수 있는 다른 방식을 제안했다",
      result:
        "Ex. 개발 가능한 범위 안에서 디자인이 완성됐고, 이후 개발자와 먼저 대화하는 습관이 생겼다",
    },
    4: {
      situation:
        "Ex. 컴포넌트를 넘겼는데 프론트가 허그로 설정한 값을 픽스로 구현해서 레이아웃이 깨지는 문제가 생겼다",
      action:
        "Ex. 어떤 컴포넌트에서 허그/픽스를 써야 하는지 피그마 컴포넌트에 직접 주석으로 명시했다",
      result: "Ex. 프론트가 주석 내용을 보며 진행하니까 전과 같은 오류가 발생하지 않았다",
    },
    5: {
      situation:
        "Ex. UT를 진행했는데 유저가 핵심 플로우에서 예상과 다른 경로로 이동하는 패턴이 반복돼서 구조를 다시 검토해야 했다",
      action:
        "Ex. 유저가 자주 막히는 지점을 분석하고, 플로우상 정보 위계나 진입 경로가 직관적이지 않은 부분을 찾아 재설계했다",
      result:
        "Ex. 수정한 플로우로 재테스트했을 때 이탈 지점이 없어졌고, 유저가 목표 화면까지 도달하는 시간이 줄었다",
    },
  },
};

export const normalizeStarJobKey = (job?: string | null) => {
  if (!job) return FALLBACK_STAR_JOB_KEY;

  return STAR_JOB_LABEL_TO_KEY[job] ?? FALLBACK_STAR_JOB_KEY;
};

const isStarSkillId = (skillId?: number): skillId is StarSkillId =>
  skillId === 1 || skillId === 2 || skillId === 3 || skillId === 4 || skillId === 5;

const isCompetency = (competency?: string): competency is Competency =>
  competency === "DISCOVERY_ANALYSIS" ||
  competency === "PLANNING_EXECUTION" ||
  competency === "COLLABORATION" ||
  competency === "PROBLEM_SOLVING" ||
  competency === "REFLECTION_GROWTH";

export const getStarGuideExample = ({
  job,
  competency,
  skillId,
  stepKey,
}: {
  job?: string | null;
  competency?: string | null;
  skillId?: number;
  stepKey: StarStepKey;
}) => {
  const jobKey = normalizeStarJobKey(job);
  const normalizedCompetency = competency ?? undefined;
  const safeSkillId: StarSkillId = isCompetency(normalizedCompetency)
    ? STAR_COMPETENCY_TO_SKILL_ID[normalizedCompetency]
    : isStarSkillId(skillId)
      ? skillId
      : 1;
  const guide = STAR_GUIDE_EXAMPLES[jobKey][safeSkillId];

  return guide?.[stepKey] ?? STAR_GUIDE_EXAMPLES[FALLBACK_STAR_JOB_KEY][1][stepKey];
};
