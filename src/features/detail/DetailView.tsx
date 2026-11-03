import { SCENES } from '../../domain/scenes'
import type { Portfolio } from '../../domain/portfolio'
import { SceneNav } from '../../ui/SceneNav'
import { useActiveScene } from '../../ui/useActiveScene'
import { IntroScene } from './IntroScene'
import { BackgroundScene } from './BackgroundScene'
import { SkillsScene } from './SkillsScene'
import { ProjectDetailScene, ProjectListScene } from './ProjectScenes'
import { ContactScene, HowBuiltScene, JournalScene } from './TailScenes'

const SCENE_IDS = SCENES.map((s) => s.id)
const title = (id: (typeof SCENES)[number]['id']) => SCENES.find((s) => s.id === id)!.title

/** 상세본. 장면 8개를 순서대로 보인다. */
export function DetailView({ data }: { data: Portfolio }) {
  const active = useActiveScene(SCENE_IDS)

  return (
    <>
      <div className="backdrop" aria-hidden="true" />
      <a href="#intro" className="skip-link">
        본문으로 건너뛰기
      </a>
      <SceneNav scenes={SCENES} activeId={active} />
      <main>
        <IntroScene profile={data.profile} id="intro" title={title('intro')} />
        <BackgroundScene background={data.background} id="background" title={title('background')} />
        <SkillsScene groups={data.skillGroups} id="skills" title={title('skills')} />
        <ProjectListScene projects={data.projects} id="projects" title={title('projects')} />
        <ProjectDetailScene projects={data.projects} id="project-detail" title={title('project-detail')} />
        <HowBuiltScene data={data.howBuilt} id="how-built" title={title('how-built')} />
        <JournalScene entries={data.journal} id="journal" title={title('journal')} />
        <ContactScene contact={data.contact} id="contact" title={title('contact')} />
      </main>
    </>
  )
}
