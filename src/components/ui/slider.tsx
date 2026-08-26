import * as React from 'react'
import * as SliderPrimitive from '@radix-ui/react-slider'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

type SliderSize = 'sm' | 'default'

/*
 * Track은 늘 bg-muted다 — Progress와 같은 생각이다(두 컴포넌트 모두
 * track과 채워진 부분으로 이루어진 하나의 가족이다). overflow-hidden이
 * 있어야 안의 Range가 track 밖으로 새지 않는다.
 */
const sliderTrackVariants = cva('bg-muted relative w-full grow overflow-hidden rounded-full', {
  variants: {
    size: {
      sm: 'h-1',
      default: 'h-1.5',
    },
  },
  defaultVariants: { size: 'default' },
})

/*
 * Thumb는 테두리와 bg-background다 — 채워진 Range 위에 있어도 손잡이가
 * 도형으로 읽히도록 border-primary로 감싼다. Root·Track·Thumb 모두 실제
 * <button>·<input>이 아니라 <span>이라 disabled 어트리뷰트가 없고
 * :disabled 의사 클래스가 붙지 않는다 — disabled일 때 Radix가 slide
 * 핸들러 자체를 걸지 않고 Thumb의 tabIndex도 지워 마우스로 끌거나
 * 키보드로 움직일 수 없게 하므로, 여기서는 흐림(Root의 opacity-50)만
 * 더하면 충분하다.
 */
const sliderThumbVariants = cva(
  cn(
    'border-primary bg-background block shrink-0 rounded-full border-2 shadow-xs outline-none transition-colors',
    'hover:border-ring/60',
    'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-2',
  ),
  {
    variants: {
      size: {
        sm: 'size-4',
        default: 'size-5',
      },
    },
    defaultVariants: { size: 'default' },
  },
)

type SliderProps = Omit<React.ComponentProps<typeof SliderPrimitive.Root>, 'defaultValue'> &
  VariantProps<typeof sliderTrackVariants> & {
    defaultValue?: number[]
    /*
     * Track·Range·Thumb는 Root 안에 있어 소비자가 직접 닿을 수 없다.
     * Progress의 indicatorProps, Switch의 thumbProps와 같은 통로다.
     * 손잡이가 둘인 range에서도 두 Thumb 모두 같은 thumbProps를 받는다 —
     * 모양·동작 면에서 둘을 구별해 꾸밀 일이 없다. 손잡이마다 달라지는
     * 것은 이름뿐이고, 그건 아래에서 따로 계산해 단다.
     */
    trackProps?: React.ComponentProps<typeof SliderPrimitive.Track> & {
      [dataAttr: `data-${string}`]: string
    }
    rangeProps?: React.ComponentProps<typeof SliderPrimitive.Range> & {
      [dataAttr: `data-${string}`]: string
    }
    thumbProps?: React.ComponentProps<typeof SliderPrimitive.Thumb> & {
      [dataAttr: `data-${string}`]: string
    }
  }

/*
 * role="slider"를 다는 것은 Root가 아니라 Thumb다 — Root는 역할 없는
 * span이라 거기 붙은 이름·설명은 어디에도 닿지 않는다. 그래서 Slider는
 * 자기가 받은 aria-label·aria-labelledby·aria-describedby를 Root에 두지
 * 않고 Thumb으로 옮겨 단다. Field가 FieldControl로 내려준 이름과 설명이
 * 이 통로를 지나 실제 컨트롤에 닿는다.
 *
 * 오류(aria-invalid)와 비활성(disabled)도 같은 이유로 같은 길을 탄다.
 * Field가 state="error"에서 내려주는 aria-invalid를 Root에 그대로 두면
 * 역할 없는 span에 붙어 아무 데도 닿지 않는다 — Thumb으로 옮겨 단다.
 * disabled는 Radix가 동작을 멈추는 데 쓰므로 Root에 그대로 넘기되(넘기지
 * 않으면 비활성인데도 끌 수 있다), Radix가 그 값으로 Root에 다는
 * aria-disabled 역시 역할 없는 자리라 Thumb에도 함께 단다. 비활성이면
 * Radix가 Thumb의 tabIndex를 지워 포커스로는 닿지 않지만, 훑어 읽는
 * 스크린 리더는 이 값을 읽어 지금 값을 바꿀 수 없다는 것을 알린다.
 *
 * 손잡이가 둘 이상이면 이름이 서로 같아서는 안 된다 — 어느 쪽을 잡고
 * 있는지 구별되지 않는다. 위치 이름(시작·종료)을 덧붙여 가른다.
 * aria-labelledby로 이름을 받은 경우에는 문자열을 이어 붙일 수 없으므로
 * 위치 이름을 담은 요소를 따로 그려 두고 그 id를 뒤에 잇는다.
 */
