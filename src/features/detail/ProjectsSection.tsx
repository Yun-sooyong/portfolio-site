import { useState } from 'react'
import type { Project } from '../../domain/portfolio'
import { splitSentences } from '../../domain/text'
import { Chip } from '../../ui/Chip'
import { EmptyNote } from '../../ui/EmptyNote'
import { ProjectLinks } from './ProjectLinks'
import { SectionHead } from './SectionHead'

function ProjectRow({ project, index, open, onToggle }: { project: Project; index: number; open: boolean; onToggle: () => void }) {
  const no = `P/${String(index + 1).padStart(2, '0')}`
  const buttonId = `project-btn-${project.id}`
  const panelId = `project-panel-${project.id}`
  return (
    <li className={`project-item${open ? ' is-open' : ''}`} id={`project-${project.id}`}>
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
