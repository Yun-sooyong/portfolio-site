# 포트폴리오 사이트

노션 포트폴리오를 대신하는 정적 사이트다. 백엔드는 없다. 내용은 윤수용의 실제 이력과 프로젝트 4건이다.

| 주소 | 이름 | 내용 |
|---|---|---|
| `/` | 상세본 | 첫 화면과 구역 7개를 보통 스크롤로 보이는 기본 포트폴리오 |
| `/print` | 단축본 | A4 2쪽 이내로 정리한 쪽. 브라우저 인쇄로 PDF를 만든다. `noindex` |
| 그 밖의 주소 | 없음 | "페이지가 없습니다" 화면과 상세본 링크 |

## 상세본 구성

상세본은 한 페이지다. 첫 화면 아래에 번호 붙은 구역 6개와 번호 없는 연락처 구역이 보통 스크롤로 이어진다. 구역 id, 번호, 이름은 `src/domain/sections.ts` 가 정한다.

| 순서 | 구역 (id) | 내용 |
|---|---|---|
| 0 | 첫 화면 | 큰 제목 3줄, 소개 2줄, 버튼 2개(프로젝트 보기, 단축본 PDF), 판독 흐름 카드, 강점 3칸 띠 |
| 01 | 소개 (`about`) | 소개 문단, 강점 3개, 성과 숫자 6칸 |
| 02 | 기술 (`skills`) | 기술 영역마다 칩(기술 1개에 아이콘 1개와 이름 1개), 쓴 곳(`can`), 아직 부족한 것(`lacks`, 선택) |
| 03 | 프로젝트 (`projects`) | 펼치는 목록. 행마다 번호, 이름, 기간, +/− 단추. 펼치면 개요, 맡은 일, 결과, 링크 |
| 04 | AI 프로젝트 (`ai-projects`) | Claude Code로 만든 개인 프로젝트의 펼치는 목록(번호 `A/01`). 펼치면 개요, 맡은 일, 결과 아래에 AI를 쓴 방식, 진행 방식, 중점적으로 본 것이 보인다. 단축본에는 넣지 않는다 |
| 05 | 이력 (`career`) | 경력 경로 막대, 경력·학력·교육·자격증 목록. 자격증은 이름만 보인다 |
| 06 | 기록 (`record`) | 구조·보안 요점, CI 단계, 최근 시행착오 3개, 전체 기록 링크 |
| 없음 | 연락처 (`contact`) | 이메일, GitHub, 블로그(선택), 단축본 PDF. 바닥글과 함께 색을 반전해 보인다 |

- 헤더는 위에 붙는다. 구역 링크 7개와 테마 단추가 있다. 지금 보이는 구역의 링크에 밑줄이 간다. 폭 768px 미만에서는 링크를 메뉴 단추로 접는다.
- 프로젝트 목록은 첫 번째 프로젝트만 펼친 채로 시작한다. AI 프로젝트 목록은 모두 접힌 채로 시작한다. 단추는 `aria-expanded` 와 `aria-controls` 를 쓴다.
- 프로젝트 구역은 요약만 둔다. 구성도, 문제와 해결 같은 자세한 설명은 노션 페이지(`notionUrl`)로 넘긴다. 내용 파일에 해당 필드를 두지 않는다.
- 프로젝트 링크는 `githubUrl`, `demoUrl`, `notionUrl` 이다. 모두 선택이다. 값이 없는 링크는 화면에 보이지 않는다. 이름표는 "GitHub", "데모", "노션에서 자세히"다.
- "기록" 구역의 최근 시행착오는 `journal.ts` 에서 날짜가 늦은 3개를 보인다. 전체 기록은 `docs/journal.md` 와 GitHub README, 노션에 둔다.
- `/print` 는 같은 내용 필드를 읽는다. 프로젝트마다 GitHub, 데모, 노션 주소를 글자로 보인다.

설계 문서는 `docs/plan.md`다. 구현 중 겪은 문제는 `docs/journal.md`에 적는다.

## 실행 방법

필요한 것: Node 22 이상(`.nvmrc`는 25), npm.

```sh
npm ci            # 의존성 설치 (lockfile 그대로)
npm run dev       # 개발 서버 (http://localhost:5173)
npm run lint      # ESLint
npm run typecheck # TypeScript 검사
npm test          # Vitest
npm run build     # dist/ 생성
npm run preview   # dist/ 를 로컬에서 확인
```

## 내용 고치는 방법

내용은 `src/content/` 에서만 고친다. 화면 코드는 고치지 않는다.

| 파일 | 내용 |
|---|---|
| `profile.ts` | 이름, 직무, 소개, 강점, 경력, 학력, 교육 이력(`stack`, `summary`, 선택 `study`), 자격증(선택 `status`) |
| `skills.ts` | 기술. 기술마다 `techs` 에 `{ name, icon? }` 를 1개씩 쓴다. 점수 대신 어느 프로젝트에서 썼는지(`can`)를 문장으로 쓴다. 아직 부족한 것(`lacks`)과 단축본 글자(`printName`)는 선택이다 |
| `projects.ts` | 프로젝트. 배열에 항목 1개를 더하면 상세본에 나타난다. 선택 필드 `githubUrl`, `demoUrl`, `notionUrl`. 단축본은 앞의 4개만 보인다 |
| `aiProjects.ts` | AI로 만든 프로젝트. `projects.ts` 형식에 `aiUsage`(AI를 쓴 방식), `process`(진행 방식), `focus`(중점적으로 본 것)를 더한다. 단축본에는 나오지 않는다 |
| `home.ts` | 첫 화면의 큰 제목 3줄과 강점 3칸 띠. 띠의 `source` 는 출처 프로젝트 id |
| `highlights.ts` | 소개 구역의 성과 숫자 6칸. `source` 는 출처 프로젝트 id(프로필이면 `'profile'`). `accent: true` 인 칸 1개만 강조색이다 |
| `site.ts` | 연락처(블로그 `blog`는 선택)와 "기록" 구역의 구조·보안 요점, CI 단계, 전체 기록 링크 |
| `journal.ts` | 시행착오 기록. 최근 3개가 "기록" 구역에 보인다. `docs/journal.md` 와 같은 항목을 둔다 |

