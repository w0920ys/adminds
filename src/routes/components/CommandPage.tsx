import { useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router'
import { Bounds } from '@/components/docs/Bounds'
import { ComponentPage } from '@/components/docs/ComponentPage'
import type { RenderOptions } from '@/components/docs/PropertyBlock'
import { isGroup, sections } from '@/components/layout/nav-config'
import { Button } from '@/components/ui/button'
import { Combobox } from '@/components/ui/combobox'
import { Command, CommandDialog, type CommandEntry } from '@/components/ui/command'
import { Field, FieldControl, FieldLabel } from '@/components/ui/field'
import { categoryLabel, components, getComponent } from '@/data/registry'
import { Placeholder } from '@/routes/Placeholder'

/*
 * 항목 목록은 데이터에서 파생한다. 손으로 적지 않는다. label은 name,
 * group은 categoryLabel[category], keywords는 aliases가 그대로 들어간다 —
 * 별칭 지침을 말로 설명하는 대신 그 자리에서 실제로 보이게 된다.
 */
const COMPONENT_ENTRIES: CommandEntry[] = components.map((component) => ({
  value: `/components/${component.id}`,
  label: component.name,
  group: categoryLabel[component.category],
  keywords: component.aliases,
}))

/** '모달'로도 닿아야 한다는 지침을 keywords 없이 흉내 낸 버전. keywords-carry-aliases의 DON'T가 쓴다 */
const NO_KEYWORD_ENTRIES: CommandEntry[] = COMPONENT_ENTRIES.map((entry) => ({
  ...entry,
  keywords: undefined,
}))

/** 이 회차에 실린 컴포넌트만 골라낸다 — addedIn이 실제로 v0.12.0인 것만, 손으로 고르지 않는다 */
const RECENT_ENTRIES: CommandEntry[] = COMPONENT_ENTRIES.filter((entry) =>
  components.some((c) => `/components/${c.id}` === entry.value && c.addedIn === 'v0.12.0'),
)

/** Navigation 묶음 하나만 남긴 목록. single-group 예시가 쓴다 */
const NAVIGATION_ENTRIES: CommandEntry[] = COMPONENT_ENTRIES.filter(
  (entry) => entry.group === categoryLabel.navigation,
)

/** Inputs 묶음 하나만 남긴 목록. groups-are-labels의 DON'T가 Navigation과 나란히 쪼개 쓴다 */
const INPUTS_ENTRIES: CommandEntry[] = COMPONENT_ENTRIES.filter(
  (entry) => entry.group === categoryLabel.inputs,
)

/*
 * Inputs와 Navigation 두 묶음을 한 목록에 합친 것. groups-are-labels의 DO가
 * 쓴다 — DON'T는 이 둘을 서로 다른 CommandDialog로 쪼개고, DO는 같은 두
 * 묶음을 한 목록 안에 이름표로만 나눈다. 같은 데이터를 합쳤는지 쪼갰는지로만
 * 갈라야 "여러 묶음을 한 목록 안에" 주장이 실제로 보인다 — 묶음이 하나뿐인
 * 목록으로는 그 주장을 보일 수 없다.
 */
const TWO_GROUP_ENTRIES: CommandEntry[] = [...INPUTS_ENTRIES, ...NAVIGATION_ENTRIES]

/** Foundations 문서도 nav-config에서 그대로 가져온다 — 손으로 적지 않는다 */
const FOUNDATION_ENTRIES: CommandEntry[] = (
  sections.find((section) => section.id === 'foundations')?.items ?? []
).flatMap((item) => (isGroup(item) ? [] : [{ value: item.to, label: item.label, group: 'Foundations' }]))

/** 컴포넌트와 Foundations 문서를 한 자리에서 함께 찾는 전역 검색 예시가 쓴다 */
const GLOBAL_SEARCH_ENTRIES: CommandEntry[] = [...COMPONENT_ENTRIES, ...FOUNDATION_ENTRIES]

/*
 * 동작(action)에는 아직 이 시스템에 데이터 원천이 없다 — Combobox 문서의
 * ASSIGNEE_OPTIONS·DEPARTMENT_OPTIONS와 같은 이유로 여기서는 손으로 적는다.
 */
const ACTION_ENTRIES: CommandEntry[] = [
  { value: 'invite', label: '팀원 초대', group: '팀' },
  { value: 'new-project', label: '새 프로젝트 만들기', group: '팀' },
  { value: 'toggle-theme', label: '다크 모드 전환', group: '환경설정' },
  { value: 'mute', label: '알림 끄기', group: '환경설정' },
  { value: 'logout', label: '로그아웃', keywords: ['sign out', '로그아웃'] },
]

const COLUMN_ENTRIES: CommandEntry[] = [
  { value: 'name', label: '이름' },
  { value: 'email', label: '이메일' },
  { value: 'joined', label: '가입일' },
  { value: 'status', label: '상태' },
  { value: 'department', label: '부서' },
]

/** Anatomy 무대 전용 작은 목록. Select·Input(Inputs)과 Tabs·Breadcrumb(Navigation) 두 묶음만 남긴다 */
const ANATOMY_ENTRIES: CommandEntry[] = ['select', 'input', 'tabs', 'breadcrumb'].map(
  (id) => COMPONENT_ENTRIES.find((entry) => entry.value === `/components/${id}`)!,
)

/*
 * 트리거 버튼 뒤에 CommandDialog를 둔다. 열린 채로 마운트하지 않는다 —
 * open은 false로 시작하고, 누르면 열린다. onSelect는 데모마다 다르지만
 * 실행한 뒤에는 항상 닫는다 — Command는 값을 쌓아 두는 대신 실행하고
 * 끝나는 표면이다.
 */
function CommandDialogDemo({
  label,
  entries,
  placeholder,
  emptyMessage,
  defaultQuery,
  onSelect,
}: {
  label: string
  entries: CommandEntry[]
  placeholder?: string
  emptyMessage?: string
  defaultQuery?: string
  onSelect?: (entry: CommandEntry) => void
}) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        {label}
      </Button>
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        entries={entries}
        placeholder={placeholder}
        emptyMessage={emptyMessage}
        defaultQuery={defaultQuery}
        onSelect={(entry) => {
          onSelect?.(entry)
          setOpen(false)
        }}
      />
    </>
  )
}

