export type CommandEntry = {
  value: string
  label: string
  /** 이 항목이 속한 묶음의 이름. 없으면 이름표 없는 묶음에 담긴다 */
  group?: string
  /** 사람이 실제로 치는 다른 이름들. 이름과 함께 훑는다 */
  keywords?: string[]
  disabled?: boolean
}

export type CommandSection = { label: string; entries: CommandEntry[] }

/**
 * 거르는 규칙은 filterOptions와 같다 — 공백을 걷고, 대소문자를 가리지
 * 않고, 앞글자가 아니라 포함으로 맞추고, 원본 순서를 지킨다. 항목 순서에
 * 뜻이 담기는 경우가 많아 점수순으로 흩뜨리지 않는다.
 *
 * 다른 것은 훑는 자리 하나다. filterOptions는 label만 보는데 여기서는
 * keywords까지 함께 본다 — '모달'로 Dialog에 닿으려면 항목이 그 말을
 * 들고 있어야 한다. 그 필요 때문에 filterOptions를 넓히지는 않았다.
 * 넓히면 Combobox가 쓰는 ComboboxOption이 함께 넓어진다.
 */
export function filterCommandEntries(entries: CommandEntry[], query: string): CommandEntry[] {
  const needle = query.trim().toLowerCase()
  if (!needle) return entries
  return entries.filter((entry) =>
    [entry.label, ...(entry.keywords ?? [])].some((text) => text.toLowerCase().includes(needle)),
  )
}

/**
 * 묶음은 처음 나온 순서로 놓는다. 목록의 순서에 이미 뜻이 있으므로
 * 이름순으로 다시 세우지 않는다. 묶음이 없는 항목은 이름표가 빈
 * 묶음에 담기고, 그 묶음은 첫 무묶음 항목이 있던 자리에 놓인다 —
 * 이름표가 비면 화면에 머리글을 그리지 않는다.
 */
export function groupCommandEntries(entries: CommandEntry[]): CommandSection[] {
  const sections: CommandSection[] = []
  const byLabel = new Map<string, CommandSection>()

  for (const entry of entries) {
    const label = entry.group ?? ''
    let section = byLabel.get(label)
    if (!section) {
      section = { label, entries: [] }
      byLabel.set(label, section)
      sections.push(section)
    }
    section.entries.push(entry)
  }

  return sections
}

/**
 * 화면은 sections를 그대로 그린다 — 묶음마다 머리글, 그 아래 항목들. 위아래
 * 이동이 그 화면 순서를 따라야 하는데, 원본 배열(filtered)의 순서를 그대로
 * 짚으면 묶음이 뒤섞인 원본에서는 화면 순서와 갈린다. A(X)·B(Y)·C(X)라면
 * 화면은 A·C·B로 그리는데 원본은 A·B·C라 다르다. 그래서 짚는 인덱스는
 * 반드시 이 함수로 편 배열 위에서 세야 한다.
 */
export function flattenCommandSections(sections: CommandSection[]): CommandEntry[] {
  return sections.flatMap((section) => section.entries)
}
