import type { SkillGroup } from '../../domain/portfolio'
import { Scene } from '../../ui/Scene'

export function SkillsScene({ groups, id, title }: { groups: SkillGroup[]; id: string; title: string }) {
  return (
    <Scene id={id} title={title}>
      <p className="lead">쓸 수 있는 기술마다 할 수 있는 것과 아직 부족한 것을 적었다.</p>
      {groups.map((g) => (
        <div key={g.title} className="skill-group">
          <h3 className="sub-title">{g.title}</h3>
          <dl className="skills">
            {g.skills.map((s) => (
              <div key={s.name}>
                <dt>{s.name}</dt>
                <dd>
                  <span className="tag">할 수 있는 것</span> {s.can}
                </dd>
                <dd>
                  <span className="tag tag-lack">아직 부족한 것</span> {s.lacks}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      ))}
    </Scene>
  )
}
