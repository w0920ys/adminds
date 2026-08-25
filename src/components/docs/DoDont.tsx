import { Check, X } from 'lucide-react'

export function DoDont({ do: dos, dont: donts }: { do: string[]; dont: string[] }) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <ul className="flex flex-col gap-2 rounded-lg border p-4">
        {dos.map((line) => (
          <li key={line} className="flex gap-2 text-sm">
            <Check size={15} className="text-success mt-0.5 shrink-0" aria-hidden />
            {line}
          </li>
        ))}
      </ul>
      <ul className="flex flex-col gap-2 rounded-lg border p-4">
        {donts.map((line) => (
          <li key={line} className="flex gap-2 text-sm">
            <X size={15} className="text-destructive mt-0.5 shrink-0" aria-hidden />
            {line}
          </li>
        ))}
      </ul>
    </div>
  )
}
