import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

/*
 * padding은 Card가 정하고 CardContent가 읽는다 — Table의 density가
 * TableRow로 내려가는 것과 같은 구조다. padding이 none일 때 여백을
 * 없애는 대상은 CardContent 하나뿐이다. CardHeader·CardHeader의
 * Title·Description·Action과 CardFooter는 padding 값과 무관하게 자기
 * 여백(px-6)을 그대로 유지한다 — 표를 통째로 담아 CardContent의
 * 여백을 없애도 제목과 바닥 동작까지 화면 가장자리에 붙으면 안 되기
 * 때문이다.
 */
type CardPadding = 'default' | 'none'

const CardPaddingContext = React.createContext<CardPadding>('default')

/*
 * 어드민 화면은 카드가 여럿 나란히 놓이는 일이 많고, 그림자가 여럿이면
 * 화면이 들뜬다 — 그래서 outlined가 기본이다. elevated는 배경 위에
 * 홀로 떠 있어야 하는 카드에 쓴다.
 *
 * elevated의 shadow-sm은 라이트에서는 보이지만(브라우저로 확인함),
 * 다크에서는 색이 rgba(0,0,0,0.1)이라 이미 어두운 배경에 묻혀
 * 보이지 않는다(마찬가지로 브라우저로 확인함). 다크에서 outlined에
 * 테두리를 더해 메우면 outlined도 이미 테두리를 가지고 있어 두 값이
 * 오히려 같아진다 — 축의 두 칸이 똑같이 보이는 결함(Input·Select의
 * hover에서 이미 한 번 고쳤다)을 새로 만드는 셈이라 쓰지 않는다.
 * 대신 다크에서는 밝기로 떠 있음을 말한다 — elevated는 다크에서 한
 * 단계 밝은 표면(--surface-raised)에 얹히고 그림자·테두리 둘 다
 * 두지 않는다. outlined는 라이트·다크 모두 테두리 + bg-card로 고정이다.
 */
const cardVariants = cva('flex flex-col gap-6 rounded-lg py-6 text-card-foreground', {
  variants: {
    variant: {
      outlined: 'border bg-card',
      elevated: 'bg-card shadow-sm dark:bg-surface-raised dark:shadow-none',
    },
  },
  defaultVariants: { variant: 'outlined' },
})

type CardProps = React.ComponentProps<'div'> &
  VariantProps<typeof cardVariants> & {
    /** CardContent의 좌우 여백. none은 표처럼 스스로 여백을 가진 내용을 담을 때 쓴다 */
    padding?: CardPadding
  }

function Card({ className, variant = 'outlined', padding = 'default', ...props }: CardProps) {
  return (
    <CardPaddingContext.Provider value={padding}>
      <div data-slot="card" className={cn(cardVariants({ variant, className }))} {...props} />
    </CardPaddingContext.Provider>
  )
}

/*
 * grid-cols-[1fr_auto]는 CardAction이 실제로 있을 때만 건다 —
 * has-[[data-slot=card-action]]:로 조건을 걸었다. Action이 없으면
 * 빈 두 번째 열이 폭 0으로 저절로 접힐 거라 믿고 무조건 걸어 뒀었는데,
 * 실측해 보니 거짓이었다 — 좁은 카드(160px)에서 Action 없는 헤더를
 * 직접 렌더링해 보니 두 번째 열이 50px 가까이 차지하고 첫 번째 열(제목)이
 * 15px로 짓눌려, "워크스페이스 사용량"이 한 글자씩 세로로 줄바꿈됐다
 * (브라우저로 재현·측정함 — gridTemplateColumns가 실제로 "15px 50px"
 * 로 계산됐다). 한글은 음절 단위로 줄을 바꾸므로(Typography의
 * word-break 규칙) 제목의 min-content가 글자 하나 폭까지 줄어들 수
 * 있어, 빈 auto 열이 그 남는 공간을 가져가 버린 것으로 보인다 — 영문
 * 제목처럼 min-content가 한 단어 폭으로 넉넉했다면 드러나지 않았을
 * 결함이다. Action이 있을 때는 두 번째 열을 만들어 오른쪽 끝에
 * 고정한다 — Title·Description은 첫 번째 열(1fr)에 쌓이고 Action은
 * 두 열에 걸쳐 위쪽에 붙는다. 없을 때는 grid-cols를 아예 안 걸어
 * Title·Description이 암묵적 한 열에 쌓이며 전체 폭을 그대로 쓴다.
 */
function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        'grid grid-rows-[auto_auto] items-start gap-1.5 px-6',
        'has-[[data-slot=card-action]]:grid-cols-[1fr_auto]',
        className,
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-title"
      className={cn('text-18 leading-none font-semibold', className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-description"
      className={cn('text-muted-foreground text-16', className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-action"
      className={cn('col-start-2 row-span-2 row-start-1 self-start justify-self-end', className)}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
  const padding = React.useContext(CardPaddingContext)
  return (
    <div
      data-slot="card-content"
      className={cn(padding === 'default' && 'px-6', className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div data-slot="card-footer" className={cn('flex items-center px-6', className)} {...props} />
  )
}

export { Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter, cardVariants }
