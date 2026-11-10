import type { SkillGroup } from '../domain/portfolio'

// 점수와 막대를 쓰지 않는다. 각 기술을 어느 프로젝트에서 썼는지 문장으로 쓴다.
// 실제로 쓴 기술만 적는다. 아직 부족한 것(lacks)은 쓸 내용이 있을 때만 적는다.

export const skillGroups: SkillGroup[] = [
  {
    title: '백엔드',
    skills: [
      {
        name: 'Python / Django / DRF / PostgreSQL',
        icon: ['python', 'django', 'postgresql'],
        can: '병리영상 CDSS의 REST API와 ReCare-DM의 퇴원 관리 앱을 만들었다.',
      },
      {
        name: 'FastAPI',
        icon: 'fastapi',
        can: 'EMPATHO의 통합 추론 서버를 만들었다.',
      },
    ],
  },
  {
    title: '비동기 작업',
    skills: [
      {
        name: 'Celery / Redis',
        icon: ['celery', 'redis'],
        can: 'EMPATHO에서 오래 걸리는 판독 요청을 작업 큐로 나눠 처리했다.',
      },
      {
        name: 'Cloud Tasks / Cloud Run Job',
        icon: 'googlecloud',
        can: '병리영상 CDSS에서 API, 워커, GPU 추론을 이었다.',
      },
    ],
  },
  {
    title: 'AI 모델 서빙',
    skills: [
      {
        name: 'PyTorch / ONNX Runtime / Ollama',
        icon: ['pytorch', 'onnx', 'ollama'],
        can: 'EMPATHO에서 판독 모델을 서빙하고 소견문 서버를 만들었다.',
      },
      {
        name: 'LightGBM / SHAP',
        can: 'ReCare-DM에서 재입원 확률과 위험 요인, 보호 요인을 보여 줬다.',
      },
    ],
  },
  {
    title: '클라우드와 배포',
    skills: [
      {
        name: 'Google Cloud (Cloud Run, Cloud SQL, Cloud Storage)',
        icon: ['googlecloud', 'googlecloudstorage'],
        can: '병리영상 CDSS의 API를 Cloud Run 서울 리전에 배포하고 이미지를 서명 URL로 Cloud Storage에 올렸다.',
      },
      {
        name: 'Docker / nginx / gunicorn / GitHub Actions',
        icon: ['docker', 'nginx', 'gunicorn', 'githubactions'],
        can: 'EMPATHO의 인프라와 자동 배포를 맡았다.',
      },
    ],
  },
  {
    title: '앱',
    skills: [
      {
        name: 'Flutter / Dart / Riverpod / Firebase (Auth, FCM)',
        icon: ['flutter', 'dart', 'firebase'],
        can: '태블릿 앱의 화면 9개, 상태 관리, 업로드, 푸시 알림을 혼자 만들었다.',
      },
    ],
  },
  {
    title: '협업',
    skills: [
      {
        name: 'Git / GitHub / Notion',
        icon: ['git', 'github', 'notion'],
        can: '5인 팀 프로젝트 4건에서 저장소와 문서를 나눠 썼다.',
      },
    ],
  },
]
