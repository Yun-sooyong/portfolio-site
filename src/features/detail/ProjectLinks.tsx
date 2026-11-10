import type { Project } from '../../domain/portfolio'
import { projectLinkItems } from '../../domain/links'
import { ExternalLink } from '../../ui/ExternalLink'

/**
 * 프로젝트 링크 목록(GitHub, 데모, 노션에서 자세히). 값이 없는 링크는 그리지 않는다.
 * 같은 이름표가 여러 프로젝트에 나오므로 보조 기술용 글자에 프로젝트 이름을 붙인다.
 */
export function ProjectLinks({ project, className = '' }: { project: Project; className?: string }) {
  const items = projectLinkItems(project)
  if (items.length === 0) return null
  return (
    <ul className={`project-links ${className}`.trim()} aria-label={`${project.name} 링크`}>
      {items.map((l) => (
        <li key={l.kind}>
          <ExternalLink href={l.url}>
            <span translate={l.kind === 'github' ? 'no' : undefined}>{l.label}</span>
            <span className="sr-only">, {project.name}</span>
          </ExternalLink>
        </li>
      ))}
    </ul>
  )
}
