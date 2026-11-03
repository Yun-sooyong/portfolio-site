import type { Project } from '../domain/portfolio'

// 예시 내용이다. 프로젝트를 더하려면 배열에 항목 1개를 추가한다.
// 단축본(/print)은 앞의 3개만 보인다.

export const projects: Project[] = [
  {
    id: 'moasseugi',
    name: '모아쓰기 (가계부 API)',
    kind: '개인',
    period: '2025.08 – 2025.10',
    coreStack: ['Kotlin', 'PostgreSQL'],
    summary: '지출 내역을 기록하고 월별로 모아 보여 주는 개인용 가계부 API 서버.',
    overview:
      '엑셀로 쓰던 가계부를 API 서버로 옮겼다. 지출 등록, 분류별 월 합계, 예산 초과 알림 조회를 제공한다.',
    role: '기획, 설계, 구현, 배포를 혼자 맡았다. ERD 설계부터 CI 구성까지 직접 했다.',
    features: [
      '지출 등록, 수정, 삭제와 분류 관리',
      '월별·분류별 합계 조회',
      '분류별 예산을 넘으면 조회 응답에 경고 표시',
    ],
    architecture: [
      { label: '클라이언트', note: 'HTTP 요청' },
      { label: 'Spring Boot API', note: '인증, 검증, 집계' },
      { label: 'PostgreSQL', note: '지출·분류·예산' },
    ],
    problems: [
      {
        problem: '지출이 5만 건일 때 월별 목록 조회가 p95 120ms로 느렸다.',
        solution: '날짜와 분류를 묶은 복합 인덱스를 추가하고 N+1 조회를 한 번의 조인으로 바꿨다.',
      },
      {
        problem: '시간대 때문에 월말 지출이 다음 달 합계에 들어갔다.',
        solution: '저장은 UTC, 집계는 사용자 시간대로 바꾸고 경계 날짜 시험 6개를 추가했다.',
      },
    ],
    deploy: 'Docker 이미지를 GitHub Actions에서 빌드하고, 시험이 통과하면 개인 서버에 배포한다.',
    results: [
      { value: '45ms', label: '월별 목록 조회 p95 (이전 120ms)' },
      { value: '82%', label: '시험 코드 줄 커버리지' },
      { value: '27개', label: 'API 엔드포인트' },
    ],
    links: [{ label: '저장소 (예시)', url: 'https://github.com/example/moasseugi' }],
  },
  {
    id: 'bookshop-stock',
    name: '동네책방 재고 관리',
    kind: '팀',
    period: '2025.03 – 2025.05, 4인',
    coreStack: ['Spring Boot', 'MySQL'],
    summary: '동네 책방 3곳의 입고, 판매, 재고를 한 곳에서 보는 웹 서비스.',
    overview:
      '책방마다 따로 적던 재고 장부를 하나의 서비스로 합쳤다. 입고와 판매를 기록하면 재고가 자동으로 맞춰진다.',
    role: '백엔드 담당 2명 중 1명. 재고 도메인과 주문 API, DB 설계, API 명세 32개를 맡았다.',
    features: [
      '입고·판매 기록과 실시간 재고 계산',
      '재고 부족 도서 목록',
      '책방별 권한 구분',
    ],
    architecture: [
      { label: 'React 화면', note: '팀원 담당' },
      { label: 'Spring Boot API', note: '재고·주문' },
      { label: 'MySQL', note: '도서·재고·기록' },
    ],
    problems: [
      {
        problem: '두 책방이 같은 도서를 동시에 판매하면 재고가 음수가 됐다.',
        solution: '재고 행에 낙관적 락을 걸고, 충돌 시 한 번 재시도하도록 바꿨다. 동시 요청 시험으로 확인했다.',
      },
    ],
    deploy: '팀 공용 클라우드 VM에 Docker Compose로 배포했다. 배포 순서는 README에 적었다.',
    results: [
      { value: '32개', label: '작성한 API 명세' },
      { value: '주 5건 → 1건', label: '팀원의 API 사용법 질문' },
      { value: '0건', label: '동시성 시험 100회 중 음수 재고' },
    ],
    links: [{ label: '저장소 (예시)', url: 'https://github.com/example/bookshop-stock' }],
  },
  {
    id: 'this-portfolio',
    name: '이 포트폴리오 사이트',
    kind: '개인',
    period: '2026.11, 1일',
    coreStack: ['React', 'TypeScript'],
    summary: '내용과 화면을 나누고 보안 헤더와 CI를 갖춘 정적 포트폴리오.',
    overview:
      '노션 포트폴리오를 대신하는 정적 사이트다. 상세본과 A4 단축본이 같은 내용 파일을 읽는다.',
    role: '설계, 구현, 시험, 배포 설정을 혼자 맡았다. 설계 문서를 먼저 쓰고 그대로 구현했다.',
    features: [
      '장면 8개로 나눈 상세본과 A4 2쪽 단축본',
      '배경 색조가 바뀌는 장면 전환과 reduced-motion 대응',
      '내용 형식을 검사하는 시험',
    ],
    architecture: [
      { label: 'src/content', note: '내용 데이터' },
      { label: 'features, ui', note: '장면 화면 부품' },
      { label: 'Vercel', note: '정적 배포와 보안 헤더' },
    ],
    problems: [
      {
        problem: '이메일을 화면에서 조립하는 컴포넌트가 lint 규칙(effect 안 setState)에 걸렸다.',
        solution: 'useSyncExternalStore로 바꿨다. 서버 렌더링 값은 null이라 HTML 원문에 주소가 남지 않는다. 시험으로 확인했다.',
      },
    ],
    deploy: 'GitHub에 push하면 Vercel이 배포한다. CI는 lint, 타입 검사, 시험, 빌드, 취약점 검사를 돈다.',
    results: [
      { value: '0개', label: '외부 도메인 요청 (글꼴·스크립트 모두 자체 제공)' },
      { value: '6단계', label: 'push마다 CI가 돌리는 검사 (설치, lint, 타입 검사, 시험, 빌드, 취약점 검사)' },
      { value: '1곳', label: '내용을 고치는 폴더 (src/content). 상세본과 단축본이 함께 읽는다' },
    ],
    links: [{ label: '저장소 (예시)', url: 'https://github.com/example/portfolio' }],
  },
]
