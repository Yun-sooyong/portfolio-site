import type { Portfolio } from '../../domain/portfolio'
import { ObfuscatedEmail } from '../../ui/ObfuscatedEmail'
import { ExampleBadge } from '../../ui/ExampleBadge'

/** 단축본(A4). 소개, 경력·학력, 기술 요약, 프로젝트 상위 3개, 연락처. */
export function PrintSheet({ data }: { data: Portfolio }) {
  const { profile, background, skillGroups, projects, contact } = data
  const top = projects.slice(0, 3)

  return (
    <main className="print-page" id="main" tabIndex={-1}>
      <div className="print-toolbar">
        <button type="button" className="print-button" onClick={() => window.print()}>
          PDF로 저장
        </button>
        <p>인쇄 창에서 대상을 “PDF로 저장”으로 고른다. 여백은 “기본”, 배경 그래픽은 꺼도 된다.</p>
      </div>

      <article className="sheet">
        <header className="sheet-header">
          <h1>{profile.name}</h1>
          <p>
            {profile.role}, {profile.region}
          </p>
          <p>
            <ObfuscatedEmail user={contact.email.user} domain={contact.email.domain} />
            {' / '}
            {contact.github.replace('https://', '')}
          </p>
        </header>

        <ExampleBadge className="sheet-example" />

        <section>
          <h2>소개</h2>
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
          <h2>경력과 학력</h2>
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
                <strong>{t.name}</strong> {t.org}, {t.period}
              </li>
            ))}
            <li>
              <strong>자격증</strong> {background.certificates.map((c) => `${c.name}(${c.date})`).join(', ')}
            </li>
          </ul>
        </section>

        <section>
          <h2>기술 요약</h2>
          <ul>
            {skillGroups.map((g) => (
              <li key={g.title}>
                <strong>{g.title}.</strong> {g.skills.map((s) => s.name).join(', ')}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2>프로젝트</h2>
          {top.map((p) => (
            <article key={p.id} className="sheet-project">
              <h3>
                {p.name} <span>{p.kind}, {p.period}</span>
              </h3>
              <dl>
                <dt>개요</dt>
                <dd>{p.summary}</dd>
                <dt>역할</dt>
                <dd>{p.role}</dd>
                <dt>문제 해결</dt>
                <dd>{p.problems[0] ? `${p.problems[0].problem} ${p.problems[0].solution}` : '해당 없음'}</dd>
                <dt>결과</dt>
                <dd>{p.results.map((r) => `${r.value} ${r.label}`).join(', ')}</dd>
              </dl>
            </article>
          ))}
        </section>

        <section>
          <h2>연락처</h2>
          <p>
            <ObfuscatedEmail user={contact.email.user} domain={contact.email.domain} />, GitHub {contact.github.replace('https://', '')}, 블로그{' '}
            {contact.blog.replace('https://', '')}
          </p>
        </section>
      </article>
    </main>
  )
}