/*
 * 'tab'은 Table과 Tabs 둘에만 걸린다(레지스트리 이름·별칭을 직접 확인했다).
 * 'zzzzz'는 어떤 이름·별칭에도 없어 항상 빈 결과를 만든다.
 */
function renderCommand(options: RenderOptions) {
  const { state } = options
  const defaultQuery = state === 'filtered' ? 'tab' : state === 'empty' ? 'zzzzz' : ''

  return (
    <Command
      key={state}
      entries={COMPONENT_ENTRIES}
      defaultQuery={defaultQuery}
      className="w-full max-w-sm rounded-lg border"
    />
  )
}

function renderGuidelineExample(guidelineId: string, kind: 'do' | 'dont'): ReactNode {
  switch (guidelineId) {
    /*
     * DO는 Command로 동작을 곧장 실행한다. DON'T는 같은 동작 목록을
     * Combobox에 얹은 경우다 — Combobox 자신은 멀쩡히 동작하지만(고른
     * 문구가 트리거에 남는다), 그 자리는 폼에 담을 값이 아니라 실행할
     * 동작이라 고른 뒤에도 트리거에 그 이름이 눌러앉는 것이 어색해진다.
     */
    case 'distinguish-combobox':
      return kind === 'do' ? (
        <CommandDialogDemo label="동작 실행" entries={ACTION_ENTRIES} placeholder="실행할 동작 검색" />
      ) : (
        <Field className="w-44">
          <FieldLabel>동작</FieldLabel>
          <FieldControl>
            <Combobox options={ACTION_ENTRIES} placeholder="실행할 동작 선택" className="w-full" />
          </FieldControl>
        </Field>
      )

    /* 둘 다 정말 실행되는 CommandDialog다. 다른 것은 빈 질의일 때 건네는 entries뿐이다 */
    case 'empty-state-teaches':
      return kind === 'do' ? (
        <CommandDialogDemo label="빠른 이동" entries={RECENT_ENTRIES} placeholder="컴포넌트 검색" />
      ) : (
        <CommandDialogDemo label="빠른 이동" entries={COMPONENT_ENTRIES} placeholder="컴포넌트 검색" />
      )

    /*
     * DO는 두 묶음이 한 Command 안에 이름표로만 나뉜다 — 위아래 이동이
     * 묶음 경계를 넘어 이어진다(소스로 확인했다. 브라우저 하네스로는
     * 확인할 수 없다). DON'T는 같은 두 묶음을 서로 다른 CommandDialog
     * 둘로 쪼갠 경우다 — 아래 묶음에 손이 닿으려면 아예 다른 표면을
     * 다시 열어야 한다.
     */
    case 'groups-are-labels':
      return kind === 'do' ? (
        <CommandDialogDemo label="빠른 이동" entries={TWO_GROUP_ENTRIES} placeholder="컴포넌트 검색" />
      ) : (
        <div className="flex flex-wrap gap-2">
          <CommandDialogDemo label="Inputs 이동" entries={INPUTS_ENTRIES} placeholder="Inputs 검색" />
          <CommandDialogDemo
            label="Navigation 이동"
            entries={NAVIGATION_ENTRIES}
            placeholder="Navigation 검색"
          />
        </div>
      )

    /*
     * DO는 keywords에 별칭을 태운 COMPONENT_ENTRIES라 '모달'로 열어도
     * Dialog가 걸린다(레지스트리에서 '모달'을 쥔 것은 Dialog뿐임을
     * 확인했다). DON'T는 keywords를 뺀 같은 목록이라 이름(Dialog)에는
     * 없는 '모달'로 열면 결과가 없다 — filterCommandEntries가 label과
     * keywords만 훑고 value는 보지 않는다는 규칙 그대로다.
     */
    case 'keywords-carry-aliases':
      return kind === 'do' ? (
        <CommandDialogDemo
          label="빠른 이동"
          entries={COMPONENT_ENTRIES}
          placeholder="컴포넌트 검색"
          defaultQuery="모달"
        />
      ) : (
        <CommandDialogDemo
          label="빠른 이동"
          entries={NO_KEYWORD_ENTRIES}
          placeholder="컴포넌트 검색"
          defaultQuery="모달"
        />
      )

    default:
      return null
  }
}

