import { Component, type ErrorInfo, type ReactNode } from 'react'

interface State {
  failed: boolean
}

/** 화면 그리기나 쪽 불러오기가 실패해도 앱 전체가 빈 화면이 되지 않게 한다. */
export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { failed: false }

  static getDerivedStateFromError(): State {
    return { failed: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // 분석 도구를 쓰지 않으므로 브라우저 콘솔에만 남긴다.
    console.error(error, info.componentStack)
  }

  render() {
    if (!this.state.failed) return this.props.children
    return (
      <main className="notfound" id="main" tabIndex={-1}>
        <h1>화면을 불러오지 못했습니다</h1>
        <p>네트워크가 끊겼거나 새 버전이 배포됐을 수 있습니다. 페이지를 새로고침한 뒤에도 같으면 잠시 뒤에 다시 열어 주세요.</p>
        <button type="button" className="notfound-link" onClick={() => window.location.reload()}>
          새로고침
        </button>
      </main>
    )
  }
}
