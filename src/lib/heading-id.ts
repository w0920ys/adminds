/**
 * 제목 텍스트에서 id를 만든다. 한글을 그대로 두면 URL 조각이 길어지므로 순번을 섞는다.
 * 목차와 제목 앵커가 같은 id를 가리켜야 하므로 규칙은 여기 한 곳에만 둔다.
 */
export function makeHeadingId(text: string, index: number): string {
  const slug = text
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]+/g, '-')
    .replace(/^-|-$/g, '')
  return `section-${index}-${slug || 'x'}`
}

/** 아직 id가 없는 제목에만 붙인다. 이미 있는 id는 링크가 깨지므로 덮어쓰지 않는다 */
export function assignHeadingIds(root: ParentNode): HTMLHeadingElement[] {
  const nodes = [...root.querySelectorAll('h2, h3')] as HTMLHeadingElement[]
  nodes.forEach((node, index) => {
    if (!node.id) node.id = makeHeadingId(node.textContent ?? '', index)
  })
  return nodes
}
