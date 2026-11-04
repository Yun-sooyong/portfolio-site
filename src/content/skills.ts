import type { SkillGroup } from '../domain/portfolio'

// 점수와 막대를 쓰지 않는다. 할 수 있는 것과 아직 부족한 것을 문장으로 쓴다.

export const skillGroups: SkillGroup[] = [
  {
    title: '언어와 프레임워크',
    skills: [
      {
        name: 'Kotlin / Spring Boot',
        icon: ['kotlin', 'springboot'],
        can: 'REST API, JPA 연관 관계 매핑, 예외 처리 공통화, 통합 시험을 혼자 작성한다.',
        lacks: '대용량 트래픽에서 쓰는 비동기 처리 경험이 없다.',
      },
      {
        name: 'TypeScript / React',
        icon: ['typescript', 'react'],
        can: '화면 부품을 나누고 Vitest로 시험하며, 정적 사이트를 배포한다.',
        lacks: '상태 관리 라이브러리를 쓰는 큰 앱을 만들어 보지 않았다.',
      },
    ],
  },
  {
    title: '데이터베이스',
    skills: [
      {
        name: 'PostgreSQL',
        icon: 'postgresql',
        can: 'EXPLAIN으로 실행 계획을 읽고 복합 인덱스를 설계한다.',
        lacks: '파티셔닝과 복제 설정은 문서를 읽은 수준이다.',
      },
      {
        name: 'Redis',
        icon: 'redis',
        can: '조회 결과 캐시와 만료 시간을 설계한다.',
        lacks: '클러스터 운영 경험이 없다.',
      },
    ],
  },
  {
    title: '배포와 운영',
    skills: [
      {
        name: 'Docker / GitHub Actions',
        icon: ['docker', 'githubactions'],
        can: '이미지를 빌드하고, push마다 시험과 배포를 자동으로 돌린다.',
        lacks: '쿠버네티스는 쓰지 않았다.',
      },
    ],
  },
  {
    title: '협업 도구',
    skills: [
      {
        name: 'Git / GitHub / Notion',
        icon: ['git', 'github', 'notion'],
        can: '브랜치 규칙을 정하고, 풀 리퀘스트마다 리뷰를 받고 반영한다. 작업을 이슈 단위로 나눈다.',
        lacks: '대규모 모노레포의 병합 충돌 정리 경험이 적다.',
      },
    ],
  },
  {
    title: '문서 작성',
    skills: [
      {
        name: 'API 명세와 설계 문서',
        can: 'OpenAPI 명세와 ERD를 작성하고, 변경이 생기면 같은 날 갱신한다.',
        lacks: '영문 기술 문서 작성 경험이 적다.',
      },
    ],
  },
]
