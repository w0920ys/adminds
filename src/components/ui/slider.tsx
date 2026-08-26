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
     * 손잡이가 둘인 range에서는 두 Thumb 모두 같은 thumbProps를 받는다 —
     * 둘을 구별해 가리켜야 할 만큼 서로 다른 부위가 아니다.
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
  trackProps,
  rangeProps,
  thumbProps,
  ...props
}: SliderProps) {
  const thumbValues = value ?? defaultValue ?? [0]

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      value={value}
      defaultValue={defaultValue}
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
      {thumbValues.map((_, index) => (
        <SliderPrimitive.Thumb
          key={index}
          data-slot="slider-thumb"
          {...thumbProps}
          className={cn(sliderThumbVariants({ size }), thumbProps?.className)}
        />
      ))}
    </SliderPrimitive.Root>
  )
}

export { Slider }
export type { SliderSize }
