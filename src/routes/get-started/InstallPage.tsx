import { Link } from 'react-router'
import { CopyValue } from '@/components/docs/CopyValue'
import { DocPage, DocSection } from '@/components/docs/DocPage'
import { DoDont } from '@/components/docs/DoDont'
import { installCommands } from '@/routes/get-started/install-commands'

export function InstallPage() {
  return (
    <DocPage
      title="Install"
      description="이 작업대를 로컬에서 띄우는 법과, 여기서 다듬은 토큰을 실제 제품으로 가져가는 법입니다."
    >
      <DocSection title="Overview">
        <p className="text-muted-foreground text-sm">
          쓰임이 둘입니다. 하나는 이 저장소 자체를 로컬에서 띄워 컴포넌트와 문서를 보는
          것이고, 다른 하나는 여기서 정한 토큰을 실제로 화면을 만드는 제품 코드로 가져가는
          것입니다. 전자는 아래 Run locally에서, 후자는 Use the tokens에서 다룹니다.
        </p>
      </DocSection>

      <DocSection title="Run locally">
        <p className="text-muted-foreground text-sm">
          먼저 의존성을 받습니다. 이것은 이 저장소의 스크립트가 아니라 npm 자체의 명령이라
          아래 목록에는 없습니다.
        </p>
        <div className="rounded-lg border p-4">
          {/* npm install은 npm 자체의 명령이지 package.json의 scripts가 아니다.
              그래서 installCommands에 넣지 않는다 — 넣으면 테스트가 package.json에서
              그 이름을 찾다가 실패한다. */}
          <CopyValue value="npm install" className="font-mono text-sm" />
        </div>
        <p className="text-muted-foreground text-sm">
          그다음 아래 명령 중 필요한 것을 돌립니다. 이름은 <code className="text-xs">npm run</code>{' '}
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
                className="w-full shrink-0 font-mono text-sm sm:w-48"
              />
              <span className="text-muted-foreground text-sm">{command.note}</span>
            </div>
          ))}
        </div>
      </DocSection>

      <DocSection title="Use the tokens">
        <p className="text-muted-foreground text-sm">
          <code className="text-xs">src/styles/tokens.css</code>가 색·간격·radius·shadow 같은
          디자인 토큰의 단일 출처입니다. Tailwind v4의{' '}
          <code className="text-xs">@theme</code> 문법 위에 얹혀 있어서{' '}
          <code className="text-xs">globals.css</code>에서{' '}
          <code className="text-xs">@import &quot;tailwindcss&quot;</code> 뒤에 들여옵니다.
        </p>
        <p className="text-muted-foreground text-sm">
          실제 순서는{' '}
          <code className="text-xs">tailwindcss</code> →{' '}
          <code className="text-xs">tw-animate-css</code> →{' '}
          <code className="text-xs">tokens.css</code>입니다.{' '}
          <code className="text-xs">tokens.css</code>가 먼저 오면 다크 변형과 색 토큰이
          풀리지 않습니다.
        </p>
        <p className="text-muted-foreground text-sm">
          기본 글꼴은 Pretendard입니다. 자세한 스택은{' '}
          <Link to="/foundations/typography" className="underline underline-offset-2">
            Typography
          </Link>{' '}
          문서에서 다룹니다.
        </p>
        <p className="text-muted-foreground text-sm">
          이 저장소는 문서 사이트인 동시에 shadcn 레지스트리입니다. 토큰만 다른 프로젝트로
          가져가려면 아래 명령을 돌립니다.
        </p>
        <div className="max-w-full rounded-lg border p-4">
          <CopyValue
            value="npx shadcn@latest add https://adminds.vercel.app/r/tokens.json"
            className="w-full font-mono text-xs"
          />
        </div>
        <p className="text-muted-foreground text-sm">
          받는 쪽에는 Tailwind v4가 있어야 하고, 위 import 순서와 함께{' '}
          <code className="text-xs">tsconfig.json</code>의{' '}
          <code className="text-xs">paths</code>도 확인해야 합니다 — Vite 템플릿은{' '}
          <code className="text-xs">"@/*": ["./src/*"]</code>를{' '}
          <code className="text-xs">tsconfig.app.json</code>에만 두는데, 그러면 받은
          파일이 <code className="text-xs">@/</code>라는 이름의 폴더로 통째로
          떨어집니다. <code className="text-xs">baseUrl</code>은 넣지 않습니다 — TypeScript
          6에서 하드 에러입니다.
        </p>
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
