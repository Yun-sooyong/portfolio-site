import type { Project } from '../../domain/portfolio'
import { projectSceneId } from '../../domain/scenes'
import { Bento, Chip, Tile, type ColSpan } from '../../ui/Bento'
import { EmptyNote } from '../../ui/EmptyNote'
import { Scene } from '../../ui/Scene'
import { ProjectLinks } from './ProjectLinks'

/** 프로젝트 목록 장면. 첫 프로젝트가 큰 강조 타일이고, 나머지는 오른쪽에 쌓는다. 타일마다 대표 결과 숫자 1개를 보인다. */
export function ProjectListScene({ projects, id, title }: { projects: Project[]; id: string; title: string }) {
  const restCount = projects.length - 1
  // 첫 프로젝트는 가로로 넓은 강조 타일이다. 나머지는 한 줄에 나란히 놓는다(1개면 12열, 2개면 6열, 3개 이상이면 4열).
  const restCols: ColSpan = restCount <= 1 ? 12 : restCount === 2 ? 6 : 4
  return (
    <Scene id={id} title={title}>
      {projects.length === 0 ? (
        <EmptyNote>등록한 프로젝트가 없습니다. src/content/projects.ts 에 항목을 더합니다.</EmptyNote>
      ) : null}
      <Bento as="ul" className="bento-projects">
        {projects.map((p, i) => {
          const result = p.results[0]
          return (
            <Tile
              key={p.id}
              as="li"
              link
              strong={i === 0}
              cols={i === 0 ? 12 : restCols}
              className={i === 0 ? 'project-first' : ''}
            >
              <div className="project-card">
                <div className="project-card-main">
                  <a href={`#${projectSceneId(p.id)}`} className="project-row-name project-card-link">
                    {p.name}
                  </a>
                  <span className="project-row-meta">
                    {p.kind}, {p.period}
                  </span>
                  <span className="chips chips-plain">
                    {p.coreStack.map((s) => (
                      <Chip key={s} icon={p.coreStackIcons?.[s]} plain>
                        {s}
                      </Chip>
                    ))}
                  </span>
                  <span className="project-row-summary">{p.summary}</span>
                  <ProjectLinks project={p} />
                </div>
                {result ? (
                  <span className="project-result">
                    <span className="project-result-value">{result.value}</span>
                    <span className="project-result-label">{result.label}</span>
                  </span>
                ) : null}
              </div>
            </Tile>
          )
        })}
      </Bento>
    </Scene>
  )
}
