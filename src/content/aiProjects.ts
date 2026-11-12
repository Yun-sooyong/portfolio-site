import type { AiProject } from '../domain/portfolio'

// Claude Code로 바이브 코딩한 개인 프로젝트다. 상세본의 "AI로 만든 프로젝트" 구역에만 보이고 단축본(/print)에는 넣지 않는다.
// 팀 프로젝트는 projects.ts 에 둔다. 숫자는 각 저장소 README 에 적힌 값만 쓴다.

export const aiProjects: AiProject[] = [
  {
    id: 'mangcut-bangji',
    name: '망컷방지 (구도 가이드 카메라 앱)',
    kind: '개인',
    period: '2026.10, 1인',
    coreStack: ['Flutter', 'Dart'],
    coreStackIcons: { Flutter: 'flutter', Dart: 'dart' },
    summary: '촬영 장면에 맞는 구도 가이드를 화면에 띄우고, 찍은 뒤 빈티지 필터를 고르는 iOS 카메라 앱.',
    overview: '장면(인물, 풍경 등)을 고르면 가이드 선이 카메라 화면 위에 나온다. 촬영 후 필터를 고르면 원본과 필터 적용본을 사진 보관함에 함께 저장한다.',
    aiAreas: ['아이디어 정리', '자료 조사', '설계 문서', '코딩', '테스트', '세션 인계'],
    tools: [
      { name: 'Claude Code (메인 모델)', use: '계획 문서 작성과 구현, 최종 판단에 필요한 내용 정리' },
      { name: 'Sonnet 하위 에이전트', use: '자료 조사, 파일 읽기, 검증' },
      { name: 'Haiku 하위 에이전트', use: '이름 바꾸기, 형식 정리 같은 단순 반복' },
    ],
    impact: [
      { value: '2일', label: '요구 사항 문서에서 iPhone 15 Pro 실기기 확인까지 (2026.10.14~10.15)' },
      { value: '14종 · 12개', label: '장면 5개에 맞춘 구도 가이드와 필터(기본 5개, 빈티지 7개)' },
      { value: '31개', label: '자동 테스트. 실기기 확인 항목 8개 중 7개 통과' },
    ],
    design: [
      '구도 가이드를 0.0~1.0 비율 좌표로 정의하게 했다. 4:3과 16:9에서 같은 데이터로 그린다.',
      '가이드와 필터 데이터는 lib/data 한 곳에, 그리기는 lib/painting에 나눴다. 가이드를 더할 때 데이터만 고친다.',
      '화면 표시와 저장이 같은 필터 그리기 코드를 쓰게 했다. 미리보기와 저장 결과가 달라지지 않는다.',
    ],
    cases: [
      { situation: 'AI가 질문에 대한 내 답을 승인으로 받아들이고 코드를 쓰기 시작했다.', choice: '작업을 멈추고, "승인"이라는 말이 있을 때만 코드를 쓰도록 인계 문서에 규칙을 넣었다.' },
      { situation: '조리개 조절을 넣으려 했지만 iPhone 카메라의 조리개는 고정이다.', choice: '조리개 대신 밝기(노출) 조절을 넣었다.' },
      { situation: '1× 렌즈로 가까이 찍으면 초점이 맞지 않았다. 렌즈의 최소 초점 거리 문제로 보였다.', choice: '코드로 고치지 않고, 가까운 촬영은 0.5×를 쓰기로 했다.' },
    ],
    quality: [
      '계획 문서를 4번 고친 뒤 승인했다. 승인 전에는 코드를 쓰지 않는다.',
      'Android 에뮬레이터로 단계 1~5를 확인한 뒤, iPhone 실기기에서 8개 항목을 확인했다.',
      'flutter analyze 문제 0건, 테스트 31개 통과 상태로 다음 세션에 인계했다.',
    ],
    githubUrl: 'https://github.com/Yun-sooyong/mangcut-bangji',
    notionUrl: 'https://yun-sooyong.notion.site/416258595efe8109aa54ec25ade06be1',
    workflowUrl: 'https://github.com/Yun-sooyong/portfolio-site/blob/main/docs/ai-workflow/mangcut-bangji.md',
  },
  {
    id: 'personal-orchestrator',
    name: '개인 작업 관리자 (취업 준비 도우미)',
    kind: '개인',
    period: '2026.10, 1인',
    coreStack: ['FastAPI', 'LangGraph', 'SQLite'],
    coreStackIcons: { FastAPI: 'fastapi', SQLite: 'sqlite' },
    summary: '공고 분석, 회사별 이력서 수정본, 자기소개서 답변을 작업으로 맡기고 추적하는 개인용 관리자.',
    overview: '공고 URL을 넣으면 공고를 분석하고, 이력서 수정본(DOCX)과 자기소개서 답변 초안을 만든다. 채용 심사단 단계가 결과를 다시 검토한다. 맥북에서 웹 서버 1개와 worker 1개로 돈다.',
    aiAreas: ['요구 사항 정리', '명세 작성', '설계 검토', '코딩', '테스트', '코드 탐색', '문서화'],
    tools: [
      { name: 'Claude Opus', use: '단계 계획, 설계 결정 정리, 결과 검증과 문서' },
      { name: 'Claude Sonnet', use: '코드 작성과 수정' },
      { name: 'Claude Haiku', use: '파일 탐색과 내용 추출' },
      { name: 'Codex CLI', use: '앱 안에서 공고 분석 스킬 실행 (사용자가 누를 때만)' },
    ],
    impact: [
      { value: '16일', label: '명세 기준선부터 M5(백업, 원격 접속, 알림)까지 (2026.10.16~10.31), 커밋 22개' },
      { value: '1,078개', label: 'pytest 시험 함수' },
      { value: '14건', label: '문서로 남긴 설계 결정 (문제, 선택, 근거, 대안, 검증 방법, 되돌리는 방법)' },
    ],
    design: [
      '명세 문서 11개를 먼저 쓰고, 문서끼리 어긋난 곳을 AI가 찾게 했다. 어긋난 곳마다 설계 결정 문서로 정했다.',
      '웹 서버 1개와 worker 1개로 나누고 AI 동시 실행을 1개로 제한했다. API 요청은 오래 걸리는 작업을 돌리지 않고 작업 ID만 돌려준다.',
      '외부 실행은 실행 원장과 멱등 키로 기록한다. 결과가 불확실하면 다시 실행하지 않고 확인부터 한다.',
    ],
    cases: [
      { situation: '명세 문서마다 인증 오류의 대기 상태가 달랐다.', choice: '한도 문제는 기다리면 풀리고 인증 문제는 내가 조치해야 한다. 두 상태를 나눠 화면에서 구분하게 했다.' },
      { situation: '공고 URL을 PDF로 만드는 기능이 한 채용 사이트에서 빈 페이지만 만들었다. 4번 실측해도 같았다.', choice: '봇 차단을 우회하지 않기로 했다. 빈 PDF는 실패로 처리하고 수동 업로드를 안내한다.' },
      { situation: '공고 분석에 쓰는 Codex 무료 경로는 용량 부족으로 거절될 수 있었다.', choice: '실패해도 Claude로 자동 전환하지 않는다. 예상하지 않은 사용량이 생기지 않게 대기 상태로 두고 내가 고른다.' },
    ],
    quality: [
      '가짜 어댑터로 실패, 중지, 중복, 재시작, 승인 상황을 먼저 시험하고, 실제 AI 호출은 최소로 했다.',
      '하위 에이전트는 커밋과 push를 하지 못한다. 결과를 확인하고 내가 승인한 뒤에만 커밋한다.',
      '작업 환경에서 API 키를 막고 구독 로그인 CLI만 쓴다. 이력서 원본은 Git에 넣지 않는다.',
    ],
    notionUrl: 'https://yun-sooyong.notion.site/416258595efe81ab96c2efa1ca242997',
    workflowUrl: 'https://github.com/Yun-sooyong/portfolio-site/blob/main/docs/ai-workflow/personal-orchestrator.md',
  },
  {
    id: 'portfolio-site',
    name: '포트폴리오 사이트 (이 사이트)',
    kind: '개인',
    period: '2026.11, 1인',
    coreStack: ['React', 'TypeScript'],
    coreStackIcons: { React: 'react', TypeScript: 'typescript' },
    summary: '지금 보는 사이트. 내용 파일만 고치면 상세본과 A4 2쪽 단축본이 같이 바뀐다.',
    overview: 'Vite, React, Tailwind로 만든 정적 사이트다. Vercel에 배포하고, push마다 CI가 lint, 타입 검사, 테스트, 빌드, 의존성 점검을 돈다.',
    aiAreas: ['디자인 방향 정리', '설계 문서', '코딩', '테스트', '화면 검증', '문서화'],
    tools: [
      { name: 'Claude Opus', use: '계획, 화면 캡처 검토, 문서와 커밋' },
      { name: 'Claude Sonnet', use: '코드 작성과 테스트 수정' },
      { name: 'Claude Haiku', use: '파일 탐색' },
    ],
    impact: [
      { value: '1일', label: '참고 사이트 2개를 섞은 전체 화면 개편부터 배포까지 (2026.11.11)' },
      { value: '82개', label: 'Vitest 시험. 빌드 결과에 전화번호와 주소가 없는지도 검사한다' },
      { value: '3가지 폭', label: '1440, 900, 390px 화면을 헤드리스 Chrome으로 캡처해 확인' },
    ],
    design: [
      '내용과 화면을 나눴다. 새 프로젝트는 내용 파일에 항목 1개만 더하고, 상세본과 A4 2쪽 단축본이 같은 파일을 읽는다.',
      '외부 요청이 없는 구조로 했다. 글꼴과 아이콘을 사이트 안에 넣고, CSP 등 응답 헤더로 외부 스크립트를 막았다.',
      '개인 정보를 싣지 않는다. 이메일은 화면에서 조립하고, 전화번호와 주소는 쓰지 않는다.',
    ],
    cases: [
      { situation: '한 칸씩 넘기는 장면 구조는 화면이 낮으면 내용이 넘쳤고, 펼치는 목록을 넣을 수 없었다.', choice: 'AI가 제시한 두 방식 중 보통 스크롤을 골랐다.' },
      { situation: '팀 프로젝트 저장소를 공개 사본으로 만들 때, 기록에 개발용 키와 팀원 메일이 있었다.', choice: '원본 저장소는 건드리지 않고, 사본의 기록에서만 지운 뒤 공개했다.' },
      { situation: '마음에 드는 포트폴리오 사이트 2개의 분위기가 서로 달랐다.', choice: '차분한 사이트를 기반으로 하고, 다른 사이트에서는 큰 구역 번호와 펼치는 목록만 가져오기로 했다.' },
    ],
    quality: [
      'push마다 CI가 npm ci, lint, 타입 검사, 테스트, 빌드, npm audit(high 이상)을 차례로 돈다.',
      '시험이 내용 형식을 검사한다. 역할, 성과 숫자와 출처, https 링크가 빠지면 CI가 막는다.',
      '하위 에이전트가 쓴 코드는 캡처와 검사 결과로 다시 확인하고, 내가 승인한 뒤에 커밋했다.',
      '겪은 문제는 docs/journal.md에 날짜, 문제, 원인, 해결로 남긴다.',
    ],
    githubUrl: 'https://github.com/Yun-sooyong/portfolio-site',
    notionUrl: 'https://yun-sooyong.notion.site/416258595efe8157959ac4916b9abd37',
    workflowUrl: 'https://github.com/Yun-sooyong/portfolio-site/blob/main/docs/ai-workflow/portfolio-site.md',
  },
]
