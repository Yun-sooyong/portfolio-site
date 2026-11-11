import type { Portfolio } from '../../domain/portfolio'
import { SECTION_IDS } from '../../domain/sections'
import { useActiveSection } from '../../ui/useActiveSection'
import { Header } from './Header'
import { Hero } from './Hero'
import { AboutSection } from './AboutSection'
import { SkillsSection } from './SkillsSection'
import { ProjectsSection } from './ProjectsSection'
import { AiProjectsSection } from './AiProjectsSection'
import { CareerSection } from './CareerSection'
import { ContactSection } from './ContactSection'

/** 상세본. 보통 스크롤 한 페이지다. 첫 화면 다음에 구역 5개와 연락처가 이어진다. */
export function DetailView({ data }: { data: Portfolio }) {
  const active = useActiveSection(SECTION_IDS)
  return (
    <>
      <a href="#main" className="skip-link">
        본문으로 건너뛰기
      </a>
      <Header name={data.profile.name} activeId={active} />
      <main id="main" tabIndex={-1}>
        <Hero data={data} />
        <AboutSection data={data} />
        <SkillsSection groups={data.skillGroups} />
        <ProjectsSection projects={data.projects} />
        <AiProjectsSection projects={data.aiProjects} />
        <CareerSection background={data.background} />
        <ContactSection contact={data.contact} />
      </main>
      <footer className="site-footer site-footer-contact">
        <div className="wrap footer-row">
          <p>
            {data.profile.name} · {data.profile.role}
          </p>
          <a href="#top">맨 위로</a>
        </div>
      </footer>
    </>
  )
}
