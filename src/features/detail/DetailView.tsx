import { useMemo } from 'react'
import { MAX_FLAT_DOTS, buildScenePlan, flattenSceneIds } from '../../domain/scenes'
import type { Portfolio } from '../../domain/portfolio'
import { SceneNav } from '../../ui/SceneNav'
import { useActiveScene } from '../../ui/useActiveScene'
import { IntroScene } from './IntroScene'
import { BackgroundScene } from './BackgroundScene'
import { SkillsScene } from './SkillsScene'
import { ProjectDetailScenes, ProjectListScene } from './ProjectScenes'
import { ContactScene, HowBuiltScenes, JournalScenes } from './TailScenes'

/** 상세본. 장면 계획에 따라 화면 한 칸씩 보인다. */
export function DetailView({ data }: { data: Portfolio }) {
  const plan = useMemo(() => buildScenePlan(data), [data])
  const ids = useMemo(() => flattenSceneIds(plan), [plan])
  const active = useActiveScene(ids)
  const stack = useMemo(() => {
    const byName = new Map<string, { name: string; icon?: string }>()
    for (const p of data.projects) {
      for (const name of p.coreStack) {
        if (!byName.has(name)) byName.set(name, { name, icon: p.coreStackIcons?.[name] })
      }
    }
    return [...byName.values()]
  }, [data.projects])
  const title = (id: string) => plan.find((g) => g.id === id)?.title ?? id

  return (
    <>
      <div className="backdrop" aria-hidden="true" />
      <a href="#main" className="skip-link">
        본문으로 건너뛰기
      </a>
      <SceneNav groups={plan} activeId={active} maxFlatDots={MAX_FLAT_DOTS} />
      <main id="main" tabIndex={-1}>
        <IntroScene profile={data.profile} stack={stack} id="intro" title={title('intro')} />
        <BackgroundScene background={data.background} id="background" title={title('background')} />
        <SkillsScene groups={data.skillGroups} id="skills" title={title('skills')} />
        <ProjectListScene projects={data.projects} id="projects" title={title('projects')} />
        <ProjectDetailScenes projects={data.projects} id="project-detail" title={title('project-detail')} />
        <HowBuiltScenes data={data.howBuilt} />
        <JournalScenes entries={data.journal} title={title('journal')} />
        <ContactScene contact={data.contact} id="contact" title={title('contact')} />
      </main>
    </>
  )
}
