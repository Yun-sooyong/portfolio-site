import { TechIcons } from '../../ui/TechIcon'
import { EmptyNote } from '../../ui/EmptyNote'
import type { SkillGroup } from '../../domain/portfolio'
import { SectionHead } from './SectionHead'

/** 02 기술. 영역마다 카드 1개(모바일 1열, 768px 이상 2열). 아이콘 칩과 할 수 있는 일 문장. */
export function SkillsSection({ groups }: { groups: SkillGroup[] }) {
  return (
    <section className="section" id="skills" aria-labelledby="skills-title">
      <div className="wrap">
        <SectionHead id="skills" title="기술마다 쓴 곳이 있다" />
        {groups.length === 0 ? <EmptyNote /> : null}
        <div className="skill-grid">
          {groups.map((g) => (
            <article key={g.title} className="card skill-card">
              <h3 className="card-title">{g.title}</h3>
              <dl className="skill-list">
                {g.skills.map((s) => (
                  <div key={s.name}>
                    <dt className="chip font-mono">
                      <TechIcons icon={s.icon} />
                      {s.name}
                    </dt>
                    <dd>{s.can}</dd>
                    {s.lacks ? <dd>아직 부족한 것: {s.lacks}</dd> : null}
                  </div>
                ))}
              </dl>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
