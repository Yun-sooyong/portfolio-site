import { Link } from 'react-router-dom'
import type { Contact, HowBuilt, JournalEntry } from '../../domain/portfolio'
import { JOURNAL_PAGE_SIZE, journalPageCount, journalSceneId } from '../../domain/scenes'
import { Scene } from '../../ui/Scene'
import { MonoText } from '../../ui/MonoText'
import { Bento, Tile, type ColSpan } from '../../ui/Bento'
import { ObfuscatedEmail } from '../../ui/ObfuscatedEmail'
import { ExternalLink } from '../../ui/ExternalLink'

const dateFormat = new Intl.DateTimeFormat('ko-KR', { dateStyle: 'long' })
/** YYYY-MM-DD 를 사용자 언어 형식으로 바꾼다. 시간대 영향이 없게 연월일로 만든다. */
function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  return dateFormat.format(new Date(y ?? 1970, (m ?? 1) - 1, d ?? 1))
}

function GroupTile({ group, cols, className }: { group: HowBuilt['groups'][number]; cols: ColSpan; className?: string }) {
  return (
    <Tile cols={cols} className={className}>
      <h3 className="tile-title">{group.title}</h3>
      <dl className="skills">
        {group.items.map((i) => (
          <div key={i.title}>
            <dt>{i.title}</dt>
            <dd>{i.body}</dd>
          </div>
        ))}
      </dl>
    </Tile>
  )
}

/** 만든 방식 장면 1개. 폴더 표 타일이 강조 타일이다. */
export function HowBuiltScene({ data }: { data: HowBuilt }) {
  const [structure, scale, ...security] = data.groups
  return (
    <Scene id="how-built" title="이 사이트를 만든 방식" aside={data.lead}>
      <Bento className="bento-how">
        <Tile cols={6} strong>
          <h3 className="tile-title">폴더와 의존 방향</h3>
          <div className="table-wrap">
            <table className="folder-table">
              <thead>
                <tr>
                  <th scope="col">폴더</th>
                  <th scope="col">역할</th>
                  <th scope="col">의존하는 곳</th>
                </tr>
              </thead>
              <tbody>
                {data.folders.map((f) => (
                  <tr key={f.folder}>
                    <th scope="row">
                      <code className="font-mono" translate="no">
                        {f.folder}
                      </code>
                    </th>
                    <td>{f.role}</td>
                    <td>
                      <MonoText>{f.dependsOn}</MonoText>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Tile>
        {structure ? <GroupTile group={structure} cols={3} className="tile-roomy" /> : null}
        {scale ? <GroupTile group={scale} cols={3} className="tile-roomy" /> : null}
        {security.map((g) => (
          <GroupTile key={g.title} group={g} cols={8} className="tile-two-col" />
        ))}
        <Tile cols={4}>
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
      </Bento>
    </Scene>
  )
}

/** 시행착오 타일의 열 수. 한 장면의 기록 수에 맞춰 빈 곳이 없게 정한다. */
function journalCols(count: number, index: number): ColSpan {
  if (count <= 3) return 12
  if (count === 4) return 6
  if (count === 5) return index < 3 ? 4 : 6
  return 4
}

function JournalList({ entries }: { entries: JournalEntry[] }) {
  const wide = entries.length <= 3
  return (
    <>
      {entries.map((e, i) => (
        <Tile as="li" key={`${e.date}-${e.problem}`} cols={journalCols(entries.length, i)} className={`tile-journal${wide ? ' tile-journal-wide' : ''}`}>
          <p className="entry-meta">
            <time dateTime={e.date}>{formatDate(e.date)}</time>
          </p>
          <dl>
            <div>
              <dt>문제</dt>
              <dd>{e.problem}</dd>
            </div>
            <div>
              <dt>원인</dt>
              <dd>{e.cause}</dd>
            </div>
            <div>
              <dt>해결</dt>
              <dd>{e.fix}</dd>
            </div>
          </dl>
        </Tile>
      ))}
    </>
  )
}

/**
 * 시행착오를 JOURNAL_PAGE_SIZE개씩 장면 1개에 보인다. 기록이 없으면 빈 상태 문구를 보인다.
 * 연락처는 이 장면에 섞지 않고 따로 둔다.
 */
export function JournalScenes({ entries, title }: { entries: JournalEntry[]; title: string }) {
  const pages = journalPageCount(entries.length)
  return (
    <>
      {Array.from({ length: pages }, (_, i) => {
        const pageEntries = entries.slice(i * JOURNAL_PAGE_SIZE, (i + 1) * JOURNAL_PAGE_SIZE)
        return (
          <Scene
            key={i}
            id={journalSceneId(i)}
            title={i === 0 ? title : `${title}, 이어서`}
            aside={i === 0 && entries.length > 0 ? '이 사이트를 만들며 실제로 겪은 문제만 적었다.' : undefined}
          >
            {entries.length === 0 ? (
              <p className="lead">아직 기록한 시행착오가 없습니다. 문제를 겪으면 docs/journal.md에 적고 이 장면으로 옮깁니다.</p>
            ) : null}
            <Bento as="ul" className={`journal bento-journal-${Math.min(pageEntries.length, 6)}`}>
              <JournalList entries={pageEntries} />
            </Bento>
          </Scene>
        )
      })}
    </>
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
        <Tile cols={5} className="tile-contact">
          <p className="contact-label">글과 기록</p>
          <div>
            <p className="contact-link">
              <ExternalLink href={contact.blog}>블로그</ExternalLink>
            </p>
            <p className="contact-host font-mono">{host(contact.blog)}</p>
          </div>
        </Tile>
        <Tile cols={7} className="tile-contact">
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
