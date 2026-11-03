import type { Project } from '../../domain/portfolio'
import { Scene } from '../../ui/Scene'

export function ProjectListScene({ projects, id, title }: { projects: Project[]; id: string; title: string }) {
  return (
    <Scene id={id} title={title}>
      <ul className="project-list">
        {projects.map((p) => (
          <li key={p.id}>
            <a href={`#project-${p.id}`} className="project-row">
              <span className="project-row-name">{p.name}</span>
              <span className="project-row-meta">
                {p.kind}, {p.period}
              </span>
              <span className="project-row-stack">{p.coreStack.join(', ')}</span>
              <span className="project-row-summary">{p.summary}</span>
            </a>
          </li>
        ))}
      </ul>
    </Scene>
  )
}

export function ProjectDetailScene({ projects, id, title }: { projects: Project[]; id: string; title: string }) {
  return (
    <Scene id={id} title={title} tall>
      {projects.map((p) => (
        <article key={p.id} id={`project-${p.id}`} className="project">
          <h3 className="project-name">{p.name}</h3>
          <p className="entry-meta">
            {p.kind}, {p.period}. 기술: {p.coreStack.join(', ')}
          </p>

          <h4 className="sub-title">개요</h4>
          <p>{p.overview}</p>

          <h4 className="sub-title">내 역할</h4>
          <p>{p.role}</p>

          <h4 className="sub-title">주요 기능</h4>
          <ul className="plain-list">
            {p.features.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>

          <h4 className="sub-title">구성도</h4>
          <ol className="flow" aria-label={`${p.name} 요청 흐름`}>
            {p.architecture.map((n) => (
              <li key={n.label}>
                <strong>{n.label}</strong>
                <span>{n.note}</span>
              </li>
            ))}
          </ol>

          <h4 className="sub-title">문제와 해결</h4>
          <dl className="problems">
            {p.problems.map((ps) => (
              <div key={ps.problem}>
                <dt>
                  <span className="tag tag-lack">문제</span> {ps.problem}
                </dt>
                <dd>
                  <span className="tag">해결</span> {ps.solution}
                </dd>
              </div>
            ))}
          </dl>

          <h4 className="sub-title">배포 방식</h4>
          <p>{p.deploy}</p>

          <h4 className="sub-title">결과</h4>
          <dl className="results">
            {p.results.map((r) => (
              <div key={r.label}>
                <dt>{r.value}</dt>
                <dd>{r.label}</dd>
              </div>
            ))}
          </dl>

          <h4 className="sub-title">링크</h4>
          <ul className="plain-list">
            {p.links.map((l) => (
              <li key={l.url}>
                <a href={l.url} target="_blank" rel="noopener noreferrer">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </article>
      ))}
    </Scene>
  )
}
