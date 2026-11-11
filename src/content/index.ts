import type { Portfolio } from '../domain/portfolio'
import { background, profile } from './profile'
import { skillGroups } from './skills'
import { projects } from './projects'
import { aiProjects } from './aiProjects'
import { contact } from './site'
import { highlights } from './highlights'
import { home } from './home'

/** 상세본과 단축본이 함께 읽는 내용 묶음 */
export const portfolio: Portfolio = {
  profile,
  background,
  skillGroups,
  projects,
  aiProjects,
  contact,
  highlights,
  home,
}
