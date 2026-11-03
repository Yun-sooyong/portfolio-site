import { useEffect } from 'react'
import { portfolio } from '../content'
import { DetailView } from '../features/detail/DetailView'
import { PrintSheet } from '../features/print/PrintSheet'
import { NotFound } from '../features/notfound/NotFound'

/** 문서 제목을 쓰고, 나갈 때 되돌린다. */
function useDocumentTitle(title: string) {
  useEffect(() => {
    const prev = document.title
    document.title = title
    return () => {
      document.title = prev
    }
  }, [title])
}

/** 검색 엔진에 노출하지 않는 쪽에서 robots 메타를 붙인다. */
function useNoindex() {
  useEffect(() => {
    const meta = document.createElement('meta')
    meta.name = 'robots'
    meta.content = 'noindex'
    document.head.appendChild(meta)
    return () => {
      meta.remove()
    }
  }, [])
}

export function DetailPage() {
  useDocumentTitle(`${portfolio.profile.name} 포트폴리오 (예시)`)
  useEffect(() => {
    document.documentElement.classList.add('snap')
    return () => document.documentElement.classList.remove('snap')
  }, [])
  return <DetailView data={portfolio} />
}

export function PrintPage() {
  useDocumentTitle(`${portfolio.profile.name} 포트폴리오 단축본 (예시)`)
  useNoindex()
  return <PrintSheet data={portfolio} />
}

export function NotFoundPage() {
  useDocumentTitle('페이지가 없습니다')
  useNoindex()
  return <NotFound />
}
