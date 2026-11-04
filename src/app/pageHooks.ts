import { useEffect } from 'react'

/** 문서 제목을 쓰고, 나갈 때 되돌린다. */
export function useDocumentTitle(title: string) {
  useEffect(() => {
    const prev = document.title
    document.title = title
    return () => {
      document.title = prev
    }
  }, [title])
}

/** 검색 엔진에 노출하지 않는 쪽에서 robots 메타를 붙인다. */
export function useNoindex() {
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
