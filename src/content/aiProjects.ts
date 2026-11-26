import type { AiProject } from '../domain/portfolio'

// Claude Code로 만든 개인 프로젝트다. 상세본의 "AI로 만든 프로젝트" 구역에만 보이고 단축본(/print)에는 넣지 않는다.
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
    overview: '장면(인물, 풍경 등)을 고르면 가이드 선이 카메라 화면 위에 나옵니다. 촬영 후 필터를 고르면 원본과 필터 적용본을 사진 보관함에 함께 저장합니다.',
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
      '구도 가이드를 0.0~1.0 비율 좌표로 정의하게 했습니다. 4:3과 16:9에서 같은 데이터로 그립니다.',
      '가이드와 필터 데이터는 lib/data 한 곳에, 그리기는 lib/painting에 나눴습니다. 가이드를 더할 때 데이터만 고칩니다.',
      '화면 표시와 저장이 같은 필터 그리기 코드를 쓰게 했습니다. 미리보기와 저장 결과가 달라지지 않습니다.',
    ],
    cases: [
      { situation: 'AI가 질문에 대한 내 답을 승인으로 받아들이고 코드를 쓰기 시작했습니다.', choice: '작업을 멈추고, "승인"이라는 말이 있을 때만 코드를 쓰도록 인계 문서에 규칙을 넣었습니다.' },
      { situation: '조리개 조절을 넣으려 했지만 iPhone 카메라의 조리개는 고정입니다.', choice: '조리개 대신 밝기(노출) 조절을 넣었습니다.' },
      { situation: '1× 렌즈로 가까이 찍으면 초점이 맞지 않았습니다. 렌즈의 최소 초점 거리 문제로 보였습니다.', choice: '코드로 고치지 않고, 가까운 촬영은 0.5×를 쓰기로 했습니다.' },
    ],
    quality: [
      '계획 문서를 4번 고친 뒤 승인했습니다. 승인 전에는 코드를 쓰지 않습니다.',
      'Android 에뮬레이터로 단계 1~5를 확인한 뒤, iPhone 실기기에서 8개 항목을 확인했습니다.',
      'flutter analyze 문제 0건, 테스트 31개 통과 상태로 다음 세션에 인계했습니다.',
    ],
    githubUrl: 'https://github.com/Yun-sooyong/mangcut-bangji',
    notionUrl: 'https://yun-sooyong.notion.site/416258595efe8109aa54ec25ade06be1',
    shot: {
      src: '/shots/mangcut-bangji.png',
      alt: '망컷방지 앱의 구도 가이드 14종 목록 화면',
      caption: '앱에서 고를 수 있는 구도 가이드 14종입니다. 앱의 GuidePainter 코드로 그렸습니다.',
      width: 1600,
      height: 2250,
    },
    workflowUrl: 'https://github.com/Yun-sooyong/portfolio-site/blob/main/docs/ai-workflow/mangcut-bangji.md',
  },
  {
    id: 'dl-study',
    name: '직접 만들며 배우는 머신러닝 · 딥러닝 · LLM · VLM',
    kind: '개인',
    period: '2026.09, 1인',
    coreStack: ['PyTorch', 'Python'],
    coreStackIcons: { PyTorch: 'pytorch', Python: 'python' },
    summary: '머신러닝부터 LLM, VLM까지 26개 레슨을 읽고, 버튼 하나로 Colab에서 실행하는 한국어 실습 코스 사이트.',
    overview: '환경과 수학부터 머신러닝, 딥러닝, LLM, VLM, 종합 프로젝트까지 6부 26개 레슨입니다. 레슨 원본은 Markdown이고, 빌드 스크립트가 Colab 노트북과 목차를 만듭니다. GitHub Pages에 배포했습니다.',
    aiAreas: ['커리큘럼 구성', '레슨 작성', '실습 코드', '실행 검증', '용어 사전', '빌드 스크립트'],
    tools: [
      { name: 'Claude Code (Claude Fable 5.1)', use: '커리큘럼 구성, 레슨 원문과 실습 코드 작성, 실행 검증, 빌드 스크립트 작성' },
    ],
    impact: [
      { value: '1일', label: '레슨 8개로 시작해 26개 레슨 코스로 넓히고 공개하기까지 (2026.09.17~09.18, 커밋 12개)' },
      { value: '26개 · 145개', label: '레슨 26개와 Colab 노트북 26개. 노트북 코드 셀 145개를 Colab T4 기준으로 실행해 검증' },
      { value: '192개', label: '용어 사전 항목. 레슨 본문에 처음 나오는 용어에 정의가 자동으로 붙습니다' },
    ],
    design: [
      '레슨 원본은 lessons 폴더의 Markdown 1곳입니다. 파이썬 표준 라이브러리만 쓴 build.py가 Colab 노트북과 목차를 다시 만들고, 레슨 사이의 링크를 검사합니다.',
      '사이트는 index.html 한 파일입니다. 빌드 도구와 프레임워크를 더하지 않고 GitHub Pages에 올립니다.',
      '학습자가 초보자라서 Trainer 같은 추상화 대신 직접 짠 학습 루프를 유지하게 했습니다.',
    ],
    cases: [
      { situation: '코드는 긴데 해설이 짧아서 초보자가 따라가기 어려웠습니다.', choice: '모든 코드 블록 뒤에 "코드 읽기" 해설을 넣고, 항목마다 왜 이 함수와 값을 쓰는지 설명하도록 작업 규칙에 적었습니다.' },
      { situation: 'Colab의 matplotlib에는 한글 글꼴이 없어 그래프 글자가 깨집니다.', choice: '그래프 제목과 라벨은 영어로 쓰도록 규칙을 정했습니다.' },
      { situation: 'LLM 평가 레슨에서 심사 모델이 정해진 답 형식을 지키지 않는 경우가 있었습니다.', choice: '심사 지시를 시스템 프롬프트 방식으로 바꿔 형식 준수율을 높이고, 다시 실행해 확인했습니다.' },
    ],
    quality: [
      '레슨 코드를 Colab T4 환경(최신 transformers, peft, datasets)에서 실제로 실행해 검증했습니다.',
      '직접 고쳐보기 문항마다 실제 실행값을 기준으로 힌트와 예상 결과를 적었습니다.',
      'build.py가 없는 레슨으로 가는 링크와 레슨 제목 형식을 검사하고, 틀리면 빌드를 멈춥니다.',
    ],
    githubUrl: 'https://github.com/Yun-sooyong/dl-study',
    demoUrl: 'https://yun-sooyong.github.io/dl-study/',
    notionUrl: 'https://yun-sooyong.notion.site/421258595efe811b96bee683affec789',
    workflowUrl: 'https://github.com/Yun-sooyong/portfolio-site/blob/main/docs/ai-workflow/dl-study.md',
  },
  {
    id: 'g1-archive-viewer',
    name: '일본 G1 경마 리플레이 뷰어',
    kind: '개인',
    period: '2026.11, 1인',
    coreStack: ['Python', 'JavaScript'],
    coreStackIcons: { Python: 'python', JavaScript: 'javascript' },
    summary: 'JRA 공식 G1 경기 영상 위에, 경기 기록만으로 복원한 말 위치를 코스맵 애니메이션으로 겹쳐 보는 취미용 뷰어.',
    overview: '2021~2025년 G1 경기 영상 목록과 결과 기록을 모으고, 띄엄띄엄한 기록에서 말마다 0.1초 간격의 위치를 복원합니다. 영상, 코스맵, 진행바, 출전표가 한 화면에서 같은 시각을 가리킵니다. 마권 예측은 하지 않습니다.',
    aiAreas: ['데이터 수집', '복원 알고리즘', '검증 도구', '화면', '보안 점검', '문서화'],
    tools: [
      { name: 'Claude Code (Claude Opus 5)', use: '수집기와 복원 엔진, 검증 명령, 화면 코드 작성, 보안 점검, README 정리' },
    ],
    impact: [
      { value: '130경기', label: '2021~2025년 G1 경기 수집. 출전 2,123행, 말 989두, 파싱 오류 0건' },
      { value: '120경기', label: '평지 경기 전부가 복원 검사 4가지(착순, 착차, 완주 시각, 단조성)를 통과' },
      { value: '0.1초', label: '코너 통과순위와 200m 구간 기록만으로 만든 위치 간격. 18두 경기면 2만 점이 넘습니다' },
    ],
    design: [
      '영상을 시계로 씁니다. 매 프레임 영상의 현재 시각을 읽고 그 시각의 위치를 그려서, 영상 이동이 1~2초 어긋나도 화면이 맞습니다.',
      '복원(replay.py)은 거리와 차선만 내고, 화면 좌표 변환은 track.py만 합니다. 코스 수치 오류와 복원 오류를 따로 의심할 수 있습니다.',
      '화면은 미리 만든 JSON만 읽는 정적 사이트입니다. 서버 로직과 데이터베이스가 없고, 같은 dist 폴더를 정적 호스팅과 nginx에 함께 씁니다.',
    ],
    cases: [
      { situation: '일반 스플라인으로 기록 사이를 메우면 말이 뒤로 가는 구간이 생겼습니다.', choice: '단조 3차 보간(Fritsch–Carlson)을 직접 구현해 위치가 줄어들지 않게 했습니다.' },
      { situation: '착차 검사에서 순서가 뒤집히는 경기가 있었습니다. 착차를 1착 도착 시각 기준으로 계산했기 때문입니다.', choice: '착차의 정의대로 바로 앞 말이 결승선을 지난 시각을 기준으로 바꿨습니다.' },
      { situation: '보안 점검에서 nginx의 숨김 파일 차단 규칙이 js 규칙 뒤에 있어 /.git/x.js 같은 요청이 통과할 수 있었습니다.', choice: '차단 규칙을 위로 올리고, 읽기 전용 사이트라 GET과 HEAD 외의 요청을 막았습니다.' },
    ],
    quality: [
      'verify 명령이 복원 결과를 원본 기록과 다시 대조합니다. 보안 수정 뒤에도 평지 120경기 무결점을 다시 확인했습니다.',
      '보안 점검을 3번 했습니다. 해당 없는 항목은 코드 검색 근거를 남기고, 요청 제한과 경로 검사 등 빈 곳을 메웠습니다.',
      '수집한 데이터는 저장소에 넣지 않고, 공개용 빌드에는 대표 10경기만 넣도록 했습니다.',
    ],
    notionUrl: 'https://yun-sooyong.notion.site/421258595efe81789913c5eeb8e2f615',
    workflowUrl: 'https://github.com/Yun-sooyong/portfolio-site/blob/main/docs/ai-workflow/g1-archive-viewer.md',
  },
]
