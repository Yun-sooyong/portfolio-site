import type { SkillGroup } from '../domain/portfolio'

// 점수와 막대를 쓰지 않는다. 각 기술을 어느 프로젝트에서 썼는지 문장으로 쓴다.
// 실제로 쓴 기술만 적는다. 아직 부족한 것(lacks)은 쓸 내용이 있을 때만 적는다.
// 기술마다 { name, icon? } 1개가 칩 1개다. 아이콘 키가 없으면 이름만 보인다.
// printName 은 단축본에 보이는 글자다. 없으면 이름을 " / " 로 이어 쓴다.

export const skillGroups: SkillGroup[] = [
  {
    title: '백엔드',
    skills: [
      {
        techs: [{ name: 'Python', icon: 'python' }, { name: 'Django', icon: 'django' }, { name: 'DRF' }, { name: 'PostgreSQL', icon: 'postgresql' }],
        can: '병리영상 CDSS의 REST API와 ReCare-DM의 퇴원 관리 앱을 만들었다.',
      },
      {
        techs: [{ name: 'FastAPI', icon: 'fastapi' }],
        can: 'EMPATHO의 통합 추론 서버를 만들었다.',
      },
    ],
  },
  {
    title: '비동기 작업',
    skills: [
      {
        techs: [{ name: 'Celery', icon: 'celery' }, { name: 'Redis', icon: 'redis' }],
        can: 'EMPATHO에서 오래 걸리는 판독 요청을 작업 큐로 나눠 처리했다.',
      },
      {
        techs: [{ name: 'Cloud Tasks', icon: 'googlecloud' }, { name: 'Cloud Run Job', icon: 'googlecloud' }],
        can: '병리영상 CDSS에서 API, 워커, GPU 추론을 이었다.',
      },
    ],
  },
  {
    title: 'AI 모델 서빙',
    skills: [
      {
        techs: [{ name: 'PyTorch', icon: 'pytorch' }, { name: 'ONNX Runtime', icon: 'onnx' }, { name: 'Ollama', icon: 'ollama' }],
        can: 'EMPATHO에서 판독 모델을 서빙하고 소견문 서버를 만들었다.',
      },
      {
        techs: [{ name: 'LightGBM' }, { name: 'SHAP' }],
        can: 'ReCare-DM에서 재입원 확률과 위험 요인, 보호 요인을 보여 줬다.',
      },
    ],
  },
  {
    title: '클라우드와 배포',
    skills: [
      {
        techs: [
          { name: 'Google Cloud', icon: 'googlecloud' },
          { name: 'Cloud Run' },
          { name: 'Cloud SQL' },
          { name: 'Cloud Storage', icon: 'googlecloudstorage' },
        ],
        printName: 'Google Cloud (Cloud Run, Cloud SQL, Cloud Storage)',
        can: '병리영상 CDSS의 API를 Cloud Run 서울 리전에 배포하고 이미지를 서명 URL로 Cloud Storage에 올렸다.',
      },
      {
        techs: [{ name: 'Docker', icon: 'docker' }, { name: 'nginx', icon: 'nginx' }, { name: 'gunicorn', icon: 'gunicorn' }, { name: 'GitHub Actions', icon: 'githubactions' }],
        can: 'EMPATHO의 인프라와 자동 배포를 맡았다.',
      },
    ],
  },
  {
    title: '앱',
    skills: [
      {
        techs: [
          { name: 'Flutter', icon: 'flutter' },
          { name: 'Dart', icon: 'dart' },
          { name: 'Riverpod' },
          { name: 'Firebase', icon: 'firebase' },
          { name: 'Auth' },
          { name: 'FCM' },
        ],
        printName: 'Flutter / Dart / Riverpod / Firebase (Auth, FCM)',
        can: '태블릿 앱의 화면 9개, 상태 관리, 업로드, 푸시 알림을 혼자 만들었다.',
      },
    ],
  },
  {
    title: '협업',
    skills: [
      {
        techs: [{ name: 'Git', icon: 'git' }, { name: 'GitHub', icon: 'github' }, { name: 'Notion', icon: 'notion' }],
        can: '5인 팀 프로젝트 4건에서 저장소와 문서를 나눠 썼다.',
      },
    ],
  },
]
