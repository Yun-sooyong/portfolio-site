import type { ReactNode } from 'react'
import type { Background } from '../../domain/portfolio'
import { Scene } from '../../ui/Scene'
import { EmptyNote } from '../../ui/EmptyNote'

/** 항목 목록. 비었으면 안내 문구를 보인다. */
function Entries<T>({ items, render }: { items: T[]; render: (item: T) => ReactNode }) {
  if (items.length === 0) return <EmptyNote />
  return <ul className="entries">{items.map(render)}</ul>
}

export function BackgroundScene({ background, id, title }: { background: Background; id: string; title: string }) {
  const { careers, educations, trainings, certificates } = background
  return (
    <Scene id={id} title={title}>
      <div className="cols cols-3">
        <div>
          <h3 className="sub-title">경력</h3>
          <Entries
            items={careers}
            render={(c) => (
              <li key={`${c.org}-${c.period}`}>
                <p className="entry-head">
                  <strong>{c.org}</strong> {c.role}
                </p>
                <p className="entry-meta">{c.period}</p>
                <p>{c.summary}</p>
              </li>
            )}
          />
        </div>
        <div>
          <h3 className="sub-title">학력</h3>
          <Entries
            items={educations}
            render={(e) => (
              <li key={e.school}>
                <p className="entry-head">
                  <strong>{e.school}</strong> {e.major}
                </p>
                <p className="entry-meta">{e.period}</p>
              </li>
            )}
          />
          <h3 className="sub-title">교육 이력</h3>
          <Entries
            items={trainings}
            render={(t) => (
              <li key={t.name}>
                <p className="entry-head">
                  <strong>{t.name}</strong> {t.org}
                </p>
                <p className="entry-meta">{t.period}</p>
              </li>
            )}
          />
        </div>
        <div>
          <h3 className="sub-title">자격증</h3>
          <Entries
            items={certificates}
            render={(c) => (
              <li key={c.name}>
                <p className="entry-head">
                  <strong>{c.name}</strong> {c.issuer}
                </p>
                <p className="entry-meta">{c.date}</p>
              </li>
            )}
          />
        </div>
      </div>
    </Scene>
  )
}
