import { Link } from 'react-router'
import { CopyValue } from '@/components/docs/CopyValue'
import { DocPage, DocSection } from '@/components/docs/DocPage'
import { DoDont } from '@/components/docs/DoDont'
import { categoryLabel, componentsByCategory } from '@/data/registry'
import { installCommands } from '@/routes/get-started/install-commands'

export function InstallPage() {
  return (
    <DocPage
      title="Install"
      description="이 작업대를 로컬에서 띄우는 법, 컴포넌트를 실제 제품으로 가져가는 법, 그리고 이 모두를 AI 에이전트에게 그대로 보여주는 법입니다."
    >
      <DocSection title="Overview">
        <p className="text-muted-foreground text-16">
          쓰임이 넷입니다. 이 저장소 자체를 로컬에서 띄워 컴포넌트와 문서를 보는 것, 여기서
          다듬은 컴포넌트와 토큰을 실제 제품 코드로 가져가는 것, 지금 무엇이 있는지 한눈에
          훑는 것, 그리고 이 모두를 사람 대신 AI 에이전트에게 보여주는 것입니다. 차례로
          아래 Run locally, 컴포넌트를 프로젝트로 가져오기, Components, AI 에이전트에게
          보여주기에서 다룹니다.
        </p>
      </DocSection>

      <DocSection title="AI 에이전트에게 보여주기">
        <p className="text-muted-foreground text-16">
          이 사이트는 서버 렌더링이 없는 SPA입니다. AI 에이전트가 이 페이지 주소를 JS 실행
          없이 그대로 가져가면(예: curl) 내용이 빈 HTML 껍데기만 받습니다. 같은 내용을 순수
          텍스트로 담아 둔 파일이 <code className="text-12">/llms.txt</code>입니다 — 이
          저장소의 정체, 설치 명령 세 가지, 컴포넌트 40개 목록을 registry.ts에서 그대로
          생성합니다.
        </p>
        <div className="max-w-full rounded-lg border p-4">
          <CopyValue value="https://adminds.vercel.app/llms.txt" className="w-full font-mono text-12" />
        </div>
        <p className="text-muted-foreground text-16">
          다른 프로젝트에 이 디자인 시스템을 들이려는 AI 에이전트에게는 위 주소를 그대로
          건네면 됩니다.
        </p>
      </DocSection>

      <DocSection title="Run locally">
        <p className="text-muted-foreground text-16">
          먼저 의존성을 받습니다. 이것은 이 저장소의 스크립트가 아니라 npm 자체의 명령이라
          아래 목록에는 없습니다.
        </p>
        <div className="rounded-lg border p-4">
          {/* npm install은 npm 자체의 명령이지 package.json의 scripts가 아니다.
              그래서 installCommands에 넣지 않는다 — 넣으면 테스트가 package.json에서
              그 이름을 찾다가 실패한다. */}
          <CopyValue value="npm install" className="font-mono text-16" />
        </div>
        <p className="text-muted-foreground text-16">
          그다음 아래 명령 중 필요한 것을 돌립니다. 이름은 <code className="text-12">npm run</code>{' '}
          뒤에 그대로 붙입니다.
        </p>
        <div className="divide-y rounded-lg border">
          {installCommands.map((command) => (
            <div
              key={command.script}
              className="flex flex-col gap-1.5 p-4 sm:flex-row sm:items-baseline sm:gap-4"
            >
              <CopyValue
                value={`npm run ${command.script}`}
                className="w-full shrink-0 font-mono text-16 sm:w-48"
              />
              <span className="text-muted-foreground text-16">{command.note}</span>
            </div>
          ))}
        </div>
      </DocSection>

      <DocSection title="컴포넌트를 프로젝트로 가져오기">
        <p className="text-muted-foreground text-16">
          <code className="text-12">src/styles/tokens.css</code>가 색·간격·radius·shadow 같은
          디자인 토큰의 단일 출처입니다. Tailwind v4의{' '}
          <code className="text-12">@theme</code> 문법 위에 얹혀 있어서{' '}
          <code className="text-12">globals.css</code>에서{' '}
          <code className="text-12">@import &quot;tailwindcss&quot;</code> 뒤에 들여옵니다.
        </p>
        <p className="text-muted-foreground text-16">
          실제 순서는{' '}
          <code className="text-12">tailwindcss</code> →{' '}
          <code className="text-12">tw-animate-css</code> →{' '}
          <code className="text-12">tokens.css</code>입니다.{' '}
          <code className="text-12">tokens.css</code>가 먼저 오면 다크 변형과 색 토큰이
          풀리지 않습니다.
        </p>
        <p className="text-muted-foreground text-16">
          기본 글꼴은 Pretendard입니다. 자세한 스택은{' '}
          <Link to="/foundations/typography" className="underline underline-offset-2">
            Typography
          </Link>{' '}
          문서에서 다룹니다.
        </p>
        <p className="text-muted-foreground text-16">
          이 저장소는 문서 사이트인 동시에 shadcn 레지스트리입니다. 받는 범위에 따라 명령이
          셋으로 갈립니다.
        </p>
        <div className="divide-y rounded-lg border">
          <div className="flex flex-col gap-1.5 p-4">
            <span className="text-muted-foreground text-12">컴포넌트 하나만 — 아래 Components 목록의 이름을 그대로 넣습니다</span>
            <CopyValue value="npx shadcn@latest add https://adminds.vercel.app/r/button.json" className="w-full font-mono text-12" />
          </div>
          <div className="flex flex-col gap-1.5 p-4">
            <span className="text-muted-foreground text-12">토큰만</span>
            <CopyValue value="npx shadcn@latest add https://adminds.vercel.app/r/tokens.json" className="w-full font-mono text-12" />
          </div>
          <div className="flex flex-col gap-1.5 p-4">
            <span className="text-muted-foreground text-12">토큰과 컴포넌트 전부</span>
            <CopyValue value="npx shadcn@latest add https://adminds.vercel.app/r/adminds.json" className="w-full font-mono text-12" />
          </div>
        </div>
        <p className="text-muted-foreground text-16">
          받는 쪽에는 Tailwind v4가 있어야 하고, 위 import 순서와 함께{' '}
          <code className="text-12">tsconfig.json</code>의{' '}
          <code className="text-12">paths</code>도 확인해야 합니다 — Vite 템플릿은{' '}
          <code className="text-12">"@/*": ["./src/*"]</code>를{' '}
          <code className="text-12">tsconfig.app.json</code>에만 두는데, 그러면 받은
          파일이 <code className="text-12">@/</code>라는 이름의 폴더로 통째로
          떨어집니다. <code className="text-12">baseUrl</code>은 넣지 않습니다 — TypeScript
          6에서 하드 에러입니다.
        </p>
      </DocSection>

      <DocSection title="Components">
        <p className="text-muted-foreground text-16">
          지금 있는 컴포넌트 전체입니다. 부위·속성·가이드라인까지 보려면{' '}
          <Link to="/components" className="underline underline-offset-2">
            Components
          </Link>{' '}
          문서에서 하나씩 확인합니다.
        </p>
        {componentsByCategory().map(({ category, items }) => (
          <div key={category} className="flex flex-col gap-2">
            <h3 className="text-14 font-semibold">{categoryLabel[category]}</h3>
            <ul className="divide-y rounded-lg border">
              {items.map((meta) => (
                <li key={meta.id}>
                  <Link to={`/components/${meta.id}`} className="hover:bg-accent/50 flex flex-col gap-0.5 p-3">
                    <span className="text-14 font-medium">{meta.name}</span>
                    <span className="text-muted-foreground line-clamp-1 text-12">{meta.purpose}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </DocSection>

      <DocSection title="Guidelines">
        <DoDont
          do={[
            '색·간격·radius·shadow는 tokens.css의 토큰을 통해서만 쓴다',
            '컨트롤 높이는 --spacing-control 계열(--spacing-control-sm · --spacing-control · --spacing-control-lg)을 쓴다',
            '값이 아닌 임의 셀렉터 변형([&_svg]:size-4)은 써도 된다',
          ]}
          dont={[
            '원시값을 직접 쓴다',
            '토큰 이름을 바꾼다',
            '임의 값 대괄호 표기([3px] · [#abc])를 쓴다',
          ]}
        />
      </DocSection>
    </DocPage>
  )
}
