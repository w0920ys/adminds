import type { Example } from '@/data/registry'

export function ExampleList({ examples }: { examples: Example[] }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {examples.map((example) => (
        <li key={example.title} className="rounded-lg border p-4">
          <strong className="text-sm">{example.title}</strong>
          <p className="text-muted-foreground mt-1 text-xs">{example.note}</p>
        </li>
      ))}
    </ul>
  )
}
