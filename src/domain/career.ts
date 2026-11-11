import type { Background } from './portfolio'

/** 경력 경로 막대 1칸 */
export interface CareerStep {
  key: string
  /** 화면에 보이는 시기. 예: "2014–2021" */
  when: string
  name: string
  /** 정렬에 쓰는 시작 연월. YYYYMM 숫자 */
  start: number
  /** 가장 최근 단계이면 true. 강조색으로 그린다 */
  current: boolean
}

const startOf = (period: string): number => {
  const m = period.match(/(\d{4})\.(\d{2})/)
  return m ? Number(m[1]) * 100 + Number(m[2]) : 0
}

/** "2014.02 – 2021.02" 를 "2014–2021" 로, "2026.03 – 2026.10" 을 "2026.03–10" 으로 줄인다. */
export function shortPeriod(period: string): string {
  const m = period.match(/(\d{4})\.(\d{2})\s*[–-]\s*(\d{4})\.(\d{2})/)
  if (!m) return period
  const [, y1, m1, y2, m2] = m
  if (y1 === y2) return `${y1}.${m1}–${m2}`
  return `${y1}–${y2}`
}

/**
 * 교육, 첫 자격증, 경력, 교육 과정을 시작 시기 순서로 늘어놓는다. 마지막 칸만 current 이다.
 * 자격증은 첫 항목(가장 핵심인 것) 1개만 넣는다.
 */
export function buildCareerPath(background: Background): CareerStep[] {
  const steps: Omit<CareerStep, 'current'>[] = []
  for (const e of background.educations) steps.push({ key: `edu-${e.school}`, when: shortPeriod(e.period), name: e.school, start: startOf(e.period) })
  const cert = background.certificates[0]
  if (cert) steps.push({ key: `cert-${cert.name}`, when: cert.date.slice(0, 4), name: cert.name, start: startOf(cert.date) })
  for (const c of background.careers) steps.push({ key: `career-${c.org}`, when: shortPeriod(c.period), name: c.org, start: startOf(c.period) })
  for (const t of background.trainings) steps.push({ key: `train-${t.name}`, when: shortPeriod(t.period), name: '바이오메디컬 AI 과정', start: startOf(t.period) })
  steps.sort((a, b) => a.start - b.start)
  return steps.map((s, i) => ({ ...s, current: i === steps.length - 1 }))
}
