import { Link } from 'react-router-dom'
import type { Contact } from '../../domain/portfolio'
import { ExternalLink } from '../../ui/ExternalLink'
import { ObfuscatedEmail } from '../../ui/ObfuscatedEmail'
import { SectionHead } from './SectionHead'

/** 연락처(번호 없음). 제목 "연락처" 1개, 이메일, GitHub, 인쇄용 단축본 링크. */
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
              <Link to="/print">인쇄용 단축본 (A4 2쪽)</Link>
              <span className="contact-host">열린 화면에서 “PDF로 저장” 단추를 누릅니다.</span>
            </p>
          </li>
          <li>
            <p className="contact-label label-mono">PDF 내려받기</p>
            <p className="contact-value">
              <a href="/yun-sooyong-portfolio.pdf" download>
                포트폴리오 PDF
              </a>
              <span className="contact-host">내용 전체를 A4 10쪽 이내로 정리한 파일입니다.</span>
            </p>
          </li>
        </ul>
      </div>
    </section>
  )
}
