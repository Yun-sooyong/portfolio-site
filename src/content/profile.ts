import type { Background, Profile } from '../domain/portfolio'

export const profile: Profile = {
  name: '윤수용',
  role: 'AI 서비스 백엔드 개발자 지망',
  intro: [
    '의료 AI 모델의 서빙과 서비스 연동을 맡는 백엔드 개발자를 목표로 합니다.',
    '건양대 융합IT 전공에서 프로그래밍, 데이터베이스, 시스템 구조를 배우고 정보처리기사를 땄습니다. Flutter는 독학했습니다.',
    '탄동농협에서 2년간 재고 관리와 발주를 맡았습니다.',
    '건양대병원 연계 바이오메디컬 AI 개발 과정에서 팀 프로젝트 4건으로 Django 백엔드, AI 모델 서빙과 배포, 의료진용 Flutter 태블릿 앱을 만들었고 최종 프로젝트에서 팀 우수상을 받았습니다.',
  ],
  strengths: [
    {
      title: 'API와 비동기 작업 설계',
      evidence: '이미지마다 분석이 다른 시점에 끝나는 상황을 5단계 처리 상태와 조회 API로 풀었다 (병리영상 CDSS, EMPATHO).',
    },
    {
      title: '모델 서빙과 GPU 자원 관리',
      evidence: '판독 모델 4종을 FastAPI 추론 서버 1개로 합치고 백본 공유와 LoRA 교체로 GPU 메모리를 13,602MiB에서 4,148MiB로 줄였다 (EMPATHO).',
    },
    {
      title: '측정으로 원인을 찾는다',
      evidence: '설정을 바꾸기 전에 151장의 파일 크기를 재서 54장이 32MB를 넘는다는 것을 확인하고, 서명 URL 직접 업로드로 바꿨다 (병리영상 CDSS).',
    },
  ],
}

export const background: Background = {
  careers: [
    {
      org: '탄동농업협동조합',
      role: '주임 (과일 판매)',
      period: '2024.02 – 2026.02',
      summary: '과일 재고 관리와 발주, 입출고와 물류, 고객 응대를 맡았다.',
    },
  ],
  educations: [
    {
      school: '건양대학교',
      major: '융합IT 학사',
      period: '2014.02 – 2021.02',
    },
  ],
  trainings: [
    {
      name: '건양대학교병원 연계 바이오메디컬 AI 개발 과정',
      org: '미래융합교육원',
      period: '2026.03 – 2026.10',
      stack: ['Python', 'Django', 'FastAPI', 'PyTorch', 'Docker', 'Flutter'],
      summary: '의료 AI 팀 프로젝트 4건에서 백엔드 API, 모델 서빙, 배포, 앱 개발을 맡았고 최종 프로젝트 우수상을 받았다.',
    },
  ],
  certificates: [
    { name: '정보처리기사', issuer: '한국산업인력공단', date: '2019.11' },
    { name: '유통관리사 2급', issuer: '대한상공회의소', date: '2024.09' },
  ],
}
