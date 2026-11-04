import {
  siDocker,
  siGit,
  siGithub,
  siGithubactions,
  siKotlin,
  siMysql,
  siNotion,
  siPostgresql,
  siReact,
  siRedis,
  siSpringboot,
  siTypescript,
} from 'simple-icons'

/** 아이콘 1개. path는 24x24 viewBox 기준 SVG 경로다. */
export interface TechIconData {
  title: string
  path: string
}

/**
 * 내용 파일의 icon 키와 simple-icons(CC0) SVG 경로를 잇는 유일한 곳이다.
 * 쓰는 아이콘만 이름으로 가져와 번들에 넣는다. 키가 없는 기술은 글자만 보인다.
 */
export const techIcons: Record<string, TechIconData> = {
  docker: siDocker,
  git: siGit,
  github: siGithub,
  githubactions: siGithubactions,
  kotlin: siKotlin,
  mysql: siMysql,
  notion: siNotion,
  postgresql: siPostgresql,
  react: siReact,
  redis: siRedis,
  springboot: siSpringboot,
  typescript: siTypescript,
}
