import { useSyncExternalStore } from 'react'

interface ObfuscatedEmailProps {
  user: string
  domain: string
  className?: string
}

/**
 * 이메일을 화면에서 조립한다. 서버가 보내는 HTML 원문에는 주소가 없다.
 * 수집 프로그램을 줄이는 방법이며 완전한 차단은 아니다.
 */
export function ObfuscatedEmail({ user, domain, className }: ObfuscatedEmailProps) {
  // 서버 렌더링(HTML 원문)에서는 null이고, 브라우저에서만 주소를 조립한다.
  const address = useSyncExternalStore(
    () => () => {},
    () => `${user}@${domain}`,
    () => null,
  )

  if (!address) return <span className={className}>이메일 표시 준비 중</span>
  return (
    <a className={className} href={`mailto:${address}`}>
      {address}
    </a>
  )
}
