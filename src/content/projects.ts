import type { Project } from '../domain/portfolio'

// 실제 프로젝트 4개다. 프로젝트를 더하려면 배열에 항목 1개를 추가한다.
// 구성도, 문제와 해결, 배포 같은 자세한 설명은 사이트에 싣지 않고 노션 페이지(notionUrl)로 넘긴다.
// githubUrl, demoUrl, notionUrl 은 선택이다. 없는 링크는 화면에 보이지 않는다. 주소는 https:// 로 시작한다.
// 노션 페이지는 yun-sooyong.notion.site 에 게시했다. 단축본(/print)은 프로젝트 앞의 4개만 보인다.
// 숫자는 각 저장소 README 에 적힌 값만 쓴다.

export const projects: Project[] = [
  {
    id: 'empatho',
    name: 'EMPATHO (유방암 검진 경로 CDSS)',
    kind: '팀',
    period: '2026.08 – 2026.10, 5인',
    coreStack: ['FastAPI', 'Docker'],
    coreStackIcons: { FastAPI: 'fastapi', Docker: 'docker' },
    summary: '유방 영상과 병리 슬라이드의 AI 판독을 돕는 병원용 웹 서비스.',
    overview:
      '맘모그래피, 초음파, MRI, 병리 영상을 판독하고 소견문 초안을 만든다. AI 결과는 제안이고 최종 판정은 의사가 한다.',
    role: '팀장으로 통합 추론 서버, 판독 파이프라인, 인프라, 자동 배포를 맡았다. 병리 sTIL 추론과 소견문 서버, 환자 앱도 만들었다.',
    results: [
      { value: '13,602 → 4,148MiB', label: '영상 종류별 모델을 백본 1벌 + LoRA 교체로 합친 뒤 GPU 메모리 (약 70% 감소)' },
      { value: '0.06~0.28초', label: 'LoRA 어댑터 교체 시간. 교체 전후 결과가 비트 단위로 같다' },
      { value: '50회 중 50회', label: '같은 입력으로 소견문을 생성했을 때 같은 결과 (판독 수치 150개 보존)' },
    ],
    githubUrl: 'https://github.com/Yun-sooyong/empatho',
    notionUrl: 'https://yun-sooyong.notion.site/40f258595efe81c3ba39f8391b97bc77',
  },
  {
    id: 'pathology-cdss',
    name: '병리영상 분석 CDSS',
    kind: '팀',
    period: '2026.07, 5인',
    coreStack: ['Django', 'Google Cloud'],
    coreStackIcons: { Django: 'django', 'Google Cloud': 'googlecloud' },
    summary: '병리 이미지의 sTIL 비율을 계산하고 불확실하면 판정을 유보한다.',
    overview:
      '이미지를 서명 URL로 GCS에 바로 올리고, Cloud Tasks가 워커와 GPU 추론을 잇는다.',
    role: 'Django REST API와 GCP 인프라를 맡았다. API는 Cloud Run 서울 리전에 배포했다.',
    results: [
      { value: '54장', label: '32MB를 넘는 이미지도 업로드 (실측 151장, 최대 141.1MB)' },
      { value: '7개', label: '프런트, 워커, DB 사이 계약을 묶은 DRF API 경로' },
      { value: '5단계', label: '이미지 1장마다 추적하는 처리 상태' },
    ],
    githubUrl: 'https://github.com/Yun-sooyong/pathology-cdss',
    notionUrl: 'https://yun-sooyong.notion.site/414258595efe815abec9d3e2a104879e',
  },
  {
    id: 'cdss-tablet-app',
    name: '의료영상 분석 플랫폼 태블릿 앱',
    kind: '팀',
    period: '2026.08, 5인',
    coreStack: ['Flutter', 'Firebase'],
    coreStackIcons: { Flutter: 'flutter', Firebase: 'firebase' },
    summary: '의료진이 태블릿에서 병리 이미지 분석을 요청하고 결과를 확인하는 앱.',
    overview:
      '환자 선택, 이미지 업로드, 분석 진행, 결과 확인과 판정 유보 확정을 한 흐름으로 묶었다. 분석이 끝나면 푸시 알림(FCM)으로 알린다.',
    role: '의료진 태블릿 앱 전체와 앱 공유 패키지를 혼자 맡았다. 화면, 상태 관리, API 클라이언트, 업로드, 푸시 알림을 만들었다.',
    results: [
      { value: '9개', label: '화면 (로그인, 배치 목록과 상세, 판독 결과, 새 분석, QR 환자 확인, 알림, 채팅)' },
      { value: '5개', label: '상태 관리(Riverpod) provider (인증, 업로드, 배치 목록, 알림, 환자 검색)' },
      { value: '1번', label: '동시에 401 응답이 와도 토큰 갱신 횟수' },
    ],
    githubUrl: 'https://github.com/Yun-sooyong/cdss-tablet-app',
    notionUrl: 'https://yun-sooyong.notion.site/414258595efe81e8b1ddc784f4a32744',
  },
  {
    id: 'recare-dm',
    name: 'ReCare-DM (당뇨 재입원 관리)',
    kind: '팀',
    period: '2026.06, 5인',
    coreStack: ['Django', 'LightGBM'],
    coreStackIcons: { Django: 'django' },
    summary: '당뇨 환자의 재입원 위험과 퇴원 준비 점수를 보는 대시보드.',
    overview:
      '재입원 확률 옆에 위험 요인과 보호 요인을 SHAP 값으로 함께 보여 준다. 퇴원 뒤 재방문 정보를 넣으면 위험을 다시 계산한다.',
    role: '퇴원 관리 앱(discharge), 환자 모델 수정, 재방문 재예측, 앱 통합을 맡았다. 5일 동안 팀 커밋 116개 중 53개를 썼다.',
    results: [
      { value: '5개 × 20점', label: '퇴원 준비 점수 항목과 배점 (100점 만점)' },
      { value: '53 / 116개', label: '팀 전체 커밋 중 내 커밋' },
      { value: '5개 + 5개', label: '예측마다 보여 주는 SHAP 위험 요인과 보호 요인' },
    ],
    githubUrl: 'https://github.com/Yun-sooyong/recare-dm',
    notionUrl: 'https://yun-sooyong.notion.site/414258595efe814289fdf7614f238287',
  },
]