/*
 * useNavigate는 훅이라 render* 함수의 switch case 안에서 직접 부를 수
 * 없다(호출 규칙 위반). 이름 있는 컴포넌트로 감싸 안에서 부른다 —
 * ColumnPickerExample이 useState를 그렇게 감싸는 것과 같은 이유다.
 */
function QuickNavigationExample() {
  const navigate = useNavigate()
  return (
    <CommandDialogDemo
      label="빠른 이동"
      entries={COMPONENT_ENTRIES}
      placeholder="컴포넌트 검색"
      onSelect={(entry) => navigate(entry.value)}
    />
  )
}

function GlobalSearchExample() {
  const navigate = useNavigate()
  return (
    <CommandDialogDemo
      label="전역 검색"
      entries={GLOBAL_SEARCH_ENTRIES}
      placeholder="컴포넌트·문서 검색"
      onSelect={(entry) => navigate(entry.value)}
    />
  )
}

function ColumnPickerExample() {
  const [hidden, setHidden] = useState<Set<string>>(new Set())

  return (
    <div className="flex flex-col items-start gap-2">
      <CommandDialogDemo
        label="보일 열 고르기"
        entries={COLUMN_ENTRIES}
        placeholder="열 이름 검색"
        onSelect={(entry) =>
          setHidden((prev) => {
            const next = new Set(prev)
            if (next.has(entry.value)) next.delete(entry.value)
            else next.add(entry.value)
            return next
          })
        }
      />
      <p className="text-muted-foreground text-xs">
        {hidden.size === 0
          ? '모든 열이 보입니다'
          : `숨긴 열: ${COLUMN_ENTRIES.filter((c) => hidden.has(c.value))
              .map((c) => c.label)
              .join(', ')}`}
      </p>
    </div>
  )
}

function renderExample(exampleId: string): ReactNode {
  switch (exampleId) {
    case 'quick-navigation':
      return <QuickNavigationExample />

    case 'run-action':
      return <CommandDialogDemo label="동작 실행" entries={ACTION_ENTRIES} placeholder="실행할 동작 검색" />

    case 'column-picker':
      return <ColumnPickerExample />

    case 'global-search':
      return <GlobalSearchExample />

    case 'no-results':
      return (
        <CommandDialogDemo
          label="빠른 이동"
          entries={COMPONENT_ENTRIES}
          placeholder="컴포넌트 검색"
          emptyMessage="검색 결과가 없습니다. 다른 검색어로 다시 찾아보세요."
          defaultQuery="zzzzz"
        />
      )

    case 'many-entries':
      return <CommandDialogDemo label="빠른 이동" entries={COMPONENT_ENTRIES} placeholder="컴포넌트 검색" />

    case 'single-group':
      return (
        <CommandDialogDemo label="Navigation 이동" entries={NAVIGATION_ENTRIES} placeholder="컴포넌트 검색" />
      )

    case 'narrow-screen':
      return (
        <Bounds className="w-56">
          <Command entries={NAVIGATION_ENTRIES} placeholder="컴포넌트 검색" className="w-full rounded-lg border" />
        </Bounds>
      )

    default:
      return null
  }
}

/*
 * 무대에는 Search·List·Group label·Item 넷이 담긴다. Empty message는
 * 담기지 않는다 — 결과가 있는 상태에서는 나타나지 않는 부위라(Breadcrumb의
 * collapsed와 같은 이유로 optional) 실제로 나타나는 상태를 무대에 놓았다.
 * meta.anatomy의 다섯 번째 설명글은 그대로 남아 부위를 글로 설명한다.
 */
function AnatomyPreview() {
  return (
    <div className="w-full max-w-sm">
      <Command
        entries={ANATOMY_ENTRIES}
        searchProps={{ 'data-anatomy': 'search' }}
        listProps={{ 'data-anatomy': 'list' }}
        groupLabelProps={{ 'data-anatomy': 'group-label' }}
        itemProps={{ 'data-anatomy': 'item' }}
        className="rounded-lg border"
      />
    </div>
  )
}

export function CommandPage() {
  const meta = getComponent('command')
  if (!meta) return <Placeholder title="Command 메타를 찾을 수 없습니다" />

  return (
    <ComponentPage
      meta={meta}
      render={renderCommand}
      preview={<AnatomyPreview />}
      renderGuidelineExample={renderGuidelineExample}
      renderExample={renderExample}
    />
  )
}