규칙:

1. 프로젝트마다 역할(`role`)과 성과(`results`, 숫자 포함)를 쓴다. 성과 숫자 칸(`highlights.ts`)의 숫자는 출처 프로젝트의 `results` 에도 있어야 한다. 출처가 프로필이면 `intro` 에 있어야 한다(시험이 검사한다). 링크(`githubUrl`, `demoUrl`, `notionUrl`)는 있으면 `https://` 로 시작한다.
2. 전화번호, 주소, 생년월일을 쓰지 않는다. 지역도 쓰지 않는다.
3. 이메일은 `{ user, domain }` 으로 나눠 적는다. HTML 원문에 그대로 두지 않기 위해서다.
4. 기술 아이콘은 `src/ui/techIcons.ts` 에 `simple-icons` 이름을 추가하고, 내용 파일의 `icon` 키로 쓴다. 키가 없으면 글자만 보인다.
5. 첫 화면 소개 2줄은 `profile.ts` 의 `intro` 첫 줄과 끝 줄이고, 가운데 줄은 소개 구역에 보인다. `intro` 줄 수를 바꾸면 배치가 바뀐다.
6. 겪지 않은 시행착오를 쓰지 않는다. 기록이 없으면 `journal.ts` 를 빈 배열로 둔다.
7. `npm test` 가 내용 형식을 검사한다. 빠진 항목이 있으면 시험이 실패한다.

## 배포 연결 절차 (사용자가 직접 한다)

계정과 외부 공개는 사용자가 직접 한다. 이 저장소는 GitHub 저장소와 Vercel 프로젝트를 만들지 않았다.

1. GitHub 저장소를 만들고 공개 범위를 정한다. 이 폴더를 push한다.
2. Vercel에 로그인한다.
3. Vercel에서 저장소를 가져온다(Import). 설정은 기본값(Vite)이다. `vercel.json` 이 rewrites와 헤더를 정한다.
4. GitHub 저장소 보호 규칙에서 CI(`CI / check`) 통과 전 병합을 막는다.

연동 뒤 `main` push는 운영 배포가 되고, pull request는 미리보기 배포가 된다. GitHub에 Vercel 토큰을 두지 않는다.

## 구조

| 폴더 | 역할 | 의존 방향 |
|---|---|---|
| `src/domain/` | 내용의 타입 정의, 구역 목록, 경력 경로 계산. React를 모른다 | 없음 |
| `src/content/` | 실제 내용 데이터 | domain |
| `src/features/` | 구역별 화면 부품(상세본), 단축본, 없는 주소 | domain, ui |
| `src/ui/` | 공용 부품, 현재 구역 훅(`useActiveSection`), 테마 읽기·쓰기(`theme.ts`) | 없음 |
| `src/app/` | 라우터와 페이지 조립. 내용을 화면 부품에 넘긴다 | 모두 |

테마: 밝은 화면이 기본이다. 저장된 선택이 없으면 시스템 설정(`prefers-color-scheme`)을 따른다. `main.tsx` 가 렌더 전에 `<html data-theme>` 를 정한다. 단추 글자는 누르면 바뀔 테마("다크 모드" 또는 "밝은 모드")를 보인다. 선택은 `localStorage` 에 저장하고, 저장소가 막혀 있어도 동작한다.

움직임: 첫 화면이 열릴 때 제목과 카드가 한 번 나타난다(CSS 키프레임). 내용은 JS 없이도 보인다. 프로젝트 펼침은 180ms다. `prefers-reduced-motion: reduce` 이면 둘 다 끈다.

## 보안 요약

1. 개인 정보를 싣지 않는다. 이메일은 화면에서 조립한다(수집 프로그램을 줄일 뿐 완전한 차단은 아니다).
2. `vercel.json` 이 CSP(`default-src 'self'` 기반, `frame-ancestors 'none'`), HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` 를 보낸다.
3. 글꼴은 npm 패키지(`pretendard`, `@fontsource-variable/jetbrains-mono`, `@fontsource-variable/archivo`)로 자체 제공한다. 외부 CDN, 분석 도구, 추적 스크립트가 없다.
4. 빌드 결과에 인라인 script와 `style=` 속성이 없다. 소스 맵을 만들지 않는다. 작은 자산도 data: 로 넣지 않는다(`assetsInlineLimit: 0`).
5. lockfile로 의존성을 고정한다. CI가 `npm audit --audit-level=high` 를 돌린다. Dependabot이 주 1회 갱신을 제안한다.
6. 비밀 값이 없는 구조다.

## 알려진 한계

- 브라우저마다 인쇄 결과가 조금 다르다. Chrome 기준으로 맞췄다.
- `npm audit` 은 개발 도구(ESLint 계열)의 minimatch 중간(moderate) 등급 경고를 보인다. 배포본에 들어가지 않고, 기준(high)보다 낮아 CI는 통과한다.
- `/print` 의 `noindex` 는 `X-Robots-Tag` 헤더(Vercel)와 `<meta name="robots">`(화면에서 추가) 두 가지로 건다.
