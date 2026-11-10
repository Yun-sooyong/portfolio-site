import type { Project } from '../../domain/portfolio'
import { projectLinkItems } from '../../domain/links'
import { projectSceneId } from '../../domain/scenes'
import { Scene } from '../../ui/Scene'
import { EmptyNote } from '../../ui/EmptyNote'
import { Bento, Chip, Tile } from '../../ui/Bento'
import { ProjectLinks } from './ProjectLinks'

/**
 * 프로젝트 1개 = 장면 1개. 요약만 둔다: 간단한 설명, 소개, 기술, 성과, 맡은 역할, 링크.
 * 구성도와 문제 해결 같은 자세한 내용은 노션 링크로 넘긴다. 소개 타일이 강조 타일이다.
 */
function ProjectScene({ p }: { p: Project }) {
  const hasLinks = projectLinkItems(p).length > 0
  return (
    <Scene id={projectSceneId(p.id)} title={p.name} aside={`${p.kind}, ${p.period}`}>
      <Bento className="bento-project">
        <Tile cols={hasLinks ? 8 : 12} strong className="tile-intro">
          <h3 className="tile-title">소개</h3>
          <p className="project-lead">{p.summary}</p>
          <p className="project-overview">{p.overview}</p>
          <ul className="chips" aria-label="핵심 기술">
            {p.coreStack.map((s) => (
              <li key={s}>
                <Chip icon={p.coreStackIcons?.[s]}>{s}</Chip>
              </li>
            ))}
          </ul>
        </Tile>
        {hasLinks ? (
          <Tile cols={4} className="tile-links">
            <h3 className="tile-title">링크</h3>
            <ProjectLinks project={p} className="project-links-lg project-links-stack" />
          </Tile>
        ) : null}
        <Tile cols={4} className="tile-role">
          <h3 className="tile-title">맡은 역할</h3>
          <p>{p.role}</p>
        </Tile>
        <Tile cols={8} className="tile-results">
          <h3 className="tile-title">성과</h3>
          <dl className="results">
            {p.results.map((r) => (
              <div key={r.label}>
                <dt>{r.value}</dt>
                <dd>{r.label}</dd>
              </div>
            ))}
          </dl>
        </Tile>
      </Bento>
    </Scene>
  )
}

/** 프로젝트 상세 장면들. 프로젝트마다 1장면이다. */
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
      {projects.map((p) => (
        <ProjectScene key={p.id} p={p} />
      ))}
    </>
  )
}
