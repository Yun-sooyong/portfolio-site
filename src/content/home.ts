import type { HomeCopy } from '../domain/portfolio'

// 첫 화면 문구. 큰 제목은 profile 의 목표 문장을 줄인 것이다.
// 띠의 줄은 profile.strengths 와 projects.ts 에 적힌 사실을 줄인 것이고, source 는 출처 프로젝트 id 이다.

export const home: HomeCopy = {
  headline: ['의료 AI 모델을', '서비스로 잇는', '백엔드를 만듭니다.'],
  band: [
    { label: '모델 서빙', line: '판독 모델 4종을 FastAPI 추론 서버 1개로 서빙', source: 'empatho' },
    { label: '비동기 작업', line: '이미지마다 5단계 처리 상태와 조회 API', source: 'pathology-cdss' },
    { label: '배포 자동화', line: 'Docker와 GitHub Actions로 인프라와 자동 배포', source: 'empatho' },
  ],
}
