/** 예시 내용임을 알리는 표시. 실제 내용으로 바꾸면 content에서 제거한다. */
export function ExampleBadge({ className = '' }: { className?: string }) {
  return <p className={`example-badge ${className}`}>예시 내용입니다. 가상의 인물이고 실제 정보가 아닙니다.</p>
}
