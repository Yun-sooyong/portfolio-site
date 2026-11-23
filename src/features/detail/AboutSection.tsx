import type { Portfolio } from '../../domain/portfolio'
import { shortProjectName } from '../../domain/text'
import { SectionHead } from './SectionHead'

/** 01 소개. 왼쪽 소개 문단, 오른쪽 강점 목록, 아래 성과 숫자 격자. */
export function AboutSection({ data }: { data: Portfolio }) {
  const { profile, highlights, projects } = data
  const middle = profile.intro.slice(1, -1)
  const sourceLabel = (source: string) => {
    const p = projects.find((x) => x.id === source)
    return p ? shortProjectName(p.name) : '교육 과정'
  }

  return (
    <section className="section" id="about" aria-labelledby="about-title">
      <div className="wrap">
        <SectionHead id="about" title="모델을 서비스로 잇는 일" />
        <div className="about-grid">
          <div className="prose">
            {middle.map((l) => (
              <p key={l}>{l}</p>
            ))}
          </div>
          <ul className="strengths">
            {profile.strengths.map((s) => (
              <li key={s.title}>
                <strong>{s.title}</strong>
                <span>{s.evidence}</span>
              </li>
            ))}
          </ul>
        </div>

        <h3 className="sub-title">숫자로 보는 성과</h3>
        <ul className="stats">
          {highlights.map((h) => (
            <li key={h.id} className={`stat${h.accent ? ' stat-accent' : ''}`}>
              <p className="stat-source label-mono">{sourceLabel(h.source)}</p>
              <p className="stat-value">
                {h.value.split('→').map((part, i, all) => (
                  <span key={i}>
                    {i > 0 ? (
                      <>
                        →<wbr />
                      </>
                    ) : null}
                    {part}
                    {i === all.length - 1 && h.unit ? <span className="stat-unit">{h.unit}</span> : null}
                  </span>
                ))}
              </p>
              <p className="stat-caption">{h.caption}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
