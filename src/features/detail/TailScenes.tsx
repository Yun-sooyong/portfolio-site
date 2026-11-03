import { Link } from 'react-router-dom'
import type { Contact, HowBuilt, JournalEntry } from '../../domain/portfolio'
import { Scene } from '../../ui/Scene'
import { ObfuscatedEmail } from '../../ui/ObfuscatedEmail'

export function HowBuiltScene({ data, id, title }: { data: HowBuilt; id: string; title: string }) {
  return (
    <Scene id={id} title={title}>
      <p className="lead">{data.lead}</p>
      <h3 className="sub-title">폴더와 의존 방향</h3>
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
                  <code>{f.folder}</code>
                </th>
                <td>{f.role}</td>
                <td>{f.dependsOn}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {data.groups.map((g) => (
        <div key={g.title}>
          <h3 className="sub-title">{g.title}</h3>
          <dl className="skills">
            {g.items.map((i) => (
              <div key={i.title}>
                <dt>{i.title}</dt>
                <dd>{i.body}</dd>
              </div>
            ))}
          </dl>
        </div>
      ))}
    </Scene>
  )
}

export function JournalScene({ entries, id, title }: { entries: JournalEntry[]; id: string; title: string }) {
  return (
    <Scene id={id} title={title}>
      {entries.length === 0 ? (
        <p className="lead">아직 기록한 시행착오가 없습니다. 문제를 겪으면 docs/journal.md에 적고 이 장면으로 옮깁니다.</p>
      ) : (
        <>
          <p className="lead">이 사이트를 만들며 실제로 겪은 문제만 적었다.</p>
          <ul className="journal">
            {entries.map((e) => (
              <li key={`${e.date}-${e.problem}`}>
                <p className="entry-meta">
                  <time dateTime={e.date}>{e.date}</time>
                </p>
                <dl>
                  <dt>문제</dt>
                  <dd>{e.problem}</dd>
                  <dt>원인</dt>
                  <dd>{e.cause}</dd>
                  <dt>해결</dt>
                  <dd>{e.fix}</dd>
                </dl>
              </li>
            ))}
          </ul>
        </>
      )}
    </Scene>
  )
}

export function ContactScene({ contact, id, title }: { contact: Contact; id: string; title: string }) {
  return (
    <Scene id={id} title={title}>
      <ul className="contact-list">
        <li>
          <span className="tag">이메일</span> <ObfuscatedEmail user={contact.email.user} domain={contact.email.domain} />
        </li>
        <li>
          <span className="tag">GitHub</span>{' '}
          <a href={contact.github} target="_blank" rel="noopener noreferrer">
            {contact.github}
          </a>
        </li>
        <li>
          <span className="tag">블로그</span>{' '}
          <a href={contact.blog} target="_blank" rel="noopener noreferrer">
            {contact.blog}
          </a>
        </li>
        <li>
          <span className="tag">PDF 단축본</span> <Link to="/print">A4 2쪽 단축본 열기</Link>
        </li>
      </ul>
    </Scene>
  )
}
