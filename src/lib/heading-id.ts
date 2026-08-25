/** 제목 텍스트를 URL 조각으로 만든다. 한글은 그대로 둔다 — 브라우저가 알아서 인코딩한다 */
function slugify(text: string): string {
  const slug = text
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]+/g, '-')
    .replace(/^-|-$/g, '')
  return slug || 'section'
}

/**
 * 제목 목록을 id 목록으로 바꾼다.
 * 위치를 섞지 않는다 — 문서 중간에 제목이 하나 끼면 그 아래 id가 전부 밀려
 * 사용자가 복사해 둔 링크가 깨지기 때문이다.
 * 같은 제목이 두 번 나오면 뒤에 순번을 붙여 가른다.
 */
export function makeHeadingIds(texts: string[]): string[] {
  const seen = new Map<string, number>()
  return texts.map((text) => {
    const base = slugify(text)
    const count = (seen.get(base) ?? 0) + 1
    seen.set(base, count)
    return count === 1 ? base : `${base}-${count}`
  })
}

/** 아직 id가 없는 제목에만 붙인다. 이미 있는 id는 링크가 깨지므로 덮어쓰지 않는다 */
export function assignHeadingIds(root: ParentNode): HTMLHeadingElement[] {
  const nodes = [...root.querySelectorAll('h2, h3')] as HTMLHeadingElement[]
  const ids = makeHeadingIds(nodes.map((node) => node.textContent ?? ''))
  nodes.forEach((node, index) => {
    if (!node.id) node.id = ids[index]
  })
  return nodes
}
