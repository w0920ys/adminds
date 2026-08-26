/**
 * 원칙 여섯.
 *
 * 새로 만든 것이 하나도 없다. 전부 이미 다른 문서에서 지키고 있는
 * 것이고, 여기서는 이름을 붙이고 그 문서를 가리킬 뿐이다. source가
 * 실재하는 문서를 가리키는지는 테스트가 지킨다.
 *
 * scope가 갈린다. 앞의 다섯은 제품 화면에 대한 것이고 마지막 하나는
 * 이 작업대 자체에 대한 것이다.
 */
export type Principle = {
  id: string
  title: string
  body: string
  /** product = 제품 화면에 거는 규칙, workbench = 이 작업대에 거는 규칙 */
  scope: 'product' | 'workbench'
  /** 이 원칙을 자세히 다루는 문서의 경로 */
  source: string
}

export const principles: Principle[] = [
  {
    id: 'color-by-role',
    title: '역할로 색을 고른다',
    body: '파란색이라서 고르는 것이 아니라 주요 동작이라서 primary를 고릅니다. 역할로 고른 색은 다크 모드에서 저절로 따라오고, 값으로 고른 색은 따라오지 않습니다.',
    scope: 'product',
    /* Color 문서의 설명이 이 원칙 그대로다 — "역할로 쓰면 라이트·다크
     * 전환과 브랜드 교체가 토큰 한 곳에서 끝납니다." */
    source: '/foundations/color',
  },
  {
    id: 'keep-density',
    title: '밀도를 지킨다',
    body: '어드민은 한 화면에서 읽는 양이 많습니다. 간격은 4px 배수로만 쓰고, 컨트롤 높이는 정해진 세 단을 벗어나지 않습니다. 임의 값이 하나 섞이면 정렬이 눈에 띄게 어긋납니다.',
    scope: 'product',
    source: '/foundations/spacing',
  },
  {
    id: 'one-primary-action',
    title: '한 화면에 주요 동작은 하나다',
    body: '가장 자주 하는 일 하나만 채운 버튼으로 둡니다. 채운 버튼이 둘이면 어느 쪽이 주인지 알 수 없고, 그러면 둘 다 주가 아닙니다.',
    scope: 'product',
    source: '/components/button',
  },
  {
    id: 'not-color-alone',
    title: '색만으로 뜻을 전하지 않는다',
    body: '상태는 색과 함께 글이나 아이콘으로도 말합니다. 색을 구별하지 못하는 사람에게도, 색이 죽은 화면에서도 뜻이 남아야 합니다.',
    scope: 'product',
    source: '/foundations/state',
  },
  {
    id: 'confirm-the-irreversible',
    title: '되돌리기 어려운 동작에는 확인 단계를 둔다',
    body: '되돌릴 수 있으면 되돌리기를 주고, 되돌릴 수 없으면 묻습니다. 둘 다 두면 확인이 소음이 되어 아무도 읽지 않습니다.',
    scope: 'product',
    /* Destructive confirm 패턴의 undo-in-toast 지침이 이 원칙의 근거다 —
     * "되돌릴 수 있는 동작에는 확인 단계를 줄이고 되돌리기를 준다. 묻는
     * 단계와 되돌리는 단계를 둘 다 두면 확인이 소음이 된다." */
    source: '/patterns/destructive-confirm',
  },
  {
    id: 'docs-tell-the-truth',
    title: '상태는 코드와 문서가 함께 말한다',
    body: '이 시스템은 문서가 곧 제품입니다. 그래서 문서가 코드에 대해 사실이 아닌 것을 말하면 그것이 곧 결함입니다. 화면에 나오는 목록과 숫자를 손으로 적지 않는 것도, 확인하지 않은 것을 적지 않는 것도 같은 이유입니다.',
    scope: 'workbench',
    /* Get started Overview가 이 문장을 그대로 말한다 — "문서가 코드에
     * 대해 사실만 말하는지를 계속 확인합니다 — 여기서는 문서가 곧
     * 제품입니다." 이 문서의 Status 절 자체도 숫자를 손으로 적지 않고
     * componentStats·patternStats·flattenDocs에서 가져온다. */
    source: '/',
  },
]
