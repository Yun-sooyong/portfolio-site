import { useEffect } from 'react'
import { portfolio } from '../content'
import { DetailView } from '../features/detail/DetailView'
import { useDocumentTitle } from './pageHooks'

export function DetailPage() {
  useDocumentTitle(`${portfolio.profile.name} 포트폴리오 (예시)`)
  useEffect(() => {
    document.documentElement.classList.add('snap')
    return () => document.documentElement.classList.remove('snap')
  }, [])
  return <DetailView data={portfolio} />
}
