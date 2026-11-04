/**
 * index.html 에서 404.html 을 만든다.
 * 같은 앱 진입점(절대 경로 자산)을 쓰고, 검색 엔진 색인을 막는 meta를 정적으로 넣는다.
 * 인라인 script는 넣지 않는다.
 */
export function make404Html(indexHtml: string): string {
  const meta = '<meta name="robots" content="noindex" />'
  if (indexHtml.includes('name="robots"')) return indexHtml
  return indexHtml.replace('</head>', `    ${meta}\n  </head>`)
}
