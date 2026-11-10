import { portfolio } from '../content'
import { PrintSheet } from '../features/print/PrintSheet'
import { useDocumentTitle, useNoindex } from './pageHooks'

export function PrintPage() {
  useDocumentTitle(`${portfolio.profile.name} 포트폴리오 단축본`)
  useNoindex()
  return <PrintSheet data={portfolio} />
}
