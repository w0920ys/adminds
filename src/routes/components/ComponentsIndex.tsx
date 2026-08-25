import { Link } from 'react-router'
import { components } from '@/data/registry'

export function ComponentsIndex() {
  return (
    <div className="flex max-w-5xl flex-col gap-4">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Components</h1>
        <p className="text-muted-foreground text-sm">
          등록된 컴포넌트 {components.length}개
        </p>
      </header>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {components.map((meta) => (
          <li key={meta.id}>
            <Link
              to={`/components/${meta.id}`}
              className="hover:bg-accent/50 block rounded-lg border p-4"
            >
              <strong className="text-sm">{meta.name}</strong>
              <p className="text-muted-foreground mt-1 line-clamp-2 text-xs">{meta.purpose}</p>
              <span className="text-muted-foreground mt-2 block text-2xs">
                {meta.status} · {meta.changedIn}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
