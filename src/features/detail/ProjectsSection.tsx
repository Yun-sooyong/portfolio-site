import { useState, type ReactNode } from 'react'
import type { Project } from '../../domain/portfolio'
import { splitSentences } from '../../domain/text'
import { Chip } from '../../ui/Chip'
import { EmptyNote } from '../../ui/EmptyNote'
import { ProjectLinks } from './ProjectLinks'
import { SectionHead } from './SectionHead'

interface ProjectRowProps {
  project: Project
  index: number
  open: boolean
  onToggle: () => void
  /** 번호 앞 글자. 팀 프로젝트는 P, AI 프로젝트는 A */
  prefix?: string
  /** id 앞 글자. 같은 프로젝트 id가 두 목록에 있어도 겹치지 않게 한다 */
  idPrefix?: string
  /** 3열 아래에 더하는 줄(AI 프로젝트의 둘째 줄) */
  extra?: ReactNode
}

/** 펼침 행 1개. 프로젝트 구역과 AI 프로젝트 구역이 함께 쓴다. */
export function ProjectRow({ project, index, open, onToggle, prefix = 'P', idPrefix = 'project', extra }: ProjectRowProps) {
  const no = `${prefix}/${String(index + 1).padStart(2, '0')}`
  const buttonId = `${idPrefix}-btn-${project.id}`
  const panelId = `${idPrefix}-panel-${project.id}`
  return (
    <li className={`project-item${open ? ' is-open' : ''}`} id={`${idPrefix}-${project.id}`}>
      <h3 className="project-heading">
        <button type="button" id={buttonId} className="project-toggle" aria-expanded={open} aria-controls={panelId} onClick={onToggle}>
          <span className="project-no label-mono">{no}</span>
          <span className="project-name">{project.name}</span>
          <span className="project-period label-mono">{project.period}</span>
          <span className="pm" aria-hidden="true" />
        </button>
      </h3>
      <div className="project-panel" id={panelId} role="region" aria-labelledby={buttonId} inert={!open}>
        <div className="project-panel-inner">
          <div className="project-body">
            <div className="project-col">
              <p className="col-label label-mono">개요</p>
              <p className="project-lead">{project.summary}</p>
              <p>{project.overview}</p>
              <ul className="chips">
                {project.coreStack.map((name) => (
                  <li key={name}>
                    <Chip icon={project.coreStackIcons?.[name]}>{name}</Chip>
                  </li>
                ))}
              </ul>
            </div>
            <div className="project-col">
              <p className="col-label label-mono">맡은 일</p>
              <ul className="dash-list">
                {splitSentences(project.role).map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
            <div className="project-col project-col-results">
              <p className="col-label label-mono">결과</p>
              <ul className="arrow-list">
                {project.results.map((r) => (
                  <li key={r.value}>
                    <strong>{r.value}</strong> {r.label}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {extra}
          <ProjectLinks project={project} className="project-links-row" />
        </div>
      </div>
    </li>
  )
}

/** 03 프로젝트. 행마다 +/− 단추로 펼친다. 첫 프로젝트는 펼친 채로 시작한다. */
export function ProjectsSection({ projects }: { projects: Project[] }) {
  const [openIds, setOpenIds] = useState<ReadonlySet<string>>(() => new Set(projects[0] ? [projects[0].id] : []))
  const toggle = (id: string) =>
    setOpenIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  return (
    <section className="section" id="projects" aria-labelledby="projects-title">
      <div className="wrap">
        <SectionHead id="projects" title={`프로젝트 ${projects.length}건`} />
        {projects.length === 0 ? <EmptyNote /> : null}
        <ol className="project-list">
          {projects.map((p, i) => (
            <ProjectRow key={p.id} project={p} index={i} open={openIds.has(p.id)} onToggle={() => toggle(p.id)} />
          ))}
        </ol>
      </div>
    </section>
  )
}
