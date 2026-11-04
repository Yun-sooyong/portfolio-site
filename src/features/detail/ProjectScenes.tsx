import { Fragment } from 'react'
import type { Project } from '../../domain/portfolio'
import { projectSceneIds } from '../../domain/scenes'
import { Scene } from '../../ui/Scene'
import { ExternalLink } from '../../ui/ExternalLink'
import { EmptyNote } from '../../ui/EmptyNote'
import { Bento, Chip, Tile, type RowSpan } from '../../ui/Bento'

/** 프로젝트 목록 장면. 첫 프로젝트가 큰 강조 타일이고, 나머지는 오른쪽에 쌓는다. */
export function ProjectListScene({ projects, id, title }: { projects: Project[]; id: string; title: string }) {
  const restCount = projects.length - 1
  const firstRows = Math.min(Math.max(restCount, 1), 6) as RowSpan
  return (
    <Scene id={id} title={title}>
      {projects.length === 0 ? (
        <EmptyNote>등록한 프로젝트가 없습니다. src/content/projects.ts 에 항목을 더합니다.</EmptyNote>
      ) : null}
      <Bento as="ul">
        {projects.map((p, i) => (
          <Tile
            key={p.id}
            as="li"
            link
            strong={i === 0}
            cols={i === 0 ? (restCount > 0 ? 7 : 12) : 5}
            rows={i === 0 ? firstRows : 1}
            className={i === 0 ? 'project-first' : ''}
          >
            <a href={`#project-${p.id}`} className="project-row">
              <span className="project-row-name">{p.name}</span>
              <span className="project-row-meta">
                {p.kind}, {p.period}
              </span>
              <span className="chips">
                {p.coreStack.map((s) => (
                  <Chip key={s} icon={p.coreStackIcons?.[s]}>
                    {s}
                  </Chip>
                ))}
              </span>
              <span className="project-row-summary">{p.summary}</span>
            </a>
          </Tile>
        ))}
      </Bento>
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
              <Bento>
                <Tile cols={7} strong>
                  <h3 className="tile-title">개요</h3>
                  <p>{p.overview}</p>
                  <p className="entry-meta project-meta">
                    {p.kind}, {p.period}
                  </p>
                  <ul className="chips" aria-label="핵심 기술">
                    {p.coreStack.map((s) => (
                      <li key={s}>
                        <Chip icon={p.coreStackIcons?.[s]}>{s}</Chip>
                      </li>
                    ))}
                  </ul>
                </Tile>
                <Tile cols={5}>
                  <h3 className="tile-title">내 역할</h3>
                  <p>{p.role}</p>
                  <h4 className="tile-subtitle">링크</h4>
                  <ul className="plain-list link-list">
                    {p.links.map((l) => (
                      <li key={l.url}>
                        <ExternalLink href={l.url}>{l.label}</ExternalLink>
                      </li>
                    ))}
                  </ul>
                </Tile>
                <Tile cols={5}>
                  <h3 className="tile-title">주요 기능</h3>
                  <ul className="plain-list">
                    {p.features.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                </Tile>
                <Tile cols={7}>
                  <h3 className="tile-title">구성도</h3>
                  <ol className="flow font-mono" aria-label={`${p.name} 요청 흐름`}>
                    {p.architecture.map((n) => (
                      <li key={n.label}>
                        <strong>{n.label}</strong>
                        <span>{n.note}</span>
                      </li>
                    ))}
                  </ol>
                </Tile>
              </Bento>
            </Scene>

            <Scene id={secondId} title={p.name}>
              <Bento>
                <Tile cols={8} strong>
                  <h3 className="tile-title">문제와 해결</h3>
                  <ol className="problems">
                    {p.problems.map((ps) => (
                      <li key={ps.problem}>
                        <p>
                          <span className="tag tag-lack">문제</span> {ps.problem}
                        </p>
                        <p>
                          <span className="tag">해결</span> {ps.solution}
                        </p>
                      </li>
                    ))}
                  </ol>
                </Tile>
                <Tile cols={4}>
                  <h3 className="tile-title">결과</h3>
                  <dl className="results">
                    {p.results.map((r) => (
                      <div key={r.label}>
                        <dt>{r.value}</dt>
                        <dd>{r.label}</dd>
                      </div>
                    ))}
                  </dl>
                </Tile>
                <Tile cols={12}>
                  <h3 className="tile-title">배포 방식</h3>
                  <p className="font-mono">{p.deploy}</p>
                </Tile>
              </Bento>
            </Scene>
          </Fragment>
        )
      })}
    </>
  )
}
