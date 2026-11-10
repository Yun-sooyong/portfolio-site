// 내용의 타입 정의. React와 화면을 모른다.

/** 이메일은 HTML 원문에 그대로 두지 않으려고 두 부분으로 나눠 저장한다. */
export interface EmailParts {
  user: string
  domain: string
}

export interface Profile {
  name: string
  role: string
  /** 소개 문장. 3~5줄. */
  intro: string[]
  /** 강점 2~3개. 강점마다 근거 1줄. */
  strengths: { title: string; evidence: string }[]
}

export interface Career {
  org: string
  role: string
  period: string
  summary: string
}

export interface Education {
  school: string
  major: string
  period: string
}

export interface Training {
  name: string
  org: string
  period: string
  /** 배운 기술 목록. 영문 기술 이름으로 쓴다 */
  stack: string[]
  /** 무엇을 배웠는지 한 줄 */
  summary: string
  /** 스터디 경험 한 줄(선택) */
  study?: string
}

export interface Certificate {
  name: string
  issuer: string
  date: string
  /** 진행 상태(선택). 예: "필기 합격". 없으면 취득한 자격증이다 */
  status?: string
}

export interface Background {
  careers: Career[]
  educations: Education[]
  trainings: Training[]
  certificates: Certificate[]
}

/** 기술 한 항목. 점수와 막대 대신 문장으로 쓴다. */
export interface Skill {
  name: string
  /** 아이콘 키(선택). 이름에 기술이 둘 이상이면 배열. 키는 src/ui/techIcons.ts 에 있어야 한다. 없으면 글자만 보인다 */
  icon?: string | string[]
  /** 할 수 있는 것 */
  can: string
  /** 아직 부족한 것(선택). 쓸 내용이 있을 때만 적는다 */
  lacks?: string
}

export interface SkillGroup {
  title: string
  skills: Skill[]
}

export type ProjectKind = '개인' | '팀'

export interface Result {
  /** 숫자를 포함한 값. 예: "45ms" */
  value: string
  label: string
}

export interface Project {
  id: string
  name: string
  kind: ProjectKind
  period: string
  /** 핵심 기술 1~2개 */
  coreStack: string[]
  /** 핵심 기술 이름 -> 아이콘 키(선택). 키는 src/ui/techIcons.ts 에 있어야 한다. 없으면 글자만 보인다 */
  coreStackIcons?: Record<string, string>
  /** 목록에 보이는 한 줄 설명 */
  summary: string
  /** 소개. 장면에서 간단한 설명 아래에 보인다 */
  overview: string
  /** 맡은 역할 */
  role: string
  /** 성과. 숫자를 포함한다 */
  results: Result[]
  /** GitHub 저장소 주소(선택). https:// 로 시작한다 */
  githubUrl?: string
  /** 데모 주소(선택). https:// 로 시작한다 */
  demoUrl?: string
  /** 노션 상세 페이지 주소(선택). 구성도와 문제 해결 같은 자세한 내용은 여기로 넘긴다. https:// 로 시작한다 */
  notionUrl?: string
}

export interface Contact {
  email: EmailParts
  github: string
  /** 블로그 주소(선택). 없으면 화면에서 숨긴다 */
  blog?: string
}

export interface HowBuiltItem {
  title: string
  body: string
}

/** "이 사이트와 기록" 장면의 사이트 소개 부분 */
export interface HowBuilt {
  lead: string
  /** 구조와 보안 요점. 3~4개, 항목마다 1줄 */
  points: HowBuiltItem[]
  /** CI가 위에서 아래로 실행하는 명령. .github/workflows/ci.yml 의 run 항목과 같다 */
  ciSteps: string[]
  /** 전체 기록을 보는 곳. 주소는 https:// 로 시작한다 */
  readmeUrl: string
  /** 노션 기록 주소(선택) */
  notionUrl?: string
}

export interface JournalEntry {
  /** YYYY-MM-DD */
  date: string
  problem: string
  cause: string
  fix: string
}

export interface Portfolio {
  profile: Profile
  background: Background
  skillGroups: SkillGroup[]
  projects: Project[]
  contact: Contact
  howBuilt: HowBuilt
  journal: JournalEntry[]
}
