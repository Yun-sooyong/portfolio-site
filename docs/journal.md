# 시행착오 기록

이 사이트를 만들며 실제로 겪은 문제만 적는다. 형식은 날짜, 문제, 원인, 해결이다.

## 2026-11-04

- 문제: 이메일을 화면에서 조립하는 컴포넌트와 장면 표시 컴포넌트가 lint 오류(react-hooks/set-state-in-effect)를 냈다.
- 원인: effect 안에서 setState를 바로 불러서 렌더링이 연쇄로 일어날 수 있다는 규칙에 걸렸다.
- 해결: 이메일은 useSyncExternalStore로 바꿨다. 서버 렌더링 값은 null이고 브라우저에서만 주소를 만든다. 장면 표시는 IntersectionObserver가 없을 때의 상태를 useState 초기값으로 옮겼다.

## 2026-11-04

- 문제: Vitest에서 index.html 을 읽는 시험이 "The URL must be of scheme file" 오류로 실패했다.
- 원인: jsdom 환경에서 import.meta.url 이 file: 주소가 아니어서 new URL(경로, import.meta.url) 이 동작하지 않았다.
- 해결: process.cwd() 기준 resolve()로 경로를 만들어 읽도록 바꿨다.

## 2026-11-04

- 문제: HTML 원문에 이메일이 없는지 검사하려고 StaticRouter로 renderToString을 했더니 "useRoutes() may be used only in the context of a <Router> component" 오류가 났다.
- 원인: react-router 패키지의 StaticRouter와 react-router-dom 의 Routes 가 서로 다른 Router 문맥을 보았다.
- 해결: StaticRouter를 쓰지 않고 MemoryRouter를 renderToString 안에 넣었다. 서버 렌더링 문자열 검사는 그대로 유지했다.

## 2026-11-04

- 문제: headless Chrome에 --window-size=390,844 를 줘도 모바일 화면 캡처의 오른쪽 글자가 잘렸다.
- 원인: headless Chrome은 창 너비가 약 500px 아래로 줄지 않아, 500px 폭으로 배치한 화면을 390px로 잘라 저장했다.
- 해결: Chrome DevTools Protocol로 기기 폭 390px와 360px를 지정해 다시 확인했다. 가로 스크롤이 없음을 scrollWidth로 확인했다.
