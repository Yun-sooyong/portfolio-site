import type { Background, Profile } from '../domain/portfolio'

// 예시 내용이다. 실제 이름과 경력으로 바꿔 쓴다.

export const profile: Profile = {
  name: '홍길동',
  role: '백엔드 개발자 지망',
  region: '서울',
  intro: [
    '서버와 데이터베이스를 직접 설계하고 배포까지 해 본 신입 백엔드 개발자입니다.',
    '개인 프로젝트 1개와 4인 팀 프로젝트 1개를 끝까지 운영해 봤습니다.',
    '느린 쿼리를 찾아 인덱스를 바꾸고, 바꾼 결과를 숫자로 확인하는 일을 좋아합니다.',
    '모르는 부분은 공식 문서를 먼저 읽고, 그래도 막히면 재현 코드를 만들어 질문합니다.',
  ],
  strengths: [
    {
      title: '느린 곳을 숫자로 찾는다',
      evidence: '가계부 API의 목록 조회 응답을 p95 기준 120ms에서 45ms로 줄였다.',
    },
    {
      title: '문서를 남긴다',
      evidence: '팀 프로젝트에서 API 명세 32개를 작성했고 팀원 질문이 주 5건에서 1건으로 줄었다.',
    },
    {
      title: '배포까지 책임진다',
      evidence: '두 프로젝트 모두 CI에서 시험을 통과해야 배포되도록 직접 구성했다.',
    },
  ],
}

export const background: Background = {
  careers: [
    {
      org: '예시소프트 (가상)',
      role: '인턴 백엔드 개발',
      period: '2025.07 – 2025.12',
      summary: '사내 재고 조회 API의 시험 코드 41개를 추가하고 배포 스크립트를 정리했다.',
    },
  ],
  educations: [
    {
      school: '예시대학교 (가상)',
      major: '컴퓨터공학 학사',
      period: '2020.03 – 2026.02',
    },
  ],
  trainings: [
    {
      name: '백엔드 부트캠프 (가상)',
      org: '예시교육원',
      period: '2025.01 – 2025.06, 960시간',
    },
  ],
  certificates: [
    { name: '정보처리기사', issuer: '한국산업인력공단', date: '2025.11' },
    { name: 'SQLD', issuer: '한국데이터산업진흥원', date: '2025.05' },
  ],
}
