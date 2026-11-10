# 포트폴리오 사이트

노션 포트폴리오를 대신하는 정적 사이트다. 백엔드는 없다. 내용은 윤수용의 실제 이력과 프로젝트 4건이다.

| 주소 | 이름 | 내용 |
|---|---|---|
| `/` | 상세본 | 장면 9개(프로젝트 4개 기준)로 나눈 기본 포트폴리오 |
| `/print` | 단축본 | A4 2쪽 이내로 정리한 쪽. 브라우저 인쇄로 PDF를 만든다. `noindex` |
| 그 밖의 주소 | 없음 | "페이지가 없습니다" 화면과 상세본 링크 |

## 상세본 장면 구성

장면 순서는 아래와 같다. 큰 장면 6개이고, 프로젝트가 늘면 프로젝트 장면만 늘어난다(지금은 프로젝트 4개라 장면 9개).

| 순서 | 장면 | 내용 |
|---|---|---|
| 1 | 소개와 이력 | 이름, 직무, 소개, 강점, 주요 기술, 경력, 학력과 교육 이력(기간, 배운 기술, 한 줄 설명, 스터디), 자격증(진행 상태 포함) |
| 2 | 기술 | 기술마다 할 수 있는 것과 아직 부족한 것 |
| 3 | 프로젝트 목록 | 프로젝트마다 이름, 기간, 기술, 한 줄 설명, 대표 성과 1개, 링크 |
| 4~ | 프로젝트 | 프로젝트마다 1장면. 이름, 기간, 간단한 설명, 소개, 기술, 성과(숫자), 맡은 역할, 링크 |
| 끝에서 둘째 | 이 사이트와 기록 | 구조·보안 요점 3~4개, CI 단계, 최근 시행착오 3개, 전체 기록 링크(GitHub README, 노션) |
| 마지막 | 연락처 | 이메일, GitHub, 블로그, PDF 단축본 |

- 프로젝트 장면은 요약만 둔다. 구성도, 문제와 해결 같은 자세한 설명은 노션 페이지(`notionUrl`)로 넘긴다. 내용 파일에 해당 필드를 두지 않는다.
- 프로젝트 링크는 `githubUrl`, `demoUrl`, `notionUrl` 이다. 모두 선택이다. 값이 없는 링크는 화면에 보이지 않는다. 이름표는 "GitHub", "데모", "노션에서 자세히"다.
- "이 사이트와 기록"의 최근 시행착오는 `journal.ts` 에서 날짜가 늦은 3개를 보인다. 전체 기록은 `docs/journal.md` 와 GitHub README, 노션에 둔다.
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
| `skills.ts` | 기술. 점수 대신 기술을 어느 프로젝트에서 썼는지(`can`)를 문장으로 쓴다. 아직 부족한 것(`lacks`)은 선택이다 |
| `projects.ts` | 프로젝트. 배열에 항목 1개를 더하면 상세본에 나타난다. 선택 필드 `githubUrl`, `demoUrl`, `notionUrl`. 단축본은 앞의 4개만 보인다 |
| `site.ts` | 연락처(블로그 `blog`는 선택)와 "이 사이트와 기록" 장면의 구조·보안 요점, CI 단계, 전체 기록 링크 |
| `journal.ts` | 시행착오 기록. 최근 3개가 "이 사이트와 기록" 장면에 보인다. `docs/journal.md` 와 같은 항목을 둔다 |

규칙:

1. 프로젝트마다 역할(`role`)과 성과(`results`, 숫자 포함)를 쓴다. 링크(`githubUrl`, `demoUrl`, `notionUrl`)는 있으면 `https://` 로 시작한다.
2. 전화번호, 주소, 생년월일을 쓰지 않는다. 지역도 쓰지 않는다.
3. 이메일은 `{ user, domain }` 으로 나눠 적는다. HTML 원문에 그대로 두지 않기 위해서다.
4. 기술 아이콘은 `src/ui/techIcons.ts` 에 `simple-icons` 이름을 추가하고, 내용 파일의 `icon` 키로 쓴다. 키가 없으면 글자만 보인다.
5. 겪지 않은 시행착오를 쓰지 않는다. 기록이 없으면 `journal.ts` 를 빈 배열로 둔다.
6. `npm test` 가 내용 형식을 검사한다. 빠진 항목이 있으면 시험이 실패한다.

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
| `src/domain/` | 내용의 타입 정의와 장면 목록. React를 모른다 | 없음 |
| `src/content/` | 실제 내용 데이터 | domain |
| `src/features/` | 장면별 화면 부품(상세본, 단축본, 없는 주소) | domain, ui |
| `src/ui/` | 공용 부품, 장면 전환 훅 | 없음 |
| `src/app/` | 라우터와 페이지 조립. 내용을 화면 부품에 넘긴다 | 모두 |

장면 전환: 폭 1024px 이상, 높이 720px 이상에서 CSS scroll-snap으로 한 칸씩 넘어간다(그보다 낮은 화면은 보통 스크롤). 장면 내용은 처음 보일 때 투명도만 한 번 바뀐다. `prefers-reduced-motion: reduce` 이면 전환 클래스(`scene-motion`)를 붙이지 않는다.

## 보안 요약

1. 개인 정보를 싣지 않는다. 이메일은 화면에서 조립한다(수집 프로그램을 줄일 뿐 완전한 차단은 아니다).
2. `vercel.json` 이 CSP(`default-src 'self'` 기반, `frame-ancestors 'none'`), HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` 를 보낸다.
3. 글꼴은 npm `pretendard` 패키지로 자체 제공한다. 외부 CDN, 분석 도구, 추적 스크립트가 없다.
4. 빌드 결과에 인라인 script와 `style=` 속성이 없다. 소스 맵을 만들지 않는다. 작은 자산도 data: 로 넣지 않는다(`assetsInlineLimit: 0`).
5. lockfile로 의존성을 고정한다. CI가 `npm audit --audit-level=high` 를 돌린다. Dependabot이 주 1회 갱신을 제안한다.
6. 비밀 값이 없는 구조다.

## 알려진 한계

- 브라우저마다 인쇄 결과가 조금 다르다. Chrome 기준으로 맞췄다.
- `npm audit` 은 개발 도구(ESLint 계열)의 minimatch 중간(moderate) 등급 경고를 보인다. 배포본에 들어가지 않고, 기준(high)보다 낮아 CI는 통과한다.
- `/print` 의 `noindex` 는 `X-Robots-Tag` 헤더(Vercel)와 `<meta name="robots">`(화면에서 추가) 두 가지로 건다.