function thumbPositionLabel(index: number, total: number): string | undefined {
  if (total < 2) return undefined
  if (total === 2) return index === 0 ? '시작' : '종료'
  return `${index + 1}번째 손잡이`
}

/*
 * 손잡이가 둘인 range는 value의 길이로 정해진다 — Radix가 value 배열마다
 * Thumb 하나를 요구하므로, 손잡이 개수를 세지 않고 value(또는 초기
 * 렌더링에서는 defaultValue) 배열을 그대로 map해서 그린다. 배열 길이는
 * 드래그 중에 바뀌지 않으므로(값만 바뀐다) 이 계산은 마운트 시점 하나로
 * 충분하다.
 */
function Slider({
  className,
  size,
  value,
  defaultValue,
  disabled,
  trackProps,
  rangeProps,
  thumbProps,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  'aria-describedby': ariaDescribedBy,
  'aria-invalid': ariaInvalid,
  ...props
}: SliderProps) {
  const thumbValues = value ?? defaultValue ?? [0]
  const positionId = React.useId()
  const hasPositionLabels = thumbValues.length > 1

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      value={value}
      defaultValue={defaultValue}
      disabled={disabled}
      className={cn(
        'relative flex w-full touch-none items-center select-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
        className,
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        {...trackProps}
        className={cn(sliderTrackVariants({ size }), trackProps?.className)}
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          {...rangeProps}
          className={cn('bg-primary absolute h-full', rangeProps?.className)}
        />
      </SliderPrimitive.Track>
      {thumbValues.map((_, index) => {
        const position = thumbPositionLabel(index, thumbValues.length)
        return (
          <SliderPrimitive.Thumb
            key={index}
            data-slot="slider-thumb"
            aria-labelledby={
              ariaLabelledBy
                ? [ariaLabelledBy, position && `${positionId}-${index}`].filter(Boolean).join(' ')
                : undefined
            }
            aria-label={
              ariaLabelledBy ? undefined : [ariaLabel, position].filter(Boolean).join(' ') || undefined
            }
            aria-describedby={ariaDescribedBy}
            aria-invalid={ariaInvalid}
            aria-disabled={disabled || undefined}
            {...thumbProps}
            className={cn(sliderThumbVariants({ size }), thumbProps?.className)}
          />
        )
      })}
      {/*
        aria-labelledby로 이름을 받았을 때만 필요한 조각이다 — 라벨 문구
        뒤에 이을 위치 이름을 담아 둔다. display:none이나 aria-hidden으로
        감추면 브라우저의 이름 계산 규칙에 한 겹 더 기대야 해서, 화면에서만
        감추는 sr-only로 둔다.
      */}
      {ariaLabelledBy &&
        hasPositionLabels &&
        thumbValues.map((_, index) => (
          <span key={index} id={`${positionId}-${index}`} className="sr-only">
            {thumbPositionLabel(index, thumbValues.length)}
          </span>
        ))}
    </SliderPrimitive.Root>
  )
}

export { Slider }
export type { SliderSize }
