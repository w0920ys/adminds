import { useEffect, useRef, useState } from 'react'
import { Check, Copy, X } from 'lucide-react'
import { Link } from 'react-router'
import { DocPage, DocSection } from '@/components/docs/DocPage'
import { DoDont } from '@/components/docs/DoDont'
import { ExampleFrame } from '@/components/docs/ExampleFrame'
import { Button } from '@/components/ui/button'

/** 크기 비교는 같은 글자로 해야 눈이 속지 않는다 */
const SPECIMEN = '사용자 관리'

/**
 * 선언 순서는 화면에 나오는 순서와 무관하다.
 * 표의 순서는 아래에서 실측한 font-size 내림차순이 정하므로
 * 스케일을 바꾸면 표의 순서까지 따라온다.
 */
const SCALE = [
  { className: 'text-48', role: '강조 숫자·텍스트 대', weight: 'bold' },
  { className: 'text-40', role: '강조 숫자·텍스트 중', weight: 'bold' },
  { className: 'text-32', role: '페이지 제목(h1)·강조 숫자·텍스트 소', weight: 'bold' },
  { className: 'text-28', role: '상세 화면 제목', weight: 'semibold' },
  { className: 'text-24', role: '목록·카드 화면 제목', weight: 'semibold' },
  { className: 'text-22', role: '문서 섹션 제목(h2)', weight: 'semibold' },
  { className: 'text-20', role: '다이얼로그·시트·얼럿다이얼로그 제목', weight: 'semibold' },
  {
    className: 'text-18',
    role: '문서 소제목·카드 제목(semibold) · 설명 문단(normal)',
    weight: '제목 semibold · 문단 normal',
  },
  {
    className: 'text-16',
    role: '본문·컨트롤 라벨 — 새 기본값',
    weight: '본문 normal · 라벨 medium',
  },
  { className: 'text-14', role: '조밀 모드 전용 — 표 셀 등', weight: 'normal' },
  { className: 'text-12', role: '설명·캡션·도움말 — 사실상 바닥', weight: 'normal' },
  { className: 'text-11', role: '예비 — 아래 세 조건을 모두 통과하는 자리가 아직 없다', weight: 'bold' },
]

/** 여기도 선언 순서는 무관하다. 실측한 font-weight 내림차순으로 늘어놓는다 */
const WEIGHTS = [
  { className: 'font-medium', role: '컨트롤 라벨' },
  { className: 'font-bold', role: '페이지 제목 · 섹션 라벨 · 표 머리 행' },
  { className: 'font-normal', role: '본문 · 표 셀 값' },
  { className: 'font-semibold', role: '활성 항목 · 강조할 한 낱말' },
]

/** 띄어쓰기 없는 긴 어절이 있어야 두 규칙의 차이가 눈에 보인다 */
const WRAP_SPECIMEN = '이 계정에는 결제수단변경권한이 없어 요청을 처리하지 못했습니다.'

const WRAP_DEMOS = [
  {
    key: 'normal',
    kind: 'do' as const,
    title: '이 시스템의 규칙',
    note: '음절 단위로 끊어 줄을 고르게 채웁니다.',
    className: '',
  },
  {
    key: 'keep-all',
    kind: 'dont' as const,
    title: 'break-keep',
    note: '어절을 통째로 묶어 앞 줄이 크게 빕니다.',
    className: 'break-keep',
  },
]

const STATS = [
  { label: '전체', value: '12,400' },
  { label: '활성', value: '9,318' },
  { label: '정지', value: '86' },
]

/** 크기를 제각각 준 나쁜 예시. 스케일 안의 클래스만 쓰되 한 줄에 섞는다 */
const INCONSISTENT_STAT_SIZES = ['text-40', 'text-16', 'text-12']

type ScaleRow = {
  className: string
  role: string
  weight: string
  fontSize: string
  lineHeight: string
  letterSpacing: string
  px: number
}

type WeightRow = {
  className: string
  role: string
  fontWeight: string
  value: number
}

type CopyState = 'idle' | 'copied' | 'failed'

/**
 * 여러 줄 값은 CopyValue처럼 값 옆에 아이콘을 붙일 수 없다.
 * 이 페이지의 폰트 스택 하나에만 쓰므로 여기에 둔다.
 */
