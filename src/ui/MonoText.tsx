import type { ReactNode } from 'react'

// 영문 기술 이름, 명령어, 경로 덩어리. 예: Docker, GitHub Actions, src/domain, .github/workflows/ci.yml
const LATIN_RUN = /(\.?[A-Za-z](?:[A-Za-z0-9._/+-]*[A-Za-z0-9_/+-])?(?: [A-Z][A-Za-z0-9._/+-]*)*)/g

/**
 * 문장 안의 영문 기술 이름만 JetBrains Mono(code)로 그리고, 한글은 Pretendard 그대로 둔다.
 * 한글이 mono 글꼴 안에 섞여 폭이 어긋나는 일을 막는다.
 */
export function MonoText({ children }: { children: string }): ReactNode {
  const parts = children.split(LATIN_RUN)
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <code key={i} className="font-mono mono-term" translate="no">
        {part}
      </code>
    ) : (
      part
    ),
  )
}
