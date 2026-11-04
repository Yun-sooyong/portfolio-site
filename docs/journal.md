# 시행착오 기록

이 사이트를 만들며 실제로 겪은 문제만 적는다. 형식은 날짜, 문제, 원인, 해결이다.

## 2026-11-04

- 문제: 이메일을 화면에서 조립하는 컴포넌트와 장면 표시 컴포넌트가 lint 오류(react-hooks/set-state-in-effect)를 냈다.
- 원인: effect 안에서 setState를 바로 불러서 렌더링이 연쇄로 일어날 수 있다는 규칙에 걸렸다.
- 해결: 이메일은 useSyncExternalStore로 바꿨다. 서버 렌더링 값은 null이고 브라우저에서만 주소를 만든다. 장면 표시는 IntersectionObserver가 없을 때의 상태를 useState 초기값으로 옮겼다.

## 2026-11-04

- 문제: Vitest에서 index.html 을 읽는 시험이 “The URL must be of scheme file” 오류로 실패했다.
- 원인: jsdom 환경에서 import.meta.url 이 file: 주소가 아니어서 new URL(경로, import.meta.url) 이 동작하지 않았다.
- 해결: process.cwd() 기준 resolve()로 경로를 만들어 읽도록 바꿨다.

## 2026-11-04

- 문제: HTML 원문에 이메일이 없는지 검사하려고 StaticRouter로 renderToString을 했더니 “useRoutes() may be used only in the context of a <Router> component” 오류가 났다.
- 원인: react-router 패키지의 StaticRouter와 react-router-dom 의 Routes 가 서로 다른 Router 문맥을 보았다.
- 해결: StaticRouter를 쓰지 않고 MemoryRouter를 renderToString 안에 넣었다. 서버 렌더링 문자열 검사는 그대로 유지했다.

## 2026-11-04

- 문제: headless Chrome에 --window-size=390,844 를 줘도 모바일 화면 캡처의 오른쪽 글자가 잘렸다.
- 원인: headless Chrome은 창 너비가 약 500px 아래로 줄지 않아, 500px 폭으로 배치한 화면을 390px로 잘라 저장했다.
- 해결: Chrome DevTools Protocol로 기기 폭 390px와 360px를 지정해 다시 확인했다. 가로 스크롤이 없음을 scrollWidth로 확인했다.

## 2026-11-05

- 문제: 모바일 우선 CSS로 바꾼 뒤 "이 사이트를 만든 방식" 장면의 표 머리글이 열 폭이 맞지 않고 좁게 찌그러졌다.
- 원인: 표 머리글(thead)에 table-row를 주어 table-header-group이어야 할 표시 방식을 잘못 지정했다.
- 해결: thead는 table-header-group, 행(tr)은 table-row로 나누어 지정하고 캡처로 다시 확인했다.

## 2026-11-05

- 문제: 캡처 스크립트의 출력을 head로 잘라 보았더니 장면 일부만 저장되고 헤드리스 Chrome이 남았다.
- 원인: head가 먼저 끝나면서 파이프가 닫혀 Node 스크립트가 중간에 종료되었고, 정리 코드가 실행되지 않았다.
- 해결: 출력을 파일로 저장한 뒤 읽도록 바꾸고, 실행마다 별도 프로필 폴더를 쓰게 했다. 남은 Chrome은 PID로 종료했다.

## 2026-11-05

- 문제: 장면을 한 칸씩 맞추는 snap을 켜자 장면 시작 위치가 16px 모자라게(884, 1784) 맞춰졌다.
- 원인: html에 지정한 scroll-padding-top: 1rem이 snap 위치 계산에도 적용되었다.
- 해결: snap을 켜는 화면에서는 scroll-padding-top을 0으로 했다. 휠, 키보드, 점 클릭 모두 장면 시작 위치(900, 1800)와 같아졌다.

## 2026-11-05

- 문제: 장면 높이를 100svh로 고정하자 1280x720과 1024x768에서 기술, 만든 방식, 시행착오 장면의 내용이 화면 높이를 넘었다(예: 743px 대 720px).
- 원인: 글자와 간격이 화면 높이와 상관없이 같았고, 폭이 좁아져 줄바꿈이 늘었다.
- 해결: 화면 높이에 맞춰 기준 글자 크기를 줄이고(13~16px) 제목과 간격을 줄였다. 6개 화면 크기에서 모든 장면의 scrollHeight가 창 높이 이하임을 확인했다.
