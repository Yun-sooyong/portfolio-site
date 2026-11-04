import { Link } from 'react-router-dom'

/** 없는 주소 화면. 상세본 링크를 보인다. */
export function NotFound() {
  return (
    <main className="notfound" id="main" tabIndex={-1}>
      <h1>페이지가 없습니다</h1>
      <p>주소를 잘못 입력했거나 옮겨진 페이지입니다. 상세본으로 돌아가 내용을 확인합니다.</p>
      <Link to="/" className="notfound-link">
        상세본으로 가기
      </Link>
    </main>
  )
}
