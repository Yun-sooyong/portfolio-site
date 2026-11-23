# 포트폴리오 사이트

윤수용의 포트폴리오 사이트입니다. 백엔드가 없는 정적 사이트이고, Vercel에 배포합니다.

- 사이트: https://programmer-ysy-portfolio.vercel.app
- 프로젝트별 자세한 설명: [노션 프로젝트 상세](https://yun-sooyong.notion.site/40f258595efe81c686b7c4981ce79f82)

| 주소 | 이름 | 내용 |
|---|---|---|
| `/` | 상세본 | 첫 화면과 구역 6개를 보통 스크롤로 보는 기본 포트폴리오 |
| `/doc` | PDF 원본 | 내용 파일 전체를 A4 10쪽 이내로 정리한 쪽입니다. `npm run pdf` 가 이 쪽을 `public/yun-sooyong-portfolio.pdf` 로 저장합니다. 사이트 화면에서는 링크하지 않습니다. `noindex` |
| `/print` | 단축본 | A4 2쪽 이내로 정리한 쪽입니다. 브라우저 인쇄로 PDF를 만듭니다. 사이트 화면에서는 링크하지 않습니다. `noindex` |
| 그 밖의 주소 | 없음 | "페이지가 없습니다" 화면과 상세본 링크 |

## 상세본 구성

상세본은 한 페이지입니다. 첫 화면 아래에 번호 붙은 구역 6개와 번호 없는 연락처 구역이 이어집니다. 구역 id, 번호, 이름은 `src/domain/sections.ts` 에서 정합니다.

| 순서 | 구역 (id) | 내용 |
|---|---|---|
| 0 | 첫 화면 | 큰 제목 3줄, 소개 2줄, 버튼 1개(프로젝트 보기), 판독 흐름 카드, 강점 3칸 띠 |
| 01 | 소개 (`about`) | 소개 문단, 강점 3개, 성과 숫자 6칸 |
| 02 | 기술 (`skills`) | 기술 영역마다 칩(기술 1개에 아이콘 1개와 이름 1개), 쓴 곳(`can`), 아직 부족한 것(`lacks`, 선택) |
| 03 | 프로젝트 (`projects`) | 펼치는 목록. 행마다 번호, 이름, 기간, +/− 단추가 있고, 펼치면 개요, 맡은 일, 결과, 화면 이미지, 링크가 보입니다 |
| 04 | AI 프로젝트 (`ai-projects`) | Claude Code로 만든 개인 프로젝트의 펼치는 목록(번호 `A/01`). 개요와 사용한 AI, 속도와 생산성, 시스템 설계, 문제 해결, 품질 관리, 작업 흐름 다이어그램 링크가 있습니다. 단축본에는 넣지 않습니다 |
| 05 | 이력 (`career`) | 경력 경로 막대, 경력·학력·교육·자격증 목록 |
| 없음 | 연락처 (`contact`) | 이메일, GitHub, 블로그(선택). 바닥글과 함께 색을 반전해 보입니다 |

- 헤더는 화면 위에 고정됩니다. 구역 링크 6개와 테마 단추가 있고, 지금 보이는 구역의 링크에 밑줄이 생깁니다. 폭 768px 미만에서는 링크를 메뉴 단추로 접습니다.
- 프로젝트 목록은 첫 번째 프로젝트만 펼친 채로 시작합니다. AI 프로젝트 목록은 모두 접힌 채로 시작합니다. 단추는 `aria-expanded` 와 `aria-controls` 를 씁니다.
- 프로젝트 구역에는 요약만 둡니다. 구성도, 문제와 해결 같은 자세한 설명은 노션 페이지(`notionUrl`)에 있습니다.
- 프로젝트 링크는 `githubUrl`, `demoUrl`, `notionUrl` 이고 모두 선택입니다. 값이 없는 링크는 화면에 보이지 않습니다.
- 이 사이트의 구조, 보안, CI 설명은 04 AI 프로젝트의 "포트폴리오 사이트" 항목에 있습니다. 구현 중 겪은 문제는 `docs/journal.md` 에 적었습니다.
- `/doc` 는 같은 내용 파일을 읽어 PDF 원본을 만듭니다. 내용 파일을 고친 뒤에는 `npm run pdf` 를 다시 실행해 `public/yun-sooyong-portfolio.pdf` 를 갱신하고 함께 커밋합니다. Chrome 경로가 다르면 `CHROME_PATH` 환경 변수로 지정합니다.
- `/print` 는 같은 내용 파일을 읽고, 프로젝트마다 GitHub, 데모, 노션 주소를 글자로 보입니다.

설계 문서는 `docs/plan.md` 입니다.

## 실행 방법

Node 22 이상(`.nvmrc` 는 25)과 npm이 필요합니다.

```sh
npm ci            # 의존성 설치 (lockfile 그대로)
npm run dev       # 개발 서버 (http://localhost:5173)
npm run lint      # ESLint
npm run typecheck # TypeScript 검사
npm test          # Vitest
npm run build     # dist/ 생성
npm run preview   # dist/ 를 로컬에서 확인
npm run pdf       # 빌드 뒤 /doc 를 PDF로 저장 (시스템 Chrome 필요, 로컬 전용, CI에서 실행하지 않음)
```

## 내용 파일

화면에 보이는 내용은 모두 `src/content/` 에 있습니다. 내용을 바꿀 때 화면 코드는 바꾸지 않아도 됩니다.

| 파일 | 내용 |
|---|---|
| `profile.ts` | 이름, 직무, 소개, 강점, 경력, 학력, 교육 이력(`stack`, `summary`, 선택 `study`), 자격증(선택 `status`) |
| `skills.ts` | 기술. 기술마다 `techs` 에 `{ name, icon? }` 를 1개씩 둡니다. 점수 대신 어느 프로젝트에서 썼는지(`can`)를 문장으로 적습니다. `lacks` 와 `printName` 은 선택입니다 |
| `projects.ts` | 프로젝트. 배열에 항목 1개를 더하면 상세본에 나타납니다. 단축본에는 앞의 4개만 보입니다. 선택 필드 `shot` 은 화면 이미지이며 파일은 `public/shots/` 에 둡니다. 단축본에는 나오지 않습니다 |
| `aiProjects.ts` | AI로 만든 프로젝트. `aiAreas`, `tools`, `impact`, `design`, `cases`, `quality`, `workflowUrl` 을 둡니다. `githubUrl`, `notionUrl`, `demoUrl` 은 선택입니다. 선택 필드 `shot` 은 화면 이미지이며 파일은 `public/shots/` 에 둡니다. 단축본에는 나오지 않습니다 |
| `home.ts` | 첫 화면의 큰 제목 3줄과 강점 3칸 띠. 띠의 `source` 는 출처 프로젝트 id입니다 |
| `highlights.ts` | 소개 구역의 성과 숫자 6칸. `source` 는 출처 프로젝트 id(프로필이면 `'profile'`)입니다. `accent: true` 인 칸 1개만 강조색입니다 |
| `site.ts` | 연락처. 블로그(`blog`)는 선택입니다 |

`npm test` 가 내용 형식을 검사합니다.

1. 프로젝트마다 역할(`role`)과 숫자가 든 성과(`results`)가 있어야 합니다.
2. 성과 숫자 칸의 숫자는 출처 프로젝트의 `results`(프로필이면 `intro`)에도 있어야 합니다.
3. 링크는 `https://` 로 시작해야 합니다.

개인 정보 기준은 다음과 같습니다.

- 전화번호, 주소, 생년월일, 지역은 싣지 않습니다.
- 이메일은 `{ user, domain }` 으로 나눠 두고 화면에서 조립합니다. HTML 원문에 주소가 그대로 남지 않게 하기 위해서입니다.

기술 아이콘은 `src/ui/techIcons.ts` 에 `simple-icons` 이름으로 등록하고 내용 파일의 `icon` 키로 고릅니다. 키가 없으면 글자만 보입니다.

## 배포

GitHub 저장소를 Vercel 프로젝트에 연결해 두었습니다.

- `main` 에 push하면 운영 배포가 됩니다.
- pull request를 열면 미리보기 배포가 됩니다.
- Vercel 설정은 기본값(Vite)입니다. rewrites와 보안 헤더는 `vercel.json` 에서 정합니다.
- GitHub Actions CI(`CI / check`)가 lint, 타입 검사, 시험, 빌드, `npm audit` 을 실행합니다.
- GitHub에는 Vercel 토큰을 두지 않습니다.

## 구조

| 폴더 | 역할 | 의존 방향 |
|---|---|---|
| `src/domain/` | 내용의 타입 정의, 구역 목록, 경력 경로 계산. React를 쓰지 않습니다 | 없음 |
| `src/content/` | 실제 내용 데이터 | domain |
| `src/features/` | 구역별 화면 부품(상세본), 단축본, 없는 주소 | domain, ui |
| `src/ui/` | 공용 부품, 현재 구역 훅(`useActiveSection`), 테마 읽기·쓰기(`theme.ts`) | 없음 |
| `src/app/` | 라우터와 페이지 조립. 내용을 화면 부품에 넘깁니다 | 모두 |

- **테마:** 밝은 화면이 기본입니다. 저장된 선택이 없으면 시스템 설정(`prefers-color-scheme`)을 따릅니다. `main.tsx` 가 렌더 전에 `<html data-theme>` 를 정합니다. 선택은 `localStorage` 에 저장하고, 저장소가 막혀 있어도 동작합니다.
- **움직임:** 첫 화면이 열릴 때 제목과 카드가 한 번 나타납니다(CSS 키프레임). 내용은 JS 없이도 보입니다. 프로젝트 펼침은 180ms입니다. `prefers-reduced-motion: reduce` 이면 둘 다 끕니다.

## 보안

1. 개인 정보를 싣지 않습니다. 이메일은 화면에서 조립합니다. 이 방법은 주소 수집 프로그램을 줄일 뿐, 완전히 막지는 못합니다.
2. `vercel.json` 이 CSP(`default-src 'self'` 기반, `frame-ancestors 'none'`), HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` 를 보냅니다.
3. 글꼴은 npm 패키지(`pretendard`, `@fontsource-variable/jetbrains-mono`, `@fontsource-variable/archivo`)로 직접 제공합니다. 외부 CDN, 분석 도구, 추적 스크립트가 없습니다.
4. 빌드 결과에 인라인 script와 `style=` 속성이 없습니다. 소스 맵을 만들지 않고, 작은 자산도 data: 로 넣지 않습니다(`assetsInlineLimit: 0`).
5. lockfile로 의존성을 고정합니다. CI가 `npm audit --audit-level=high` 를 실행하고, Dependabot이 주 1회 갱신을 제안합니다.
6. 비밀 값이 필요 없는 구조입니다.

## 알려진 한계

- 브라우저마다 인쇄 결과가 조금 다릅니다. Chrome 기준으로 맞췄습니다.
- `npm audit` 은 개발 도구(ESLint 계열)의 minimatch 중간(moderate) 등급 경고를 보입니다. 이 패키지는 배포본에 들어가지 않습니다. 경고 등급이 기준(high)보다 낮아 CI는 통과합니다.
- `/print` 의 `noindex` 는 `X-Robots-Tag` 헤더(Vercel)와 `<meta name="robots">`(화면에서 추가) 두 가지로 겁니다.
