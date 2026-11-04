import type { SkillGroup } from '../../domain/portfolio'
import type { ColSpan } from '../../ui/Bento'
import { Bento, Tile } from '../../ui/Bento'
import { TechIcons } from '../../ui/TechIcon'
import { Scene } from '../../ui/Scene'
import { EmptyNote } from '../../ui/EmptyNote'

/** 기술 장면. 기술 그룹마다 타일 1개다. 앞 2개는 넓고 나머지는 좁다. 첫 타일이 강조 타일이다. */
export function SkillsScene({ groups, id, title }: { groups: SkillGroup[]; id: string; title: string }) {
  const span = (i: number): ColSpan => (i < 2 ? 6 : 4)
  return (
    <Scene id={id} title={title}>
      <p className="lead">쓸 수 있는 기술마다 할 수 있는 것과 아직 부족한 것을 적었다.</p>
      {groups.length === 0 ? <EmptyNote /> : null}
      <Bento>
        {groups.map((g, i) => (
          <Tile key={g.title} cols={span(i)} strong={i === 0}>
            <h3 className="tile-title">{g.title}</h3>
            <dl className="skills">
              {g.skills.map((s) => (
                <div key={s.name}>
                  <dt className="font-mono">
                    <TechIcons icon={s.icon} />
                    {s.name}
                  </dt>
                  <dd>
                    <span className="tag">할 수 있는 것</span> {s.can}
                  </dd>
                  <dd>
                    <span className="tag tag-lack">아직 부족한 것</span> {s.lacks}
                  </dd>
                </div>
              ))}
            </dl>
          </Tile>
        ))}
      </Bento>
    </Scene>
  )
}
