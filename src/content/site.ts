import type { Contact, HowBuilt } from '../domain/portfolio'

export const contact: Contact = {
  // 이메일은 HTML 원문에 그대로 두지 않으려고 둘로 나눠 적는다.
  email: { user: 'hello', domain: 'example.com' },
  github: 'https://github.com/example',
  blog: 'https://example.com/blog',
}

export const howBuilt: HowBuilt = {
  lead: '내용과 화면을 나누고, 외부로 나가는 요청을 없애는 데 신경 썼다.',
  folders: [
    { folder: 'src/domain', role: '내용의 타입 정의. React를 모른다', dependsOn: '없음' },
    { folder: 'src/content', role: '실제 내용 데이터. 고치는 유일한 곳', dependsOn: 'domain' },
    { folder: 'src/features', role: '장면별 화면 부품 (상세본, 단축본)', dependsOn: 'domain, ui' },
    { folder: 'src/ui', role: '공용 화면 부품과 장면 전환 훅', dependsOn: '없음' },
    { folder: 'src/app', role: '라우터와 페이지 조립', dependsOn: '모두' },
  ],
  groups: [
    {
      title: '구조',
      items: [
        {
          title: '내용과 화면을 나눈다',
          body: '새 프로젝트를 더할 때 내용 파일에 항목 1개만 더한다. 화면 코드는 건드리지 않는다.',
        },
        {
          title: '한 내용, 두 화면',
          body: '상세본과 단축본은 같은 내용 파일을 다른 화면 부품으로 보인다.',
        },
      ],
    },
    {
      title: '확장성',
      items: [
        {
          title: '시험이 내용 형식을 검사한다',
          body: '프로젝트마다 역할과 결과가 있는지, 링크가 https인지 Vitest가 확인한다. 내용을 고치다 빠뜨리면 CI가 막는다.',
        },
        {
          title: '장면은 배열로 정의한다',
          body: '장면 순서와 이름을 한 배열에 둔다. 위치 표시와 본문이 같은 배열을 읽는다.',
        },
      ],
    },
    {
      title: '보안과 개인 정보',
      items: [
        {
          title: '개인 정보를 싣지 않는다',
          body: '전화번호, 주소, 생년월일을 쓰지 않는다. 지역은 시 단위까지만 쓴다.',
        },
        {
          title: '이메일을 화면에서 조립한다',
          body: 'HTML 원문에 이메일을 두지 않는다. 수집 프로그램을 줄일 뿐 완전한 차단은 아니다.',
        },
        {
          title: '응답 헤더를 정한다',
          body: 'CSP(외부 스크립트 금지, frame-ancestors none), HSTS, nosniff, Referrer-Policy, Permissions-Policy를 Vercel 설정에 둔다.',
        },
        {
          title: '외부 요청이 없다',
          body: '글꼴을 npm 패키지로 자체 제공한다. 분석 도구, CDN, 소스 맵을 쓰지 않는다.',
        },
        {
          title: '의존성을 고정하고 점검한다',
          body: 'lockfile로 고정하고, CI가 npm audit을 돌리고, Dependabot이 주 1회 갱신을 제안한다. 비밀 값이 없는 구조다.',
        },
      ],
    },
  ],
}
