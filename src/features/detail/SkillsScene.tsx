import type { SkillGroup } from '../../domain/portfolio'
import { Bento, Tile, type ColSpan } from '../../ui/Bento'
import { EmptyNote } from '../../ui/EmptyNote'
import { MonoText } from '../../ui/MonoText'
import { Scene } from '../../ui/Scene'
import { TechIcons } from '../../ui/TechIcon'

const HANGUL = /[가-힣]/

/** 기술 이름. 영문 기술 이름은 mono, 한글이 섞이면 영문 부분만 mono로 그린다. */
function SkillName({ name, icon }: { name: string; icon?: string | string[] }) {
  const mixed = HANGUL.test(name)
  return (
    <dt className={mixed ? undefined : 'font-mono'}>
      <TechIcons icon={icon} />
      {mixed ? <MonoText>{name}</MonoText> : name}
    </dt>
  )
}

// 기술 그룹 타일의 열 수. 앞 2개는 넓고 나머지는 좁다.
const SKILL_COLS: ColSpan[] = [6, 6, 4, 4, 4]

/** 기술 장면. 기술 그룹마다 타일 1개이고 첫 타일이 강조 타일이다. */
export function SkillsScene({ groups, id, title }: { groups: SkillGroup[]; id: string; title: string }) {
  return (
    <Scene id={id} title={title} aside="기술마다 할 수 있는 것과 아직 부족한 것을 적었다.">
      <Bento className="bento-skills">
        {groups.length === 0 ? <EmptyNote /> : null}
        {groups.map((g, i) => (
          <Tile key={g.title} cols={SKILL_COLS[i] ?? 4} strong={i === 0} className={g.skills.length < 2 ? 'tile-roomy' : ''}>
            <h3 className="tile-title">{g.title}</h3>
            <dl className="skills">
              {g.skills.map((s) => (
                <div key={s.name}>
                  <SkillName name={s.name} icon={s.icon} />
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
