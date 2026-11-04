import type { Project } from '../../domain/portfolio'
import { projectSceneId } from '../../domain/scenes'
import { Scene } from '../../ui/Scene'
import { ExternalLink } from '../../ui/ExternalLink'
import { EmptyNote } from '../../ui/EmptyNote'
import { MonoText } from '../../ui/MonoText'
import { Bento, Chip, Tile } from '../../ui/Bento'

/** 프로젝트 1개 = 장면 1개. 개요 타일이 강조 타일이다. */
function ProjectScene({ p }: { p: Project }) {
  return (
    <Scene id={projectSceneId(p.id)} title={p.name} aside={`${p.kind}, ${p.period}`}>
      <Bento className={`bento-project ${p.problems.length < 2 ? 'bento-project-p1' : ''}`}>
        <Tile cols={5} strong>
          <h3 className="tile-title">개요</h3>
          <p>{p.overview}</p>
          <ul className="chips" aria-label="핵심 기술">
            {p.coreStack.map((s) => (
              <li key={s}>
                <Chip icon={p.coreStackIcons?.[s]}>{s}</Chip>
              </li>
            ))}
          </ul>
        </Tile>
        <Tile cols={4}>
          <h3 className="tile-title">내 역할</h3>
          <p>{p.role}</p>
          <ul className="plain-list link-list">
            {p.links.map((l) => (
              <li key={l.url}>
                <ExternalLink href={l.url}>{l.label}</ExternalLink>
              </li>
            ))}
          </ul>
        </Tile>
        <Tile cols={3} rows={2} className="tile-results">
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
        <Tile cols={3} className={p.features.length < 4 ? 'tile-roomy' : ''}>
          <h3 className="tile-title">주요 기능</h3>
          <ul className="plain-list">
            {p.features.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </Tile>
        <Tile cols={6} className="tile-flow">
          <h3 className="tile-title">구성도</h3>
          <ol className="flow" aria-label={`${p.name} 요청 흐름`}>
            {p.architecture.map((n) => (
              <li key={n.label}>
                <strong>
                  <MonoText>{n.label}</MonoText>
                </strong>
                <span>
                  <MonoText>{n.note}</MonoText>
                </span>
              </li>
            ))}
          </ol>
        </Tile>
        <Tile cols={9} className={p.problems.length < 2 ? 'tile-roomy-lg' : ''}>
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
        <Tile cols={3} className={p.deploy.length < 60 ? 'tile-roomy' : 'tile-roomy-sm'}>
          <h3 className="tile-title">배포 방식</h3>
          <p>
            <MonoText>{p.deploy}</MonoText>
          </p>
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
