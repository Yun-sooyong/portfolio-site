// 시행착오 기록 고르기. React와 화면을 모른다.

/** "기록" 구역에 보이는 최근 시행착오 개수 */
export const RECENT_JOURNAL_COUNT = 3

/** 날짜가 늦은 순서로 최근 기록 count개를 돌려준다. 날짜가 같으면 배열에서 뒤에 있는 것이 더 최근이다. */
export function recentJournal<T extends { date: string }>(entries: readonly T[], count: number = RECENT_JOURNAL_COUNT): T[] {
  return entries
    .map((entry, index) => ({ entry, index }))
    .sort((a, b) => (a.entry.date === b.entry.date ? b.index - a.index : a.entry.date < b.entry.date ? 1 : -1))
    .slice(0, count)
    .map((x) => x.entry)
}
