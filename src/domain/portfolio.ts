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

/** 기술 칩 1개. 아이콘 1개와 이름 1개다. */
export interface Tech {
  name: string
  /** 아이콘 키(선택). 키는 src/ui/techIcons.ts 에 있어야 한다. 없으면 이름만 보인다 */
  icon?: string
}

/** 기술 한 항목. 점수와 막대 대신 문장으로 쓴다. */
export interface Skill {
  /** 칩으로 보이는 기술 목록. 기술마다 칩 1개 */
  techs: Tech[]
  /** 단축본에 보이는 글자(선택). 없으면 기술 이름을 " / " 로 이어 쓴다 */
  printName?: string
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

/** 사용한 AI 1개와 맡긴 일 */
export interface AiTool {
  name: string
  use: string
}

/** 문제 해결 1건. 상황과, 그때 내가 내린 판단이다 */
export interface AiCase {
  situation: string
  choice: string
}

/** AI로 만든 프로젝트. 팀 프로젝트(Project)와 형식이 다르다. */
export interface AiProject {
  id: string
  name: string
  kind: ProjectKind
  period: string
  /** 핵심 기술 1~3개 */
  coreStack: string[]
  /** 핵심 기술 이름 -> 아이콘 키(선택). 키는 src/ui/techIcons.ts 에 있어야 한다 */
  coreStackIcons?: Record<string, string>
  summary: string
  overview: string
  /** AI를 쓴 곳. 짧은 꼬리표 */
  aiAreas: string[]
  /** 사용한 AI와 맡긴 일 */
  tools: AiTool[]
  /** 속도와 생산성 */
  impact: Result[]
  /** 시스템 설계에 쓴 방식 */
  design: string[]
  /** 문제 해결: 상황과 내가 내린 판단 */
  cases: AiCase[]
  /** 품질 관리 */
  quality: string[]
  /** GitHub 저장소 주소(선택). https:// 로 시작한다 */
  githubUrl?: string
  /** GitHub의 작업 흐름 다이어그램 문서 주소. https:// 로 시작한다 */
  workflowUrl: string
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

/** 성과 숫자 칸 1개. 숫자는 프로젝트와 프로필에 적힌 사실만 쓴다. */
export interface Highlight {
  id: string
  /** 큰 글자로 보이는 값. 예: "0.06~0.28" */
  value: string
  /** 값 뒤에 작게 붙는 단위(선택). 예: "초" */
  unit?: string
  /** 짧은 설명 */
  caption: string
  /** 출처. 프로젝트 id 이거나 'profile' */
  source: string
  /** 강조색으로 채우는 칸이면 true. 1개만 둔다 */
  accent?: boolean
  /** 첫 화면 카드의 "최근 결과"에 쓰는 칸이면 true. 1개만 둔다 */
  award?: boolean
}

/** 첫 화면의 큰 제목과 3칸 띠 */
export interface HomeCopy {
  /** 큰 제목 3줄. 마지막 줄만 강조색 */
  headline: [string, string, string]
  band: { label: string; line: string; source: string }[]
}

export interface Portfolio {
  profile: Profile
  background: Background
  skillGroups: SkillGroup[]
  projects: Project[]
  aiProjects: AiProject[]
  contact: Contact
  howBuilt: HowBuilt
  journal: JournalEntry[]
  highlights: Highlight[]
  home: HomeCopy
}
