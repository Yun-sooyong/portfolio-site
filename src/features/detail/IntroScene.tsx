import type { ReactNode } from 'react'
import type { Background, Profile } from '../../domain/portfolio'
import { Scene } from '../../ui/Scene'
import { EmptyNote } from '../../ui/EmptyNote'
import { Bento, Chip, Tile } from '../../ui/Bento'
import { MonoText } from '../../ui/MonoText'

/** 근거 문장의 숫자(예: 120ms, 32개)를 포인트 색 span으로 감싼다. 영문자 바로 뒤의 숫자(p95)는 건드리지 않는다. */
function highlightNumbers(text: string): ReactNode[] {
  const parts = text.split(/((?<![A-Za-z\d])\d[\d.,]*(?:ms|%|개|건|회|시간)?)/g)
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <span key={i} className="num">
        {part}
      </span>
    ) : (
      part
    ),
  )
}

interface HistoryItem {
  key: string
  main: string
  meta: ReactNode
  /** 항목 아래에 한 줄씩 보이는 설명 */
  notes?: ReactNode[]
}

/** 경력, 학력, 교육, 자격증 항목 목록. 항목이 없으면 안내 문구를 보인다. */
function HistoryList({ items }: { items: HistoryItem[] }) {
  if (items.length === 0) return <EmptyNote />
  return (
    <ul className="entries">
      {items.map((it) => (
        <li key={it.key}>
          <p className="entry-head">
            <strong>{it.main}</strong>
          </p>
          <p className="entry-meta">{it.meta}</p>
          {it.notes?.map((n, i) => (
            <p key={i}>{n}</p>
          ))}
        </li>
      ))}
    </ul>
  )
}

/** 소개와 이력 장면. 이름 타일이 강조 타일이다. stack은 프로젝트의 핵심 기술을 중복 없이 모은 목록이다. */
export function IntroScene({
  profile,
  background,
  stack,
  id,
  title,
}: {
  profile: Profile
  background: Background
  stack: { name: string; icon?: string }[]
  id: string
  title: string
}) {
  return (
    <Scene id={id} title={title} instant hideTitle>
      <Bento className="bento-intro">
        <Tile cols={7} rows={2} strong className="intro-main">
          <p className="hero-role">{profile.role}</p>
          <h1 className="hero-name">{profile.name}</h1>
          <div className="prose-block">
            {profile.intro.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </Tile>
        <Tile cols={5}>
          <h2 className="tile-title">강점</h2>
          <ul className="strengths">
            {profile.strengths.map((s) => (
              <li key={s.title}>
                <strong>{s.title}</strong>
                <span>{highlightNumbers(s.evidence)}</span>
              </li>
            ))}
          </ul>
        </Tile>
        <Tile cols={5}>
          <h2 className="tile-title">주요 기술</h2>
          <ul className="chips">
            {stack.map((s) => (
              <li key={s.name}>
                <Chip icon={s.icon}>{s.name}</Chip>
              </li>
            ))}
          </ul>
        </Tile>
        <Tile cols={3} className="tile-career">
          <h2 className="tile-title">경력</h2>
          <HistoryList
            items={background.careers.map((c) => ({ key: `${c.org}-${c.period}`, main: `${c.org} ${c.role}`, meta: c.period, notes: [c.summary] }))}
          />
        </Tile>
        <Tile cols={6}>
          <h2 className="tile-title">학력과 교육 이력</h2>
          <HistoryList
            items={[
              ...background.educations.map((e) => ({ key: e.school, main: `${e.school} ${e.major}`, meta: e.period })),
              ...background.trainings.map((t) => ({
                key: t.name,
                main: `${t.name} ${t.org}`,
                meta: t.period,
                notes: [
                  t.summary,
                  <>
                    <span className="note-label">배운 기술</span> <MonoText>{t.stack.join(', ')}</MonoText>
                  </>,
                  ...(t.study ? [<><span className="note-label">스터디</span> {t.study}</>] : []),
                ],
              })),
            ]}
          />
        </Tile>
        <Tile cols={3}>
          <h2 className="tile-title">자격증</h2>
          <HistoryList
            items={background.certificates.map((c) => ({
              key: c.name,
              main: `${c.name} ${c.issuer}`,
              meta: c.status ? (
                <>
                  {c.date} <span className="tag">{c.status}</span>
                </>
              ) : (
                c.date
              ),
            }))}
          />
        </Tile>
      </Bento>
    </Scene>
  )
}
