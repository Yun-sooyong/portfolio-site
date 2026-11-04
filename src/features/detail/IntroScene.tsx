import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import type { Profile } from '../../domain/portfolio'
import { Scene } from '../../ui/Scene'
import { ExampleBadge } from '../../ui/ExampleBadge'
import { Bento, Chip, Tile } from '../../ui/Bento'

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

/** 소개 장면. 이름 타일이 강조 타일이다. stack은 프로젝트의 핵심 기술을 중복 없이 모은 목록이다. */
export function IntroScene({
  profile,
  stack,
  id,
  title,
}: {
  profile: Profile
  stack: { name: string; icon?: string }[]
  id: string
  title: string
}) {
  return (
    <Scene id={id} title={title} instant hideTitle>
      <Bento>
        <Tile cols={8} rows={2} strong className="intro-main">
          <p className="hero-role">{profile.role}</p>
          <h1 className="hero-name">{profile.name}</h1>
          <p className="hero-region">{profile.region}</p>
          <div className="prose-block">
            {profile.intro.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
          <ExampleBadge />
        </Tile>
        <Tile cols={4}>
          <h2 className="tile-title">주요 기술</h2>
          <ul className="chips">
            {stack.map((s) => (
              <li key={s.name}>
                <Chip icon={s.icon}>{s.name}</Chip>
              </li>
            ))}
          </ul>
        </Tile>
        <Tile cols={4}>
          <h2 className="tile-title">연락처와 PDF</h2>
          <ul className="plain-list">
            <li>
              <a href="#contact">연락처 장면으로 이동</a>
            </li>
            <li>
              <Link to="/print">단축본 PDF 열기</Link>
            </li>
          </ul>
        </Tile>
        <Tile cols={12}>
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
      </Bento>
    </Scene>
  )
}
