import { cn } from '@/lib/utils'

/**
 * 이번 릴리스에서 바뀐 문서를 알리는 점. LNB와 검색 결과가 같은 모양을 쓴다.
 * 자리(ml-auto로 줄 끝에 붙일지, 라벨 옆에 바로 이어 붙일지)는 쓰는 쪽마다
 * 달라 className으로 받는다.
 *
 * 점 하나로는 스크린 리더에 아무것도 전해지지 않으므로 sr-only 텍스트를
 * 함께 둔다 — 이 컴포넌트가 링크나 버튼 안에 놓이면 그 접근 가능한 이름이
 * "Toggle 업데이트됨"처럼 라벨 뒤에 자연스럽게 이어진다.
 *
 * 색은 --color-info를 그대로 쓴다. 예전 New 배지가 variant="info"였던 것과
 * 같은 뜻(안내성 정보)을 이어받는 값이라 새로 고를 이유가 없었다. 옅게
 * 탄 배경이 아니라 점 전체를 그 색으로 채우므로 *-on-tint가 아닌 --info를
 * 직접 쓴다 — 비문자 대비(3:1) 기준으로 라이트에서 가장 낮은 값은 bg-accent
 * 위 3.66:1, 다크는 어느 표면 위에서도 5.7:1을 넘는다.
 */
export function UpdateDot({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex shrink-0 items-center', className)}>
      <span aria-hidden className="bg-info size-1.5 rounded-full" />
      <span className="sr-only">업데이트됨</span>
    </span>
  )
}
