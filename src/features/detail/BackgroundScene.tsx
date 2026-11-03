import type { Background } from '../../domain/portfolio'
import { Scene } from '../../ui/Scene'

export function BackgroundScene({ background, id, title }: { background: Background; id: string; title: string }) {
  const { careers, educations, trainings, certificates } = background
  return (
    <Scene id={id} title={title}>
      <h3 className="sub-title">경력</h3>
      <ul className="entries">
        {careers.map((c) => (
          <li key={`${c.org}-${c.period}`}>
            <p className="entry-head">
              <strong>{c.org}</strong> {c.role}
            </p>
            <p className="entry-meta">{c.period}</p>
            <p>{c.summary}</p>
          </li>
        ))}
      </ul>
      <h3 className="sub-title">학력</h3>
      <ul className="entries">
        {educations.map((e) => (
          <li key={e.school}>
            <p className="entry-head">
              <strong>{e.school}</strong> {e.major}
            </p>
            <p className="entry-meta">{e.period}</p>
          </li>
        ))}
      </ul>
      <h3 className="sub-title">교육 이력</h3>
      <ul className="entries">
        {trainings.map((t) => (
          <li key={t.name}>
            <p className="entry-head">
              <strong>{t.name}</strong> {t.org}
            </p>
            <p className="entry-meta">{t.period}</p>
          </li>
        ))}
      </ul>
      <h3 className="sub-title">자격증</h3>
      <ul className="entries">
        {certificates.map((c) => (
          <li key={c.name}>
            <p className="entry-head">
              <strong>{c.name}</strong> {c.issuer}
            </p>
            <p className="entry-meta">{c.date}</p>
          </li>
        ))}
      </ul>
    </Scene>
  )
}
