import type { ReactNode } from 'react'
import { Loader2, OctagonAlert } from 'lucide-react'
import { PatternPage } from '@/components/docs/PatternPage'
import { Alert, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Field, FieldControl, FieldError, FieldHelp, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { getPattern } from '@/data/patterns'
import { Placeholder } from '@/routes/Placeholder'

/*
 * 사용자 등록 화면 하나. Field가 라벨·컨트롤·도움말·오류를 잇는다.
 * htmlFor도 aria-describedby도 손으로 쓰지 않는다.
 */
function FormExample() {
  return (
    <form className="flex max-w-md flex-col gap-5" onSubmit={(event) => event.preventDefault()}>
      <Field>
        <FieldLabel>이름</FieldLabel>
        <FieldControl>
          <Input placeholder="홍길동" />
        </FieldControl>
        <FieldHelp>실명을 씁니다. 목록과 알림에 이 이름이 나옵니다.</FieldHelp>
      </Field>

      <Field state="error">
        <FieldLabel>이메일</FieldLabel>
        <FieldControl>
          <Input type="email" defaultValue="hong@" />
        </FieldControl>
        <FieldHelp>로그인에 쓰는 주소입니다.</FieldHelp>
        <FieldError>이메일 형식이 아닙니다.</FieldError>
      </Field>

      {/*
       * SelectTrigger가 실제로 렌더링되는 노드다 — FieldControl은 그
       * 노드를 감싼다. Select 루트(SelectPrimitive.Root)는 자기 노드를
       * 그리지 않으므로 FieldControl이 감싸면 id가 갈 곳을 잃는다.
       */}
      <Field>
        <FieldLabel>권한</FieldLabel>
        <Select>
          <FieldControl>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="권한을 고르세요" />
            </SelectTrigger>
          </FieldControl>
          <SelectContent>
            <SelectItem value="admin">관리자</SelectItem>
            <SelectItem value="editor">편집자</SelectItem>
            <SelectItem value="viewer">뷰어</SelectItem>
          </SelectContent>
        </Select>
        <FieldHelp>나중에 상세 화면에서 바꿀 수 있습니다.</FieldHelp>
      </Field>

      <Field>
        <FieldLabel>메모</FieldLabel>
        <FieldControl>
          <Textarea rows={3} />
        </FieldControl>
      </Field>

      {/*
       * 이 화면에서 Field 없이 쓰는 유일한 자리다. 라벨이 컨트롤
       * 오른쪽에 오는 배치라 Field의 stacked·horizontal 어느 쪽 grid도
       * 아니다. htmlFor와 id를 여기서만 직접 짝짓는다.
       */}
      <div className="flex items-center gap-2">
        <Checkbox id="form-pattern-notify" />
        <label htmlFor="form-pattern-notify" className="text-sm">
          가입 안내 메일을 보냅니다
        </label>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline">
          취소
        </Button>
        <Button type="submit">저장</Button>
      </div>
    </form>
  )
}

function renderGuidelineExample(guidelineId: string, kind: 'do' | 'dont'): ReactNode {
  switch (guidelineId) {
    case 'label-above-control':
      // do: stacked 배치, 라벨이 좁은 폭에서도 컨트롤 폭을 정하지 않는다.
      // dont: horizontal 배치에 긴 라벨이 섞여 라벨 열이 넓게 벌어진다.
      return kind === 'do' ? (
        <Field className="w-56">
          <FieldLabel>담당자</FieldLabel>
          <FieldControl>
            <Input placeholder="김서연" />
          </FieldControl>
        </Field>
      ) : (
        <Field layout="horizontal" className="w-full max-w-80">
          <FieldLabel className="w-32">고객사 담당자 이메일 주소</FieldLabel>
          <FieldControl>
            <Input placeholder="hong@example.com" />
          </FieldControl>
        </Field>
      )

    case 'help-before-error-after':
      // do: 도움말을 남긴 채 그 아래에 오류를 더한다.
      // dont: 오류가 나며 도움말이 사라져 무엇을 지켜야 했는지 보이지 않는다.
      return kind === 'do' ? (
        <Field state="error" className="w-64">
          <FieldLabel>이메일</FieldLabel>
          <FieldControl>
            <Input defaultValue="hong@" />
          </FieldControl>
          <FieldHelp>로그인에 쓰는 주소입니다.</FieldHelp>
          <FieldError>이메일 형식이 아닙니다.</FieldError>
        </Field>
      ) : (
        <Field state="error" className="w-64">
          <FieldLabel>이메일</FieldLabel>
          <FieldControl>
            <Input defaultValue="hong@" />
          </FieldControl>
          <FieldError>이메일 형식이 아닙니다.</FieldError>
        </Field>
      )

    case 'save-right-cancel-left':
      // do: 취소는 왼쪽, 저장은 읽는 방향의 끝인 오른쪽.
      // dont: 저장이 왼쪽에 있다.
      return kind === 'do' ? (
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm">
            취소
          </Button>
          <Button size="sm">저장</Button>
        </div>
      ) : (
        <div className="flex justify-between gap-2">
          <Button size="sm">저장</Button>
          <Button variant="outline" size="sm">
            취소
          </Button>
        </div>
      )

    case 'switch-vs-checkbox':
      // do: 저장 버튼이 있는 폼 안이라 Checkbox — 값은 저장을 눌러야 반영된다.
      // dont: 같은 자리에 Switch를 두면 누르는 순간 반영된 것처럼 보이는데
      // 옆의 저장 버튼은 아직 누르지 않은 값이 있다고 말한다.
      return kind === 'do' ? (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Checkbox id="form-pattern-agree-do" />
            <label htmlFor="form-pattern-agree-do" className="text-sm">
              가입 안내 메일을 보냅니다
            </label>
          </div>
          <div className="flex justify-end">
            <Button size="sm">저장</Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Switch id="form-pattern-agree-dont" />
            <label htmlFor="form-pattern-agree-dont" className="text-sm">
              가입 안내 메일을 보냅니다
            </label>
          </div>
          <div className="flex justify-end">
            <Button size="sm">저장</Button>
          </div>
        </div>
      )

    default:
      return null
  }
}

type FormErrorEntry = { field: string; message: string }

/** 오류 문구는 각 Field가 갖고, Alert의 제목은 이 배열의 길이에서 몇 건인지를 센다 */
const MULTIPLE_ERRORS: FormErrorEntry[] = [
  { field: '이름', message: '이름을 입력하세요' },
  { field: '이메일', message: '이메일 형식이 아닙니다' },
]

/** multiple-errors: 각 Field가 자기 오류를 갖고, 위의 Alert가 몇 건인지 한 번 더 보인다 */
function MultipleErrorsCase() {
  return (
    <div className="flex max-w-sm flex-col gap-4">
      <Alert variant="destructive">
        <OctagonAlert aria-hidden />
        <AlertTitle>입력한 값 중 {MULTIPLE_ERRORS.length}건에 오류가 있습니다</AlertTitle>
      </Alert>
      {MULTIPLE_ERRORS.map((error) => (
        <Field key={error.field} state="error">
          <FieldLabel>{error.field}</FieldLabel>
          <FieldControl>
            <Input />
          </FieldControl>
          <FieldError>{error.message}</FieldError>
        </Field>
      ))}
    </div>
  )
}

/** saving: 저장 버튼을 비활성으로 두고 무엇이 진행 중인지 적는다 */
function SavingCase() {
  return (
    <div className="flex justify-end gap-2">
      <Button type="button" variant="outline" disabled>
        취소
      </Button>
      <Button disabled>
        <Loader2 className="animate-spin" aria-hidden />
        저장 중
      </Button>
    </div>
  )
}

/*
 * unsaved-changes: 닫힌 Dialog를 DialogTrigger로 연다. 삭제 확인과
 * 달리 되돌릴 수 없는 동작이 아니므로 destructive 버튼을 쓰지 않는다.
 */
function UnsavedChangesCase() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          나가기
        </Button>
      </DialogTrigger>
      <DialogContent size="sm">
        <DialogHeader>
          <DialogTitle>저장하지 않은 변경 사항이 있습니다</DialogTitle>
          <DialogDescription>지금 나가면 입력한 내용이 사라집니다.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">계속 작성</Button>
          </DialogClose>
          <Button>나가기</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

/** narrow-screen: 컨트롤이 한 열로 쌓이고 저장·취소가 가로폭을 채운다. 순서는 save-right-cancel-left와 같다 */
function NarrowScreenCase() {
  return (
    <div className="flex flex-col gap-2">
      <div className="max-w-xs rounded-md border border-dashed p-3">
        <form className="flex flex-col gap-4" onSubmit={(event) => event.preventDefault()}>
          <Field>
            <FieldLabel>이름</FieldLabel>
            <FieldControl>
              <Input placeholder="홍길동" />
            </FieldControl>
          </Field>
          <Field>
            <FieldLabel>이메일</FieldLabel>
            <FieldControl>
              <Input type="email" placeholder="hong@example.com" />
            </FieldControl>
          </Field>
          <div className="flex gap-2">
            <Button type="button" variant="outline" className="flex-1">
              취소
            </Button>
            <Button type="submit" className="flex-1">
              저장
            </Button>
          </div>
        </form>
      </div>
      <p className="text-muted-foreground text-2xs">
        점선은 화면 폭입니다. 컨트롤은 한 열로 쌓이고 저장·취소가 가로폭을 채웁니다.
      </p>
    </div>
  )
}

function renderCase(caseId: string): ReactNode {
  switch (caseId) {
    case 'multiple-errors':
      return <MultipleErrorsCase />
    case 'saving':
      return <SavingCase />
    case 'unsaved-changes':
      return <UnsavedChangesCase />
    case 'narrow-screen':
      return <NarrowScreenCase />
    default:
      return null
  }
}

export function FormPatternPage() {
  const meta = getPattern('form')
  if (!meta) return <Placeholder title="Form 패턴 메타를 찾을 수 없습니다" />

  return (
    <PatternPage
      meta={meta}
      example={<FormExample />}
      renderGuidelineExample={renderGuidelineExample}
      renderCase={renderCase}
    />
  )
}
