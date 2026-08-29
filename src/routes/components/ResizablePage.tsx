import type { ReactNode } from 'react'
import { Bounds } from '@/components/docs/Bounds'
import { ComponentPage } from '@/components/docs/ComponentPage'
import type { RenderOptions } from '@/components/docs/PropertyBlock'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { getComponent } from '@/data/registry'
import { Placeholder } from '@/routes/Placeholder'

function renderResizable(options: RenderOptions) {
  const orientation = options.orientation === 'vertical' ? 'vertical' : 'horizontal'
  return (
    <Bounds className={orientation === 'vertical' ? 'h-56 w-72' : 'h-40 w-72'}>
      <ResizablePanelGroup orientation={orientation} className="rounded-md border">
        <ResizablePanel defaultSize="50" minSize="20">
          <div className="text-muted-foreground flex h-full items-center justify-center text-16">A</div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize="50" minSize="20">
          <div className="text-muted-foreground flex h-full items-center justify-center text-16">B</div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </Bounds>
  )
}

function renderGuidelineExample(guidelineId: string, kind: 'do' | 'dont'): ReactNode {
  switch (guidelineId) {
    case 'min-size':
      return kind === 'do' ? (
        <Bounds className="h-32 w-64">
          <ResizablePanelGroup orientation="horizontal" className="rounded-md border">
            <ResizablePanel defaultSize="50" minSize="25">
              <div className="text-muted-foreground flex h-full items-center justify-center text-14">최소 25%</div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize="50" minSize="25">
              <div className="text-muted-foreground flex h-full items-center justify-center text-14">최소 25%</div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </Bounds>
      ) : (
        <Bounds className="h-32 w-64">
          <ResizablePanelGroup orientation="horizontal" className="rounded-md border">
            <ResizablePanel defaultSize="50">
              <div className="text-muted-foreground flex h-full items-center justify-center text-14">최소 크기 없음</div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize="50">
              <div className="text-muted-foreground flex h-full items-center justify-center text-14">최소 크기 없음</div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </Bounds>
      )
    default:
      return null
  }
}

function renderExample(exampleId: string): ReactNode {
  switch (exampleId) {
    case 'master-detail':
      return (
        <Bounds className="h-56 w-full max-w-lg">
          <ResizablePanelGroup orientation="horizontal" className="rounded-md border">
            <ResizablePanel defaultSize="35" minSize="20">
              <div className="flex h-full flex-col gap-1 p-3">
                <span className="text-16">홍길동</span>
                <span className="text-16">김철수</span>
                <span className="text-16">이영희</span>
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize="65" minSize="30">
              <div className="flex h-full flex-col gap-2 p-4">
                <strong className="text-18">홍길동</strong>
                <p className="text-muted-foreground text-16">가입일 2026-01-15</p>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </Bounds>
      )

    case 'vertical-split':
      return (
        <Bounds className="h-64 w-full max-w-lg">
          <ResizablePanelGroup orientation="vertical" className="rounded-md border">
            <ResizablePanel defaultSize="60" minSize="30">
              <div className="text-muted-foreground flex h-full items-center justify-center text-16">미리보기</div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize="40" minSize="20">
              <div className="text-muted-foreground flex h-full flex-col gap-1 overflow-y-auto p-3 text-12">
                <span>12:00:01 요청 시작</span>
                <span>12:00:02 응답 완료</span>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </Bounds>
      )

    default:
      return null
  }
}

function AnatomyPreview() {
  return (
    <Bounds className="h-40 w-72">
      <ResizablePanelGroup orientation="horizontal" className="rounded-md border">
        <ResizablePanel defaultSize="50" minSize="20">
          <div className="text-muted-foreground flex h-full items-center justify-center text-16">A</div>
        </ResizablePanel>
        <ResizableHandle withHandle data-anatomy="handle" />
        <ResizablePanel defaultSize="50" minSize="20">
          <div className="text-muted-foreground flex h-full items-center justify-center text-16">B</div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </Bounds>
  )
}

export function ResizablePage() {
  const meta = getComponent('resizable')
  if (!meta) return <Placeholder title="Resizable 메타를 찾을 수 없습니다" />

  return (
    <ComponentPage
      meta={meta}
      render={renderResizable}
      preview={<AnatomyPreview />}
      renderGuidelineExample={renderGuidelineExample}
      renderExample={renderExample}
    />
  )
}
