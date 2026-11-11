import type { ReactNode } from 'react'
import type { Background } from '../../domain/portfolio'
import { buildCareerPath } from '../../domain/career'
import { MonoText } from '../../ui/MonoText'
import { SectionHead } from './SectionHead'

interface LedgerRow {
  key: string
  when: string
  name: string
  notes?: ReactNode[]
}

function Ledger({ title, rows }: { title: string; rows: LedgerRow[] }) {
  if (rows.length === 0) return null
  return (
    <div className="ledger">
      <h3 className="ledger-title">{title}</h3>
      <ul className="ledger-rows">
        {rows.map((r) => (
          <li key={r.key}>
            <p className="ledger-when label-mono">{r.when}</p>
            <div>
              <p className="ledger-name">{r.name}</p>
              {r.notes?.map((n, i) => (
                <p key={i} className="ledger-note">
                  {n}
                </p>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

/** 04 이력. 경력 경로 막대와 경력, 학력, 교육, 자격증 목록. */
export function CareerSection({ background }: { background: Background }) {
  const path = buildCareerPath(background)
  return (
    <section className="section" id="career" aria-labelledby="career-title">
      <div className="wrap">
        <SectionHead id="career" title="걸어온 경로" />
        <ol className="path" aria-label="경력 경로">
          {path.map((s) => (
            <li key={s.key} className={`path-step${s.current ? ' is-current' : ''}`} aria-current={s.current ? 'step' : undefined}>
              <span className="path-bar" aria-hidden="true" />
              <span className="path-when label-mono">{s.when}</span>
              <span className="path-name">{s.name}</span>
            </li>
          ))}
        </ol>

        <div className="ledgers">
          <Ledger
            title="경력"
            rows={background.careers.map((c) => ({ key: `${c.org}-${c.period}`, when: c.period, name: `${c.org} ${c.role}`, notes: [c.summary] }))}
          />
          <Ledger title="학력" rows={background.educations.map((e) => ({ key: e.school, when: e.period, name: `${e.school} ${e.major}` }))} />
          <Ledger
            title="교육"
            rows={background.trainings.map((t) => ({
              key: t.name,
              when: t.period,
              name: `${t.name} ${t.org}`,
              notes: [
                t.summary,
                <>
                  <span className="note-label">배운 기술</span> <MonoText>{t.stack.join(', ')}</MonoText>
                </>,
                ...(t.study ? [<>스터디: {t.study}</>] : []),
              ],
            }))}
          />
          <Ledger
            title="자격증"
            rows={background.certificates.map((c) => ({
              key: c.name,
              when: c.date,
              name: `${c.name} ${c.issuer}`,
              notes: c.status ? [<span className="tag">{c.status}</span>] : undefined,
            }))}
          />
        </div>
      </div>
    </section>
  )
}
