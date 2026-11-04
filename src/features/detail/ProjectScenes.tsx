import { Fragment } from 'react'
import type { Project } from '../../domain/portfolio'
import { projectSceneIds } from '../../domain/scenes'
import { Scene } from '../../ui/Scene'
import { ExternalLink } from '../../ui/ExternalLink'
import { EmptyNote } from '../../ui/EmptyNote'

export function ProjectListScene({ projects, id, title }: { projects: Project[]; id: string; title: string }) {
  return (
    <Scene id={id} title={title}>
      {projects.length === 0 ? (
        <EmptyNote>등록한 프로젝트가 없습니다. src/content/projects.ts 에 항목을 더합니다.</EmptyNote>
      ) : null}
      <ul className="project-list cols cols-3">
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

/** 프로젝트 1개를 화면 두 칸으로 나눈다. 첫 칸은 개요와 구성, 둘째 칸은 문제 해결과 결과다. */
export function ProjectDetailScenes({ projects, id, title }: { projects: Project[]; id: string; title: string }) {
  if (projects.length === 0) {
    return (
      <Scene id={id} title={title}>
        <EmptyNote>등록한 프로젝트가 없습니다.</EmptyNote>
      </Scene>
    )
  }
  return (
    <>
      {projects.map((p) => {
        const [firstId, secondId] = projectSceneIds(p.id)
        return (
          <Fragment key={p.id}>
            <Scene id={firstId} title={p.name}>
              <p className="entry-meta project-meta">
                {p.kind}, {p.period}
              </p>
              <div className="project">
                <div className="project-side">
                  <h3 className="sub-title first">내 역할</h3>
                  <p>{p.role}</p>

                  <h3 className="sub-title">기술</h3>
                  <p>{p.coreStack.join(', ')}</p>

                  <h3 className="sub-title">링크</h3>
                  <ul className="plain-list">
                    {p.links.map((l) => (
                      <li key={l.url}>
                        <ExternalLink href={l.url}>{l.label}</ExternalLink>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="project-body">
                  <h3 className="sub-title first">개요</h3>
                  <p>{p.overview}</p>

                  <h3 className="sub-title">주요 기능</h3>
                  <ul className="plain-list">
                    {p.features.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>

                  <h3 className="sub-title">구성도</h3>
                  <ol className="flow" aria-label={`${p.name} 요청 흐름`}>
                    {p.architecture.map((n) => (
                      <li key={n.label}>
                        <strong>{n.label}</strong>
                        <span>{n.note}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </Scene>

            <Scene id={secondId} title={p.name}>
              <p className="entry-meta project-meta">문제와 해결, 배포, 결과</p>
              <div className="project">
                <div className="project-side">
                  <h3 className="sub-title first">배포 방식</h3>
                  <p>{p.deploy}</p>
                </div>
                <div className="project-body">
                  <h3 className="sub-title first">문제와 해결</h3>
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

                  <h3 className="sub-title">결과</h3>
                  <dl className="results">
                    {p.results.map((r) => (
                      <div key={r.label}>
                        <dt>{r.value}</dt>
                        <dd>{r.label}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            </Scene>
          </Fragment>
        )
      })}
    </>
  )
}
