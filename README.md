# 포트폴리오 사이트

노션 포트폴리오를 대신하는 정적 사이트다. 백엔드는 없다. 현재 내용은 가상의 인물 "홍길동"의 **예시 내용**이다.

| 주소 | 이름 | 내용 |
|---|---|---|
| `/` | 상세본 | 장면 10개(예시 내용 기준)로 나눈 기본 포트폴리오 |
| `/print` | 단축본 | A4 2쪽 이내로 정리한 쪽. 브라우저 인쇄로 PDF를 만든다. `noindex` |
| 그 밖의 주소 | 없음 | "페이지가 없습니다" 화면과 상세본 링크 |

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
| `profile.ts` | 이름, 직무, 소개, 강점, 경력, 학력, 교육 이력, 자격증 |
| `skills.ts` | 기술. 점수 대신 "할 수 있는 것"과 "아직 부족한 것"을 문장으로 쓴다 |
| `projects.ts` | 프로젝트. 배열에 항목 1개를 더하면 상세본에 나타난다. 단축본은 앞의 3개만 보인다 |
| `site.ts` | 연락처와 "이 사이트를 만든 방식" 장면 |
| `journal.ts` | "시행착오" 장면. `docs/journal.md` 와 같은 항목을 둔다 |

규칙:

1. 프로젝트마다 역할(`role`)과 결과(`results`, 숫자 포함)를 쓴다. 링크는 `https://` 로 시작한다.
2. 전화번호, 주소, 생년월일을 쓰지 않는다. 지역은 시 단위까지만 쓴다.
3. 이메일은 `{ user, domain }` 으로 나눠 적는다. HTML 원문에 그대로 두지 않기 위해서다.
4. 실제 내용으로 바꾼 뒤에는 `src/ui/ExampleBadge.tsx` 사용처(상세본 소개, 단축본)를 지우고 `index.html` 의 제목과 설명을 고친다.
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
