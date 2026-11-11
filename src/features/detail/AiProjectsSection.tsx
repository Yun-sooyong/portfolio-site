import { useState } from 'react'
import type { AiProject } from '../../domain/portfolio'
import { Chip } from '../../ui/Chip'
import { EmptyNote } from '../../ui/EmptyNote'
import { ExternalLink } from '../../ui/ExternalLink'
import { ProjectRow } from './ProjectsSection'
import { SectionHead } from './SectionHead'

function ListColumn({ label, items }: { label: string; items: string[] }) {
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

function AiProjectBody({ project: p }: { project: AiProject }) {
  return (
    <>
      <div className="project-body project-body-ai-top">
        <div className="project-col">
          <p className="col-label label-mono">개요</p>
          <p className="project-lead">{p.summary}</p>
          <p>{p.overview}</p>
          <ul className="chips">
            {p.coreStack.map((name) => (
              <li key={name}>
                <Chip icon={p.coreStackIcons?.[name]}>{name}</Chip>
              </li>
            ))}
          </ul>
          <p className="ai-areas-title label-mono">AI를 쓴 곳</p>
          <ul className="ai-areas">
            {p.aiAreas.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </div>
        <div className="project-col">
          <p className="col-label label-mono">사용한 AI</p>
          <ul className="tool-list">
            {p.tools.map((t) => (
              <li key={t.name}>
                <strong>{t.name}</strong>
                <span>{t.use}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="project-col project-col-results">
          <p className="col-label label-mono">속도와 생산성</p>
          <ul className="arrow-list">
            {p.impact.map((r) => (
              <li key={r.value}>
                <strong>{r.value}</strong> {r.label}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="project-body project-body-ai">
        <ListColumn label="시스템 설계" items={p.design} />
        <div className="project-col">
          <p className="col-label label-mono">문제 해결</p>
          <ul className="case-list">
            {p.cases.map((c) => (
              <li key={c.situation}>
                <p className="case-situation">{c.situation}</p>
                <p className="case-choice">
                  <span className="sr-only">판단: </span>
                  {c.choice}
                </p>
              </li>
            ))}
          </ul>
        </div>
        <ListColumn label="품질 관리" items={p.quality} />
      </div>
      <ul className="project-links project-links-row" aria-label={`${p.name} 링크`}>
        {p.githubUrl ? (
          <li>
            <ExternalLink href={p.githubUrl}>
              <span translate="no">GitHub</span>
              <span className="sr-only">, {p.name}</span>
            </ExternalLink>
          </li>
        ) : null}
        <li>
          <ExternalLink href={p.workflowUrl}>
            작업 흐름 다이어그램
            <span className="sr-only">, {p.name}</span>
          </ExternalLink>
        </li>
      </ul>
    </>
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
        <p className="section-note">Claude Code로 바이브 코딩한 개인 프로젝트. AI에게 맡긴 일과 내가 정한 것을 나눠 적었다.</p>
        {projects.length === 0 ? <EmptyNote /> : null}
        <ol className="project-list">
          {projects.map((p, i) => (
            <ProjectRow key={p.id} head={p} index={i} prefix="A" idPrefix="ai-project" open={openIds.has(p.id)} onToggle={() => toggle(p.id)}>
              <AiProjectBody project={p} />
            </ProjectRow>
          ))}
        </ol>
      </div>
    </section>
  )
}
