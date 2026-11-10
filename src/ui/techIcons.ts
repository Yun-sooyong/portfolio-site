import {
  siCelery,
  siDart,
  siDjango,
  siDocker,
  siFastapi,
  siFirebase,
  siFlutter,
  siGit,
  siGithub,
  siGithubactions,
  siGooglecloud,
  siGooglecloudstorage,
  siGunicorn,
  siNginx,
  siNotion,
  siOllama,
  siOnnx,
  siPostgresql,
  siPython,
  siPytorch,
  siRedis,
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
  celery: siCelery,
  dart: siDart,
  django: siDjango,
  docker: siDocker,
  fastapi: siFastapi,
  firebase: siFirebase,
  flutter: siFlutter,
  git: siGit,
  github: siGithub,
  githubactions: siGithubactions,
  googlecloud: siGooglecloud,
  googlecloudstorage: siGooglecloudstorage,
  gunicorn: siGunicorn,
  nginx: siNginx,
  notion: siNotion,
  ollama: siOllama,
  onnx: siOnnx,
  postgresql: siPostgresql,
  python: siPython,
  pytorch: siPytorch,
  redis: siRedis,
}
