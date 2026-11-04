/** 목록이 비었을 때 깨진 화면 대신 보이는 안내 */
export function EmptyNote({ children = '아직 적은 내용이 없습니다.' }: { children?: string }) {
  return <p className="empty-note">{children}</p>
}
