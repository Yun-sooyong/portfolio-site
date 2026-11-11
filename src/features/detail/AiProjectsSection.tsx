import { useState } from 'react'
import type { AiProject } from '../../domain/portfolio'
import { EmptyNote } from '../../ui/EmptyNote'
import { ProjectRow } from './ProjectsSection'
import { SectionHead } from './SectionHead'

function Column({ label, items }: { label: string; items: string[] }) {
  return (
    <div className="project-col">
      <p className="col-label label-mono">{label}</p>
      <ul className="dash-list">
        {items.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
    </div>
  )
}

/** 04 AI 프로젝트. 프로젝트 구역과 같은 펼침 목록이다. 기본은 모두 접힌다. */
export function AiProjectsSection({ projects }: { projects: AiProject[] }) {
  const [openIds, setOpenIds] = useState<ReadonlySet<string>>(() => new Set())
  const toggle = (id: string) =>
    setOpenIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  return (
    <section className="section" id="ai-projects" aria-labelledby="ai-projects-title">
      <div className="wrap">
        <SectionHead id="ai-projects" title="AI로 만든 프로젝트" />
        <p className="section-note">Claude Code로 바이브 코딩한 개인 프로젝트. AI에게 무엇을 맡기고 무엇을 직접 정했는지 적었다.</p>
        {projects.length === 0 ? <EmptyNote /> : null}
        <ol className="project-list">
          {projects.map((p, i) => (
            <ProjectRow
              key={p.id}
              project={p}
              index={i}
              prefix="A"
              idPrefix="ai-project"
              open={openIds.has(p.id)}
              onToggle={() => toggle(p.id)}
              extra={
                <div className="project-body project-body-ai">
                  <Column label="AI를 쓴 방식" items={p.aiUsage} />
                  <Column label="진행 방식" items={p.process} />
                  <Column label="중점적으로 본 것" items={p.focus} />
                </div>
              }
            />
          ))}
        </ol>
      </div>
    </section>
  )
}
