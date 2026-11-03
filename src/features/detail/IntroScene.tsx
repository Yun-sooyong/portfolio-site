import type { Profile } from '../../domain/portfolio'
import { Scene } from '../../ui/Scene'
import { ExampleBadge } from '../../ui/ExampleBadge'

export function IntroScene({ profile, id, title }: { profile: Profile; id: string; title: string }) {
  return (
    <Scene id={id} title={title} instant>
      <p className="hero-role">{profile.role}</p>
      <h1 className="hero-name">{profile.name}</h1>
      <p className="hero-region">{profile.region}</p>
      <div className="prose-block">
        {profile.intro.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
      <h3 className="sub-title">강점</h3>
      <ul className="strengths">
        {profile.strengths.map((s) => (
          <li key={s.title}>
            <strong>{s.title}</strong>
            <span>{s.evidence}</span>
          </li>
        ))}
      </ul>
      <ExampleBadge />
    </Scene>
  )
}
