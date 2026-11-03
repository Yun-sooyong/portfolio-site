// 내용의 타입 정의. React와 화면을 모른다.

/** 이메일은 HTML 원문에 그대로 두지 않으려고 두 부분으로 나눠 저장한다. */
export interface EmailParts {
  user: string
  domain: string
}

export interface Profile {
  name: string
  role: string
  /** 시 단위까지만 쓴다. */
  region: string
  /** 소개 문장. 4~5줄. */
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
}

export interface Certificate {
  name: string
  issuer: string
  date: string
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
  /** 할 수 있는 것 */
  can: string
  /** 아직 부족한 것 */
  lacks: string
}

export interface SkillGroup {
  title: string
  skills: Skill[]
}

export type ProjectKind = '개인' | '팀'

export interface ArchitectureNode {
  label: string
  note: string
}

export interface ProblemSolution {
  problem: string
  solution: string
}

export interface Result {
  /** 숫자를 포함한 값. 예: "45ms" */
  value: string
  label: string
}

export interface ProjectLink {
  label: string
  /** https:// 로 시작해야 한다. */
  url: string
}

export interface Project {
  id: string
  name: string
  kind: ProjectKind
  period: string
  /** 핵심 기술 1~2개 */
  coreStack: string[]
  /** 목록에 보이는 한 줄 설명 */
  summary: string
  overview: string
  /** 내 역할 */
  role: string
  features: string[]
  architecture: ArchitectureNode[]
  problems: ProblemSolution[]
  deploy: string
  results: Result[]
  links: ProjectLink[]
}

export interface Contact {
  email: EmailParts
  github: string
  blog: string
}

export interface HowBuiltItem {
  title: string
  body: string
}

export interface HowBuiltGroup {
  title: string
  items: HowBuiltItem[]
}

export interface FolderRule {
  folder: string
  role: string
  dependsOn: string
}

export interface HowBuilt {
  lead: string
  folders: FolderRule[]
  groups: HowBuiltGroup[]
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
