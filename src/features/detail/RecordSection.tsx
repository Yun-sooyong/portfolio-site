import type { HowBuilt, JournalEntry } from '../../domain/portfolio'
import { recentJournal } from '../../domain/journal'
import { ExternalLink } from '../../ui/ExternalLink'
import { MonoText } from '../../ui/MonoText'
import { SectionHead } from './SectionHead'

const dateFormat = new Intl.DateTimeFormat('ko-KR', { dateStyle: 'long' })
/** YYYY-MM-DD 를 사용자 언어 형식으로 바꾼다. 시간대 영향이 없게 연월일로 만든다. */
function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  return dateFormat.format(new Date(y ?? 1970, (m ?? 1) - 1, d ?? 1))
}

/** 05 기록. 이 사이트의 구조와 보안 요점, CI 단계, 최근 시행착오 3개, 전체 기록 링크. */
export function RecordSection({ data, journal }: { data: HowBuilt; journal: JournalEntry[] }) {
  const recent = recentJournal(journal)
  return (
    <section className="section" id="record" aria-labelledby="record-title">
      <div className="wrap">
        <SectionHead id="record" title="이 사이트와 기록" />
        <p className="record-lead">{data.lead}</p>

        <div className="record-grid">
          <div>
            <h3 className="sub-title">구조와 보안</h3>
            <dl className="point-list">
              {data.points.map((i) => (
                <div key={i.title}>
                  <dt>{i.title}</dt>
                  <dd>{i.body}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div>
            <h3 className="sub-title">CI 단계</h3>
            <p className="record-caption">
              <MonoText>.github/workflows/ci.yml</MonoText>
              에서 push마다 위에서 아래로 실행한다.
            </p>
            <ol className="terminal font-mono" aria-label="CI 단계">
              {data.ciSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>
        </div>

        <h3 className="sub-title">최근 시행착오</h3>
        {recent.length === 0 ? (
          <p className="empty-note">아직 기록한 시행착오가 없습니다. 문제를 겪으면 docs/journal.md에 적고 이 구역으로 옮깁니다.</p>
        ) : (
          <ul className="recent-journal">
            {recent.map((e) => (
              <li key={`${e.date}-${e.problem}`}>
                <p className="entry-meta label-mono">
                  <time dateTime={e.date}>{formatDate(e.date)}</time>
                </p>
                <dl>
                  <div>
                    <dt>문제</dt>
                    <dd>{e.problem}</dd>
                  </div>
                  <div>
                    <dt>해결</dt>
                    <dd>{e.fix}</dd>
                  </div>
                </dl>
              </li>
            ))}
          </ul>
        )}
        <ul className="project-links site-more" aria-label="전체 기록">
          <li>
            <ExternalLink href={data.readmeUrl}>
              전체 기록: <span translate="no">GitHub README</span>
            </ExternalLink>
          </li>
          {data.notionUrl ? (
            <li>
              <ExternalLink href={data.notionUrl}>노션 기록</ExternalLink>
            </li>
          ) : null}
        </ul>
      </div>
    </section>
  )
}
