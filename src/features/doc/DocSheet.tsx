import type { Portfolio, ProjectShot } from '../../domain/portfolio'
import { projectLinkItems } from '../../domain/links'
import { ObfuscatedEmail } from '../../ui/ObfuscatedEmail'

const shortLabel = { github: 'GitHub', demo: '데모', notion: '노션' } as const
const host = (url: string) => url.replace(/^https:\/\//, '')

function Shot({ shot }: { shot?: ProjectShot }) {
  if (!shot) return null
  return (
    <figure className="doc-shot">
      <img src={shot.src} alt={shot.alt} width={shot.width} height={shot.height} />
      <figcaption>{shot.caption}</figcaption>
    </figure>
  )
}

/** 다운로드용 포트폴리오 PDF 원본(A4, 10쪽 이하). 내용 파일 전체를 읽는다. scripts/make-pdf.mjs 가 이 쪽을 PDF로 찍는다. */
export function DocSheet({ data }: { data: Portfolio }) {
  const { profile, background, skillGroups, projects, aiProjects, contact, highlights } = data

  return (
    <main className="print-page doc-page" id="main" tabIndex={-1}>
      <article className="sheet doc-sheet">
        <header className="sheet-header">
          <h1>{profile.name}</h1>
          <p>{profile.role}</p>
          <p>
            <ObfuscatedEmail user={contact.email.user} domain={contact.email.domain} />
            {' / '}
            GitHub {host(contact.github)}
            {contact.site ? ` / ${host(contact.site)}` : ''}
          </p>
        </header>

        <section>
          <h2>소개와 강점</h2>
          <p>{profile.intro.join(' ')}</p>
          <ul>
            {profile.strengths.map((s) => (
              <li key={s.title}>
                <strong>{s.title}.</strong> {s.evidence}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2>성과 숫자</h2>
          <ul className="doc-highlights">
            {highlights.map((h) => (
              <li key={h.id}>
                <p className="doc-hl-value">
                  {h.value}
                  {h.unit ? <span> {h.unit}</span> : null}
                </p>
                <p className="doc-hl-caption">{h.caption}</p>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2>기술</h2>
          <dl className="doc-skills">
            {skillGroups.map((g) => (
              <div key={g.title} className="doc-skill-group">
                <dt>{g.title}</dt>
                <dd>
                  <ul>
                    {g.skills.map((s) => (
                      <li key={s.techs.map((t) => t.name).join('/')}>
                        <strong>{s.printName ?? s.techs.map((t) => t.name).join(' / ')}.</strong> {s.can}
                        {s.lacks ? ` 부족한 점: ${s.lacks}` : ''}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section>
          <h2>프로젝트</h2>
          {projects.map((p) => {
            const links = projectLinkItems(p)
            return (
              <article key={p.id} className="doc-project">
                <div className="doc-keep">
                  <h3>
                    {p.name} <span>{p.kind}, {p.period}</span>
                  </h3>
                  <p>{p.summary}</p>
                </div>
                <dl className="doc-dl">
                  <dt>개요</dt>
                  <dd>{p.overview}</dd>
                  <dt>기술</dt>
                  <dd>{p.coreStack.join(', ')}</dd>
                  <dt>맡은 일</dt>
                  <dd>{p.role}</dd>
                  <dt>결과</dt>
                  <dd>{p.results.map((r) => `${r.value} ${r.label}`).join(' / ')}</dd>
                  {links.length > 0 ? (
                    <>
                      <dt>링크</dt>
                      <dd>
                        {links.map((l, i) => (
                          <span key={l.kind} className="sheet-link">
                            {i > 0 ? ' · ' : ''}
                            {shortLabel[l.kind]} <a href={l.url}>{host(l.url)}</a>
                          </span>
                        ))}
                      </dd>
                    </>
                  ) : null}
                </dl>
                <Shot shot={p.shot} />
              </article>
            )
          })}
        </section>

        <section>
          <h2>AI로 만든 프로젝트</h2>
          {aiProjects.map((p) => {
            const links = projectLinkItems(p)
            return (
              <article key={p.id} className="doc-project">
                <div className="doc-keep">
                  <h3>
                    {p.name} <span>{p.kind}, {p.period}</span>
                  </h3>
                  <p>{p.overview}</p>
                </div>
                <dl className="doc-dl">
                  <dt>기술</dt>
                  <dd>{p.coreStack.join(', ')}</dd>
                  <dt>사용한 AI</dt>
                  <dd>{p.tools.map((t) => `${t.name}: ${t.use}`).join(' / ')}</dd>
                  <dt>속도와 생산성</dt>
                  <dd>{p.impact.map((r) => `${r.value} ${r.label}`).join(' / ')}</dd>
                  <dt>시스템 설계</dt>
                  <dd>
                    <ul>
                      {p.design.map((d) => (
                        <li key={d}>{d}</li>
                      ))}
                    </ul>
                  </dd>
                  <dt>문제 해결</dt>
                  <dd>
                    <ul>
                      {p.cases.map((c) => (
                        <li key={c.situation}>
                          {c.situation} {c.choice}
                        </li>
                      ))}
                    </ul>
                  </dd>
                  <dt>품질 관리</dt>
                  <dd>
                    <ul>
                      {p.quality.map((q) => (
                        <li key={q}>{q}</li>
                      ))}
                    </ul>
                  </dd>
                  {links.length > 0 ? (
                    <>
                      <dt>링크</dt>
                      <dd>
                        {links.map((l, i) => (
                          <span key={l.kind} className="sheet-link">
                            {i > 0 ? ' · ' : ''}
                            {shortLabel[l.kind]} <a href={l.url}>{host(l.url)}</a>
                          </span>
                        ))}
                      </dd>
                    </>
                  ) : null}
                </dl>
                <Shot shot={p.shot} />
              </article>
            )
          })}
        </section>

        <section>
          <h2>이력</h2>
          <ul>
            {background.careers.map((c) => (
              <li key={c.org}>
                <strong>{c.org}</strong> {c.role}, {c.period}. {c.summary}
              </li>
            ))}
            {background.educations.map((e) => (
              <li key={e.school}>
                <strong>{e.school}</strong> {e.major}, {e.period}
              </li>
            ))}
            {background.trainings.map((t) => (
              <li key={t.name}>
                <strong>{t.name}</strong> {t.org}, {t.period}. {t.summary} 배운 기술: {t.stack.join(', ')}.
                {t.study ? ` 스터디: ${t.study}` : ''}
              </li>
            ))}
            <li>
              <strong>자격증</strong>{' '}
              {background.certificates.map((c) => `${c.name}(${c.date}${c.status ? `, ${c.status}` : ''})`).join(', ')}
            </li>
          </ul>
        </section>
      </article>
    </main>
  )
}
