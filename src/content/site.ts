import type { Contact, HowBuilt } from '../domain/portfolio'

export const contact: Contact = {
  // 이메일은 HTML 원문에 그대로 두지 않으려고 둘로 나눠 적는다.
  email: { user: 'ysyg22', domain: 'gmail.com' },
  github: 'https://github.com/Yun-sooyong',
}

export const howBuilt: HowBuilt = {
  lead: '내용과 화면을 나누고, 외부로 나가는 요청을 없애는 데 신경 썼다.',
  points: [
    {
      title: '내용과 화면을 나눈다',
      body: '새 프로젝트는 내용 파일에 항목 1개만 더한다. 상세본과 단축본이 같은 파일을 읽는다.',
    },
    {
      title: '시험이 내용 형식을 검사한다',
      body: '역할, 성과 숫자, https 링크가 빠지면 CI가 막는다.',
    },
    {
      title: '개인 정보를 싣지 않는다',
      body: '이메일은 화면에서 조립하고, 전화번호와 주소는 쓰지 않는다.',
    },
    {
      title: '외부 요청이 없다',
      body: '글꼴은 자체 제공하고, CSP 등 응답 헤더를 정했다. npm audit이 CI에서 돈다.',
    },
  ],
  ciSteps: ['npm ci', 'npm run lint', 'npm run typecheck', 'npm test', 'npm run build', 'npm audit --audit-level=high'],
  readmeUrl: 'https://github.com/Yun-sooyong/portfolio-site#readme',
}
