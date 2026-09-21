export function SectionStub({
  eyebrow,
  title,
  description,
  items,
}: {
  eyebrow: string
  title: string
  description: string
  items?: string[]
}) {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <p className="font-mono text-xs uppercase tracking-[0.14em] text-verdex-green">{eyebrow}</p>
      <h1 className="mt-3 font-serif text-4xl text-verdex-ink">{title}</h1>
      <p className="mt-4 text-verdex-ink-3">{description}</p>
      {items && items.length > 0 && (
        <ul className="mt-8 space-y-2.5 border-t border-verdex-rule pt-6">
          {items.map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-sm text-verdex-ink-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-verdex-green" />
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
