import { Link } from 'react-router-dom'
import type { Contact } from '../../domain/portfolio'
import { ExternalLink } from '../../ui/ExternalLink'
import { ObfuscatedEmail } from '../../ui/ObfuscatedEmail'
import { SectionHead } from './SectionHead'

/** 연락처(번호 없음). 제목 "연락처" 1개, 이메일, GitHub, 단축본 PDF 링크. */
export function ContactSection({ contact }: { contact: Contact }) {
  const host = (url: string) => url.replace(/^https:\/\//, '')
  return (
    <section className="section section-contact" id="contact" aria-labelledby="contact-title">
      <div className="wrap">
        <SectionHead id="contact" title="연락처" />
        <ul className="contact-list">
          <li>
            <p className="contact-label label-mono">이메일</p>
            <p className="contact-value contact-email">
              <ObfuscatedEmail user={contact.email.user} domain={contact.email.domain} />
            </p>
          </li>
          <li>
            <p className="contact-label label-mono">코드 저장소</p>
            <p className="contact-value">
              <ExternalLink href={contact.github}>
                <span translate="no">GitHub</span>
              </ExternalLink>
              <span className="contact-host label-mono">{host(contact.github)}</span>
            </p>
          </li>
          {contact.blog ? (
            <li>
              <p className="contact-label label-mono">글과 기록</p>
              <p className="contact-value">
                <ExternalLink href={contact.blog}>블로그</ExternalLink>
                <span className="contact-host label-mono">{host(contact.blog)}</span>
              </p>
            </li>
          ) : null}
          <li>
            <p className="contact-label label-mono">A4 2쪽 요약</p>
            <p className="contact-value">
              <Link to="/print">단축본 PDF (A4 2쪽)</Link>
              <span className="contact-host">열린 화면에서 “PDF로 저장” 단추를 누른다.</span>
            </p>
          </li>
        </ul>
      </div>
    </section>
  )
}
