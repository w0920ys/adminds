import type { ReactNode } from 'react'
import { Copy, FileText, Redo2, Save, Scissors, Undo2 } from 'lucide-react'
import { ComponentPage } from '@/components/docs/ComponentPage'
import type { RenderOptions } from '@/components/docs/PropertyBlock'
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from '@/components/ui/menubar'
import { getComponent } from '@/data/registry'
import { Placeholder } from '@/routes/Placeholder'

function renderMenubar(options: RenderOptions) {
  const disabled = options.state === 'disabled'
  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger disabled={disabled}>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            <FileText />
            새로 만들기
          </MenubarItem>
          <MenubarItem>
            <Save />
            저장
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger disabled={disabled}>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            <Undo2 />
            실행 취소
          </MenubarItem>
          <MenubarItem>
            <Redo2 />
            다시 실행
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}

function renderGuidelineExample(guidelineId: string, kind: 'do' | 'dont'): ReactNode {
  switch (guidelineId) {
    case 'few-top-level-menus':
      return kind === 'do' ? (
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>File</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>새로 만들기</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>Edit</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>실행 취소</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>View</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>확대</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      ) : (
        <div className="flex flex-col gap-1">
          <Menubar>
            <MenubarMenu>
              <MenubarTrigger>File</MenubarTrigger>
              <MenubarContent>
                <MenubarItem>새로 만들기</MenubarItem>
              </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger>Edit</MenubarTrigger>
              <MenubarContent>
                <MenubarItem>실행 취소</MenubarItem>
              </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger>View</MenubarTrigger>
              <MenubarContent>
                <MenubarItem>확대</MenubarItem>
              </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger>Insert</MenubarTrigger>
              <MenubarContent>
                <MenubarItem>표</MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
          <Menubar>
            <MenubarMenu>
              <MenubarTrigger>Format</MenubarTrigger>
              <MenubarContent>
                <MenubarItem>굵게</MenubarItem>
              </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger>Tools</MenubarTrigger>
              <MenubarContent>
                <MenubarItem>맞춤법 검사</MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        </div>
      )
    default:
      return null
  }
}

function renderExample(exampleId: string): ReactNode {
  switch (exampleId) {
    case 'app-shell':
      return (
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>File</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>
                <FileText />
                새로 만들기
              </MenubarItem>
              <MenubarItem>
                <Save />
                저장
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>Edit</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>
                <Undo2 />
                실행 취소
              </MenubarItem>
              <MenubarItem>
                <Redo2 />
                다시 실행
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem>
                <Scissors />
                잘라내기
              </MenubarItem>
              <MenubarItem>
                <Copy />
                복사
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>View</MenubarTrigger>
            <MenubarContent>
              <MenubarCheckboxItem checked>확대/축소 표시</MenubarCheckboxItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      )

    case 'disabled-menu':
      return (
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>File</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>
                <FileText />
                새로 만들기
              </MenubarItem>
              <MenubarItem disabled>
                <Save />
                저장(문서 없음)
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      )

    default:
      return null
  }
}

function AnatomyPreview() {
  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger data-anatomy="trigger">File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            <FileText />
            새로 만들기
          </MenubarItem>
          <MenubarItem>
            <Save />
            저장
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            <Undo2 />
            실행 취소
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}

export function MenubarPage() {
  const meta = getComponent('menubar')
  if (!meta) return <Placeholder title="Menubar 메타를 찾을 수 없습니다" />

  return (
    <ComponentPage
      meta={meta}
      render={renderMenubar}
      preview={<AnatomyPreview />}
      renderGuidelineExample={renderGuidelineExample}
      renderExample={renderExample}
    />
  )
}
