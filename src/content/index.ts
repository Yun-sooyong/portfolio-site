import type { Portfolio } from '../domain/portfolio'
import { background, profile } from './profile'
import { skillGroups } from './skills'
import { projects } from './projects'
import { contact, howBuilt } from './site'
import { journal } from './journal'
import { highlights } from './highlights'
import { home } from './home'

/** 상세본과 단축본이 함께 읽는 내용 묶음 */
export const portfolio: Portfolio = {
  profile,
  background,
  skillGroups,
  projects,
  contact,
  howBuilt,
  journal,
  highlights,
  home,
}
