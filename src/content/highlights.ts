import type { Highlight } from '../domain/portfolio'

// 성과 숫자 6칸. 값은 projects.ts 의 results 와 profile.ts 에 적힌 사실만 쓴다.
// source 는 출처 프로젝트 id 이다. 프로필에서 온 값은 'profile' 로 쓴다.
// 프로젝트가 출처인 값의 숫자는 그 프로젝트 results 에도 있어야 한다(시험이 검사한다).

export const highlights: Highlight[] = [
  {
    id: 'gpu-memory',
    value: '13,602→4,148',
    unit: 'MiB',
    caption: 'GPU 메모리(대기 기준). 영상 모델 3종을 백본 1벌과 LoRA 교체로 합친 결과입니다.',
    source: 'empatho',
    accent: true,
  },
  {
    id: 'lora-swap',
    value: '0.06~0.28',
    unit: '초',
    caption: 'LoRA 어댑터 교체 시간입니다. 교체 전후 결과가 비트 단위로 같습니다.',
    source: 'empatho',
  },
  {
    id: 'report-stable',
    value: '50',
    unit: '회',
    caption: '같은 입력으로 소견문을 50회 생성해 모두 같았습니다. 판독 수치 150개 보존.',
    source: 'empatho',
  },
  {
    id: 'large-upload',
    value: '54',
    unit: '장',
    caption: '이미지 151장 중 54장이 Cloud Run 요청 한도 32MB를 넘습니다. 서명 URL 직접 업로드로 바꿔 올릴 수 있게 했습니다.',
    source: 'pathology-cdss',
  },
  {
    id: 'commits',
    value: '38/85',
    unit: '개',
    caption: '6일 동안 팀 커밋 85개 중 내가 쓴 커밋입니다(병합 커밋 제외).',
    source: 'recare-dm',
  },
  {
    id: 'award',
    value: '우수상',
    caption: '건양대병원 연계 바이오메디컬 AI 개발 과정 최종 프로젝트 팀 우수상.',
    source: 'profile',
    award: true,
  },
]
