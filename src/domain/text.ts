/** 마침표 뒤 공백에서 문장을 나눈다. 빈 조각은 버린다. */
export function splitSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean)
}

/** "EMPATHO (유방암 검진 경로 CDSS)" 에서 괄호 설명을 뺀 짧은 이름을 돌려준다. */
export function shortProjectName(name: string): string {
  return name.replace(/\s*\(.*\)\s*$/, '')
}
