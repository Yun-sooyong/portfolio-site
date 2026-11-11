import { Link } from 'react-router-dom'
import type { Portfolio } from '../../domain/portfolio'

const FLOW = ['판독 요청', '작업 큐', 'GPU 추론', '소견문']

/** 첫 화면. 왼쪽 큰 제목, 오른쪽 기울어진 소개 카드, 아래 3칸 띠. 움직임은 열릴 때 한 번만 있다. */
export function Hero({ data }: { data: Portfolio }) {
  const { profile, background, highlights, home } = data
  const intro = profile.intro
  const heroLines = [intro[0], intro[intro.length - 1]].filter((l): l is string => Boolean(l))
  const training = background.trainings[0]
  const award = highlights.find((h) => h.award)

  return (
    <section className="hero" id="top" aria-label="첫 화면">
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <p className="hero-kicker label-mono rise rise-1">
            {profile.role} · {profile.name}
          </p>
          <h1 className="hero-title rise rise-2">
            {home.headline.map((line, i) => (
              <span key={line} className={`hero-line${i === home.headline.length - 1 ? ' hero-line-accent' : ''}`}>
                {line}
                {' '}
              </span>
            ))}
          </h1>
          <div className="hero-intro rise rise-3">
            {heroLines.map((l) => (
              <p key={l}>{l}</p>
            ))}
          </div>
          <div className="hero-actions rise rise-3">
            <a className="btn btn-fill" href="#projects">
              프로젝트 보기
            </a>
            <Link className="btn btn-line" to="/print">
              단축본 PDF
            </Link>
          </div>
        </div>

        <aside className="hero-card rise rise-4" aria-label="요약 카드">
          <div className="flow" role="img" aria-label={`판독 흐름: ${FLOW.join(' → ')}`}>
            {FLOW.map((step) => (
              <span key={step} className="flow-step" aria-hidden="true">
                {step}
              </span>
            ))}
          </div>
          <dl className="card-facts">
            <div>
              <dt>이름</dt>
              <dd className="card-name">{profile.name}</dd>
            </div>
            <div>
              <dt>관심 분야</dt>
              <dd>{home.band.map((b) => b.label).join(' · ')}</dd>
            </div>
            {training ? (
              <div>
                <dt>교육</dt>
                <dd>
                  {training.name}
                  <span className="card-sub label-mono">{training.period}</span>
                </dd>
              </div>
            ) : null}
            {award ? (
              <div>
                <dt>최근 결과</dt>
                <dd>{award.caption}</dd>
              </div>
            ) : null}
          </dl>
        </aside>
      </div>

      <div className="wrap">
        <ul className="band">
          {home.band.map((b) => (
            <li key={b.label}>
              <p className="band-label">{b.label}</p>
              <p className="band-line">{b.line}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
