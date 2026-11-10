import { Link } from 'react-router-dom'
import type { Contact, HowBuilt, JournalEntry } from '../../domain/portfolio'
import { recentJournal } from '../../domain/scenes'
import { Scene } from '../../ui/Scene'
import { MonoText } from '../../ui/MonoText'
import { Bento, Tile } from '../../ui/Bento'
import { ObfuscatedEmail } from '../../ui/ObfuscatedEmail'
import { ExternalLink } from '../../ui/ExternalLink'

const dateFormat = new Intl.DateTimeFormat('ko-KR', { dateStyle: 'long' })
/** YYYY-MM-DD 를 사용자 언어 형식으로 바꾼다. 시간대 영향이 없게 연월일로 만든다. */
function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  return dateFormat.format(new Date(y ?? 1970, (m ?? 1) - 1, d ?? 1))
}

/**
 * "이 사이트와 기록" 장면 1개. 구조·보안 요점(강조 타일), CI 단계, 최근 시행착오 3개, 전체 기록 링크.
 * 시행착오 전체는 docs/journal.md 와 GitHub README, 노션에 둔다.
 */
export function SiteScene({ data, journal, id, title }: { data: HowBuilt; journal: JournalEntry[]; id: string; title: string }) {
  const recent = recentJournal(journal)
  return (
    <Scene id={id} title={title} aside={data.lead}>
      <Bento className="bento-site">
        <Tile cols={7} strong className="tile-points">
          <h3 className="tile-title">구조와 보안</h3>
          <dl className="skills">
            {data.points.map((i) => (
              <div key={i.title}>
                <dt>{i.title}</dt>
                <dd>{i.body}</dd>
              </div>
            ))}
          </dl>
        </Tile>
        <Tile cols={5} className="tile-ci">
          <h3 className="tile-title">CI 단계</h3>
          <p className="tile-caption">
            <MonoText>.github/workflows/ci.yml</MonoText>
            에서 push마다 위에서 아래로 실행한다.
          </p>
          <ol className="terminal font-mono" aria-label="CI 단계">
            {data.ciSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </Tile>
        <Tile cols={12} className="tile-recent">
          <h3 className="tile-title">최근 시행착오</h3>
          {recent.length === 0 ? (
            <p className="empty-note">아직 기록한 시행착오가 없습니다. 문제를 겪으면 docs/journal.md에 적고 이 장면으로 옮깁니다.</p>
          ) : (
            <ul className="recent-journal">
              {recent.map((e) => (
                <li key={`${e.date}-${e.problem}`}>
                  <p className="entry-meta">
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
        </Tile>
      </Bento>
    </Scene>
  )
}

/** 연락처 장면. 이메일 타일이 강조 타일이다. 타일마다 이름표는 위에, 링크는 아래에 두어 칸을 채운다. */
export function ContactScene({ contact, id, title }: { contact: Contact; id: string; title: string }) {
  const host = (url: string) => url.replace(/^https:\/\//, '')
  return (
    <Scene id={id} title={title}>
      <Bento className="bento-contact">
        <Tile cols={7} strong className="tile-contact">
          <p className="contact-label">이메일</p>
          <div>
            <p className="contact-email">
              <ObfuscatedEmail user={contact.email.user} domain={contact.email.domain} />
            </p>
          </div>
        </Tile>
        <Tile cols={5} className="tile-contact">
          <p className="contact-label">코드 저장소</p>
          <div>
            <p className="contact-link">
              <ExternalLink href={contact.github}>
                <span translate="no">GitHub</span>
              </ExternalLink>
            </p>
            <p className="contact-host font-mono">{host(contact.github)}</p>
          </div>
        </Tile>
        {contact.blog ? (
          <Tile cols={5} className="tile-contact">
            <p className="contact-label">글과 기록</p>
            <div>
              <p className="contact-link">
                <ExternalLink href={contact.blog}>블로그</ExternalLink>
              </p>
              <p className="contact-host font-mono">{host(contact.blog)}</p>
            </div>
          </Tile>
        ) : null}
        <Tile cols={contact.blog ? 7 : 12} className="tile-contact">
          <p className="contact-label">A4 2쪽 요약</p>
          <div>
            <p className="contact-link">
              <Link to="/print">PDF 단축본 (A4 2쪽)</Link>
            </p>
            <p className="contact-host">열린 화면에서 “PDF로 저장” 단추를 누른다.</p>
          </div>
        </Tile>
      </Bento>
    </Scene>
  )
}
