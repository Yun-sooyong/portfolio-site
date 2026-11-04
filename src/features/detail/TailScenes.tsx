import { Link } from 'react-router-dom'
import type { Contact, HowBuilt, JournalEntry } from '../../domain/portfolio'
import { JOURNAL_PAGE_SIZE, journalPageCount, journalSceneId } from '../../domain/scenes'
import { Scene } from '../../ui/Scene'
import { Bento, Tile, type ColSpan } from '../../ui/Bento'
import { ObfuscatedEmail } from '../../ui/ObfuscatedEmail'
import { ExternalLink } from '../../ui/ExternalLink'

const dateFormat = new Intl.DateTimeFormat('ko-KR', { dateStyle: 'long' })
/** YYYY-MM-DD 를 사용자 언어 형식으로 바꾼다. 시간대 영향이 없게 연월일로 만든다. */
function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  return dateFormat.format(new Date(y ?? 1970, (m ?? 1) - 1, d ?? 1))
}

function GroupTile({ group, cols, strong = false }: { group: HowBuilt['groups'][number]; cols: ColSpan; strong?: boolean }) {
  return (
    <Tile cols={cols} strong={strong}>
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

/**
 * 만든 방식을 화면 두 칸으로 나눈다.
 * 첫 칸은 폴더 표(강조), 구조, 확장성이다. 둘째 칸은 보안과 CI 단계(터미널 모양 블록)다.
 */
export function HowBuiltScenes({ data }: { data: HowBuilt }) {
  const [structure, scale, ...security] = data.groups
  return (
    <>
      <Scene id="how-built" title="이 사이트를 만든 방식">
        <p className="lead">{data.lead}</p>
        <Bento>
          <Tile cols={7} rows={2} strong>
            <h3 className="tile-title">폴더와 의존 방향</h3>
            <div className="table-wrap font-mono">
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
                        <code translate="no">{f.folder}</code>
                      </th>
                      <td>{f.role}</td>
                      <td>{f.dependsOn}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Tile>
          {structure ? <GroupTile group={structure} cols={5} /> : null}
          {scale ? <GroupTile group={scale} cols={5} /> : null}
        </Bento>
      </Scene>
      <Scene id="how-built-2" title="구조, 확장성, 보안">
        <Bento>
          {security.map((g, i) => (
            <GroupTile key={g.title} group={g} cols={7} strong={i === 0} />
          ))}
          <Tile cols={5}>
            <h3 className="tile-title">CI 단계</h3>
            <p className="tile-caption font-mono">.github/workflows/ci.yml, push마다 위에서 아래로 실행</p>
            <ol className="terminal font-mono" aria-label="CI 단계">
              {data.ciSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </Tile>
        </Bento>
      </Scene>
    </>
  )
}

function JournalList({ entries }: { entries: JournalEntry[] }) {
  // 넓은 칸과 좁은 칸을 엇갈려 놓는다: 7+5, 5+7.
  const cols = (i: number): ColSpan => ([7, 5, 5, 7] as const)[i % 4] ?? 6
  return (
    <Bento as="ul" className="journal">
      {entries.map((e, i) => (
        <Tile as="li" key={`${e.date}-${e.problem}`} cols={cols(i)}>
          <p className="entry-meta">
            <time dateTime={e.date}>{formatDate(e.date)}</time>
          </p>
          <dl>
            <dt>문제</dt>
            <dd>{e.problem}</dd>
            <dt>원인</dt>
            <dd>{e.cause}</dd>
            <dt>해결</dt>
            <dd>{e.fix}</dd>
          </dl>
        </Tile>
      ))}
    </Bento>
  )
}

/** 시행착오를 JOURNAL_PAGE_SIZE개씩 화면 한 칸에 보인다. 기록이 없으면 빈 상태 문구를 보인다. */
export function JournalScenes({ entries, title }: { entries: JournalEntry[]; title: string }) {
  if (entries.length === 0) {
    return (
      <Scene id="journal" title={title}>
        <p className="lead">아직 기록한 시행착오가 없습니다. 문제를 겪으면 docs/journal.md에 적고 이 장면으로 옮깁니다.</p>
      </Scene>
    )
  }
  const pages = journalPageCount(entries.length)
  return (
    <>
      {Array.from({ length: pages }, (_, i) => (
        <Scene key={i} id={journalSceneId(i)} title={i === 0 ? title : `${title}, 이어서`}>
          {i === 0 ? <p className="lead">이 사이트를 만들며 실제로 겪은 문제만 적었다.</p> : null}
          <JournalList entries={entries.slice(i * JOURNAL_PAGE_SIZE, (i + 1) * JOURNAL_PAGE_SIZE)} />
        </Scene>
      ))}
    </>
  )
}

/** 연락처 장면. 이메일 타일이 강조 타일이다. */
export function ContactScene({ contact, id, title }: { contact: Contact; id: string; title: string }) {
  const host = (url: string) => url.replace(/^https:\/\//, '')
  return (
    <Scene id={id} title={title}>
      <Bento>
        <Tile cols={8} rows={2} strong className="tile-center">
          <h3 className="tile-title">이메일</h3>
          <p className="contact-email">
            <ObfuscatedEmail user={contact.email.user} domain={contact.email.domain} />
          </p>
        </Tile>
        <Tile cols={4}>
          <p className="contact-link">
            <ExternalLink href={contact.github}>
              <span translate="no">GitHub</span>
            </ExternalLink>
          </p>
          <p className="contact-host font-mono">{host(contact.github)}</p>
        </Tile>
        <Tile cols={4}>
          <p className="contact-link">
            <ExternalLink href={contact.blog}>블로그</ExternalLink>
          </p>
          <p className="contact-host font-mono">{host(contact.blog)}</p>
        </Tile>
        <Tile cols={12}>
          <p className="contact-link">
            <Link to="/print">PDF 단축본 (A4 2쪽)</Link>
          </p>
          <p className="contact-host">열린 화면에서 “PDF로 저장” 단추를 누른다.</p>
        </Tile>
      </Bento>
    </Scene>
  )
}
