export type ComboboxOption = { value: string; label: string }

/**
 * 앞글자가 아니라 포함으로 맞춘다 — 앞글자만 맞추면 '김하나'를 '하나'로 찾을 수 없다.
 * 원본 순서를 지킨다. 항목 순서에 뜻이 담기는 경우가 많아 점수순으로 흩뜨리지 않는다.
 */
export function filterOptions<T extends ComboboxOption>(options: T[], query: string): T[] {
  const needle = query.trim().toLowerCase()
  if (!needle) return options
  return options.filter((option) => option.label.toLowerCase().includes(needle))
}