function CopyStackButton({ value }: { value: string }) {
  const [state, setState] = useState<CopyState>('idle')

  useEffect(() => {
    if (state === 'idle') return
    const timer = setTimeout(() => setState('idle'), 2000)
    return () => clearTimeout(timer)
  }, [state])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setState('copied')
    } catch {
      /* 클립보드를 쓸 수 없는 환경이 있다. 조용히 넘기지 않고 실패를 보여준다 */
      setState('failed')
    }
  }

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={copy}
        disabled={!value}
        aria-label="폰트 스택 복사"
      >
        {state === 'copied' && <Check className="text-success" aria-hidden />}
        {state === 'failed' && <X className="text-destructive" aria-hidden />}
        {state === 'idle' && <Copy aria-hidden />}
        복사
      </Button>
      <span aria-live="polite" className="sr-only">
        {state === 'copied' ? '복사했습니다' : state === 'failed' ? '복사하지 못했습니다' : ''}
      </span>
    </>
  )
}

export function TypographyPage() {
  const probeRef = useRef<HTMLDivElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState<ScaleRow[]>([])
  const [weights, setWeights] = useState<WeightRow[]>([])
  const [fontStack, setFontStack] = useState('')
  const [wrapRules, setWrapRules] = useState<Record<string, string>>({})

  useEffect(() => {
    /* 문서에 적어 둔 스택이 아니라 브라우저가 실제로 적용한 스택을 읽는다 */
    setFontStack(getComputedStyle(document.body).fontFamily)

    const probe = probeRef.current
    if (probe) {
      const sizes: ScaleRow[] = []
      for (const item of SCALE) {
        const node = probe.querySelector<HTMLElement>(`[data-size="${item.className}"]`)
        if (!node) continue
        const style = getComputedStyle(node)
        sizes.push({
          ...item,
          fontSize: style.fontSize,
          lineHeight: style.lineHeight,
          letterSpacing: style.letterSpacing,
          px: Number.parseFloat(style.fontSize) || 0,
        })
      }
      sizes.sort((a, b) => b.px - a.px)
      setScale(sizes)

      const measuredWeights: WeightRow[] = []
      for (const item of WEIGHTS) {
        const node = probe.querySelector<HTMLElement>(`[data-weight="${item.className}"]`)
        if (!node) continue
        const style = getComputedStyle(node)
        measuredWeights.push({
          ...item,
          fontWeight: style.fontWeight,
          value: Number.parseFloat(style.fontWeight) || 0,
        })
      }
      measuredWeights.sort((a, b) => b.value - a.value)
      setWeights(measuredWeights)
    }

    const wraps = wrapRef.current
    if (wraps) {
      const rules: Record<string, string> = {}
      for (const node of wraps.querySelectorAll<HTMLElement>('[data-wrap]')) {
        const key = node.dataset.wrap
        if (!key) continue
        rules[key] = getComputedStyle(node).wordBreak
      }
      setWrapRules(rules)
    }
  }, [])

  const declaration = fontStack ? `font-family: ${fontStack};` : ''

  return (
    <DocPage
      title="Typography"
      description="어드민은 한 화면에 많은 정보를 담습니다. 크기를 늘리기보다 굵기와 색으로 위계를 만드는 편이 밀도를 지키면서 읽히게 합니다."
    >
      <DocSection title="Overview">
        <p className="text-muted-foreground text-16">
          글자 크기와 굵기로 정보 위계를 표현하는 규칙을 정합니다. 어떤 글꼴을 쓰고 한글을 어디서
          끊어 줄을 바꿀지도 여기서 정합니다. 글자에 쓰는 색은{' '}
          <Link to="/foundations/color" className="underline underline-offset-2">
            Color
          </Link>
          에서, 글줄이나 요소 사이의 여백은{' '}
          <Link to="/foundations/spacing" className="underline underline-offset-2">
            Spacing
          </Link>
          에서 다룹니다. 화면에 새 텍스트를 넣을 때 어떤 크기와 굵기를 쓸지 이 문서에서 찾습니다.
        </p>
      </DocSection>

      <DocSection title="Font">
        <p className="text-muted-foreground text-16">
          기본 글꼴은 Pretendard입니다. 어드민 화면은 한 줄에 한글과 영문, 숫자가 섞이는데 시스템
          기본 글꼴은 기기마다 달라 같은 표가 맥과 윈도우에서 다른 밀도로 보입니다. Pretendard는
          한글 자소의 크기와 무게를 고르게 맞춰 놓아 12px 언저리에서도 획이 뭉치지 않습니다. 또
          가변 폰트라 아래 Weight 네 단계가 모두 글꼴이 실제로 가진 굵기입니다 — 중간 굵기가 없는
          글꼴에서는 브라우저가 획을 부풀려 흉내 내고, 작은 글자에서 그 차이가 지저분하게
          보입니다. 자간(letter-spacing)은 이 스케일에서 건드리지 않습니다 — Pretendard는 한글
          중심 폰트라 다국어 대응 폰트만큼의 자간 미세조정이 필요하지 않습니다.
        </p>
        <p className="text-muted-foreground text-16">
          스택은 왼쪽부터 순서대로 시도하고, 앞의 글꼴에 없는 글자만 다음으로 넘어갑니다. 맨 앞 두
          자리가 Pretendard입니다 — CDN에서 받은 가변 버전을 먼저 찾고, 없으면 사용자가 직접
          설치한 정적 버전을 씁니다. 가운데는 운영체제가 정한 기본 글꼴과 라틴 글꼴 자리라 영문과
          숫자를 받습니다. 뒤쪽 세 자리는 한글 전용 폴백이고, 맨 끝 sans-serif는 앞이 모두 실패한
          경우를 위한 자리입니다. CDN이 막힌 망에서도 한글이 네모로 깨지지 않게 하는 것이 이
          순서의 목적입니다.
        </p>
        <p className="text-muted-foreground text-16">
          아래 값은 지금 이 화면의 <code>body</code>에서 실측한 것입니다. 문서에 옮겨 적은 값이
          아니라 브라우저가 실제로 적용한 스택이라 코드에 그대로 붙여 넣어도 어긋나지 않습니다.
        </p>
        <div className="flex flex-col gap-2 rounded-lg border p-4">
          <div className="flex items-center justify-between gap-3">
            <span className="text-12 text-muted-foreground font-bold tracking-widest">
              FONT STACK
            </span>
            <CopyStackButton value={declaration} />
          </div>
          <textarea
            readOnly
            rows={4}
            spellCheck={false}
            value={declaration}
            aria-label="폰트 스택 선언"
            onFocus={(event) => event.currentTarget.select()}
            className="bg-surface-raised w-full resize-y rounded-md border p-3 font-mono text-12 leading-relaxed"
          />
        </div>
      </DocSection>

      <DocSection title="Scale">
        <p className="text-muted-foreground text-16">
          제목류(다이얼로그 제목 이상)는 굵기를 semibold 이상으로 씁니다. 본문은
          normal이 기본이고 컨트롤 라벨만 한 단계 진한 medium을 씁니다. 크기
          차이가 크지 않은 자리(소제목 18px과 본문 16px)는 굵기가 실제 위계를
          만듭니다.
        </p>
        <p className="text-muted-foreground text-16">
          열두 단계로 끝냅니다. 크기·행간·자간은 화면 밖에 숨긴 요소에 각 클래스를 걸고 실측한
          값이고, 표의 순서도 실측한 크기가 정합니다 — 스케일을 바꾸면 이 표의 순서까지
          따라옵니다. 자간은 단계마다 따로 정하지 않습니다. 자간 칸의 <code>normal</code>은 그 단계에 값을
          정하지 않아 글꼴이 잡은 자간을 그대로 쓴다는 뜻입니다.
        </p>
        <p className="text-muted-foreground text-16">
          <code>text-11</code>은 예비 단계입니다. 세 조건을 모두 만족할 때만 씁니다 — ① 그 글자가
          유일한 정보원이 아니고(옆의 아이콘·색·더 큰 글자가 같은 뜻을 이미 전달해, 이 글자가 안
          읽혀도 과업을 끝낼 수 있다), ② 한두 글자 수준으로 극히 짧고, ③ 담는 그릇의 크기가 이
          시스템의 다른 규칙에 못 박혀 있습니다. "좁아 보여서"는 조건이 아닙니다 — Badge·메뉴 그룹
          라벨·요일 머리가 전에는 이 값을 썼지만 실측해 보니 셋 다 ③이 거짓이었습니다(text-12로
          올려도 안 깨졌습니다). 지금 이 조건을 통과하는 자리는 어디에도 없어, 실제로 쓰는 최소
          크기는 <code>text-12</code>부터입니다.
        </p>
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-left text-14">
            <thead>
              <tr className="text-muted-foreground text-12 tracking-widest">
                <th scope="col" className="px-3 py-2 font-bold">스타일</th>
                <th scope="col" className="px-3 py-2 font-bold">예시</th>
                <th scope="col" className="px-3 py-2 font-bold">크기</th>
                <th scope="col" className="px-3 py-2 font-bold">행간</th>
                <th scope="col" className="px-3 py-2 font-bold">자간</th>
                <th scope="col" className="px-3 py-2 font-bold">굵기</th>
                <th scope="col" className="px-3 py-2 font-bold">용도</th>
              </tr>
            </thead>
            <tbody>
              {scale.map((row) => (
                <tr key={row.className}>
                  <th scope="row" className="border-t px-3 py-2 font-medium whitespace-nowrap">
                    <code className="text-12">{row.className}</code>
                  </th>
                  <td className="border-t px-3 py-2 whitespace-nowrap">
                    <span className={row.className}>{SPECIMEN}</span>
                  </td>
                  <td className="text-muted-foreground border-t px-3 py-2 whitespace-nowrap">
                    {row.fontSize}
                  </td>
                  <td className="text-muted-foreground border-t px-3 py-2 whitespace-nowrap">
                    {row.lineHeight}
                  </td>
                  <td className="text-muted-foreground border-t px-3 py-2 whitespace-nowrap">
                    {row.letterSpacing}
                  </td>
                  <td className="text-muted-foreground border-t px-3 py-2 whitespace-nowrap">
                    {row.weight}
                  </td>
                  <td className="text-muted-foreground border-t px-3 py-2 text-12">{row.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-muted-foreground text-16">
          본문(16px) 대비 제목류 크기 비율은 소제목 1.125배부터 강조 숫자·텍스트 대 3배까지
          걸쳐 있습니다. 다이얼로그 제목(20px)부터 목록·카드 화면 제목(24px)까지는 1.25~1.5배
          사이에 모여 있지만, 상세 화면 제목(28px)부터는 1.75배 이상으로 벌어져 강조용 크기와
          가까워집니다. 소제목(18px)만 1.125배로 그 아래인데, 굵기(semibold)로 위계를
          보완했습니다. 이 문서 사이트 자체의 제목 위계는 h1(페이지 제목)·h2(절 제목)·
          h3(항목 제목) 세 단계만 씁니다 — 헤딩을 네 단계로 나누는 참고 사례도 있지만,
          여기서는 그 아래 h4까지 갈 만큼 문서 구조가 깊어지지 않습니다.
        </p>
        <p className="text-muted-foreground text-16">
          <code>text-16</code>은 두 역할을 겸합니다 — 읽는 문단이자 버튼·인풋·메뉴 항목 같은
          컨트롤 텍스트입니다. 문단의 행간(28px)을 그대로 쓰고, 컨트롤의 높이는{' '}
          <code>--spacing-control-*</code> 토큰이 따로 잡으므로 행간이 컨트롤 쪽으로 새지 않습니다.
          표 셀은 조밀 모드 전용인 <code>text-14</code>를 따로 씁니다.
        </p>
        <p className="text-muted-foreground text-16">
          크기는 열두 단계 모두 Tailwind 기본값이 아니라 이 프로젝트가 새로 정의한 값입니다.
          그래서 이 표는 강제하는 장치가 아니라 지키기로 한 약속입니다 — 새 화면을 만들 때는
          위 열두 단계 안에서 고릅니다.
        </p>
      </DocSection>

      <DocSection title="Weight">
        <p className="text-muted-foreground text-16">
          네 단계만 씁니다. 더 얇거나 더 두꺼운 단계는 본문 크기에서 차이가 거의 보이지 않으면서
          고를 것만 늘립니다. 값은 실측한 <code>font-weight</code>이고, 순서도 그 값이 정합니다.
        </p>
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-left text-14">
            <thead>
              <tr className="text-muted-foreground text-12 tracking-widest">
                <th scope="col" className="px-3 py-2 font-bold">스타일</th>
                <th scope="col" className="px-3 py-2 font-bold">예시</th>
                <th scope="col" className="px-3 py-2 font-bold">값</th>
                <th scope="col" className="px-3 py-2 font-bold">용도</th>
              </tr>
            </thead>
            <tbody>
              {weights.map((row) => (
                <tr key={row.className}>
                  <th scope="row" className="border-t px-3 py-2 font-medium whitespace-nowrap">
                    <code className="text-12">{row.className}</code>
                  </th>
                  <td className="border-t px-3 py-2 whitespace-nowrap">
                    <span className={`text-16 ${row.className}`}>{SPECIMEN}</span>
                  </td>
                  <td className="text-muted-foreground border-t px-3 py-2 whitespace-nowrap">
                    {row.fontWeight}
                  </td>
                  <td className="text-muted-foreground border-t px-3 py-2 text-12">{row.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DocSection>

      <DocSection title="Line breaking">
        <p className="text-muted-foreground text-16">
          한글은 음절 단위로 끊습니다. <code>word-break: normal</code>이 브라우저 기본값이지만{' '}
          <code>body</code>에 명시해 두어 어디서도 뒤집히지 않게 했습니다. 이 값에서 브라우저는
          한글의 음절 사이를 모두 줄을 바꿀 수 있는 자리로 봅니다.
        </p>
        <p className="text-muted-foreground text-16">
          반대 선택지는 <code>word-break: keep-all</code>입니다. 어절을 통째로 묶어 낱말이 중간에서
          잘리지 않지만, 어드민에서 글이 놓이는 자리는 사이드바·표 셀·다이얼로그처럼 좁습니다.
          거기서는 긴 어절 하나가 통째로 다음 줄로 밀리면서 앞 줄이 크게 빕니다. 낱말 하나가 온전한
          것보다 줄이 고르게 차는 쪽을 택했습니다. 띄어쓰기가 없는 URL이나 토큰은{' '}
          <code>overflow-wrap: anywhere</code>가 따로 받아 상자 밖으로 넘치지 않게 합니다.
        </p>
        <p className="text-muted-foreground text-16">
          같은 문장을 좁은 칸에 두 규칙으로 나란히 놓았습니다. 각 상자 아래 값은 그 상자에서 실측한
          것입니다.
        </p>
        <div ref={wrapRef} className="grid gap-3 md:grid-cols-2">
          {WRAP_DEMOS.map((demo) => (
            <ExampleFrame key={demo.key} kind={demo.kind}>
              <div className="flex flex-col gap-2">
                <p className="text-12 text-muted-foreground font-bold tracking-widest">
                  {demo.title}
                </p>
                <p data-wrap={demo.key} className={`max-w-40 text-16 ${demo.className}`}>
                  {WRAP_SPECIMEN}
                </p>
                {wrapRules[demo.key] && (
                  <p className="text-muted-foreground text-12">
                    <code>word-break: {wrapRules[demo.key]}</code>
                  </p>
                )}
                <p className="text-muted-foreground text-12">{demo.note}</p>
              </div>
            </ExampleFrame>
          ))}
        </div>
      </DocSection>

      <DocSection title="Guidelines">
        <p className="text-muted-foreground text-16">
          새 텍스트에 무엇을 쓸지는 아래 순서로 정합니다. 위에서부터 내려오다가 답이 나오면 거기서
          멈춥니다.
        </p>
        <ol className="flex list-decimal flex-col gap-2 rounded-lg border p-4 pl-8 text-16">
          <li>
            이 텍스트가 화면에서 몇 번째 층인지 먼저 정합니다. 한 화면에 페이지 제목 하나, 섹션
            제목 하나, 나머지는 전부 본문입니다.
          </li>
          <li>
            층이 정해지면 크기는 위 표에서 그대로 가져옵니다. 본문은 <code>text-16</code>, 설명과
            캡션은 <code>text-12</code>가 기본이라 대부분은 이 둘에서 끝납니다.
          </li>
          <li>
            같은 층 안에서 더 눈에 띄어야 하면 크기가 아니라 굵기를 한 단계 올립니다 —{' '}
            <code>font-normal</code>에서 <code>font-medium</code>으로.
          </li>
          <li>
            굵기로도 부족하면 색을 바꿉니다. 중요한 것을 키우기보다 덜 중요한 것을{' '}
            <code>text-muted-foreground</code>로 내리는 편이 밀도를 지킵니다.
          </li>
          <li>
            셋을 다 써도 안 되면 위계가 아니라 배치 문제입니다. 크기를 더 키우지 말고 순서나 그룹을
            다시 봅니다.
          </li>
        </ol>
        <p className="text-muted-foreground text-16">
          한 화면에 쓰는 크기 단계는 4개 이하로 둡니다. 어드민 화면 하나는 보통 페이지 제목·섹션
          제목·본문·보조 넷이면 충분하고, 다섯 번째 단계가 필요하다고 느끼면 그 화면이 한 페이지에
          너무 많은 것을 담고 있다는 신호입니다.
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          <ExampleFrame kind="do">
            <div className="flex flex-col gap-1">
              <p className="text-18 font-semibold">결제 실패 5건</p>
              <p className="text-16">2026-08-25 03:12에 마지막으로 발생했습니다.</p>
              <p className="text-muted-foreground text-16">
                재시도는 10분 간격으로 3회까지 자동 실행됩니다.
              </p>
            </div>
          </ExampleFrame>
          <ExampleFrame kind="dont">
            <div className="flex flex-col gap-1">
              <p className="text-32 font-bold">결제 실패 5건</p>
              <p className="text-20">2026-08-25 03:12에 마지막으로 발생했습니다.</p>
              <p className="text-14">재시도는 10분 간격으로 3회까지 자동 실행됩니다.</p>
            </div>
          </ExampleFrame>
        </div>
        <p className="text-muted-foreground text-16">
          같은 줄이나 같은 열에 놓인 숫자는 크기를 맞춥니다. 하나만 키우면 값이 커서 큰 것인지
          중요해서 큰 것인지 구분되지 않고, 자릿수를 눈으로 비교하기도 어려워집니다.
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          <ExampleFrame kind="do">
            <dl className="flex gap-6">
              {STATS.map((stat) => (
                <div key={stat.label} className="flex flex-col gap-0.5">
                  <dt className="text-muted-foreground text-12">{stat.label}</dt>
                  <dd className="text-32 font-bold">{stat.value}</dd>
                </div>
              ))}
            </dl>
          </ExampleFrame>
          <ExampleFrame kind="dont">
            <dl className="flex items-baseline gap-6">
              {STATS.map((stat, index) => (
                <div key={stat.label} className="flex flex-col gap-0.5">
                  <dt className="text-muted-foreground text-12">{stat.label}</dt>
                  <dd className={`font-semibold ${INCONSISTENT_STAT_SIZES[index]}`}>
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </ExampleFrame>
        </div>
        <p className="text-muted-foreground text-16">
          표와 목록은 본문보다 한 단계 낮은 조밀 모드(<code>text-14</code>)를
          씁니다. 머리 행은 그보다 작은 설명 크기(<code>text-12</code>)에
          굵기만 올려 구분합니다. 목록은 깊이가 있어도 크기를 줄이지 않고
          들여쓰기·마커로만 구분합니다. 자세한 값은{' '}
          <Link to="/components/data-table" className="underline underline-offset-2">
            Data Table
          </Link>
          에서 확인할 수 있습니다.
        </p>
        <DoDont
          do={[
            '위계는 크기보다 굵기와 색으로 만든다',
            '한 화면에서 크기 단계를 4개 이하로 유지한다',
            '같은 줄이나 같은 열의 숫자는 크기를 맞춘다',
            '본문은 text-16, 보조 설명은 text-12를 기본으로 둔다',
            '밑줄은 텍스트 링크에만 쓰고 강조는 굵기·색으로 한다',
          ]}
          dont={[
            '강조를 위해 크기를 계속 키우지 않는다',
            '제품 화면에서는 스케일에 없는 임의 크기를 만들지 않는다',
            '본문 문단 전체에 font-bold를 걸지 않는다',
            '읽는 글에 word-break: keep-all을 되살리지 않는다',
          ]}
        />
      </DocSection>

      {/* 측정용. 화면 밖에 두되 display:none은 쓰지 않는다 — 계산값이 나오지 않는다 */}
      <div ref={probeRef} aria-hidden className="invisible absolute h-0 w-0 overflow-hidden">
        {SCALE.map((item) => (
          <span key={item.className} data-size={item.className} className={item.className}>
            {SPECIMEN}
          </span>
        ))}
        {WEIGHTS.map((item) => (
          <span
            key={item.className}
            data-weight={item.className}
            className={`text-16 ${item.className}`}
          >
            {SPECIMEN}
          </span>
        ))}
      </div>
    </DocPage>
  )
}
