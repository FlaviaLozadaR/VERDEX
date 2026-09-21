"use client"

import { useState } from "react"
import Link from "next/link"

const LINKS = [
  { href: "/empresas", label: "Empresas" },
  { href: "/recicladores", label: "Recicladores" },
  { href: "/impacto", label: "Impacto" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/contacto", label: "Contacto" },
]

export function MarketingNav() {
  const [open, setOpen] = useState(false)

  return (
    <header className="border-b border-verdex-rule">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 font-serif text-xl text-verdex-ink" onClick={() => setOpen(false)}>
          <span className="inline-block h-6 w-6 rounded-md bg-verdex-green" aria-hidden="true" />
          Verdex
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-verdex-ink-2 md:flex">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-verdex-ink">
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="rounded-full bg-verdex-green px-4 py-2 text-sm font-medium text-white transition hover:bg-verdex-green-deep"
          >
            Ingresar
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
            className="-mr-2 flex h-9 w-9 items-center justify-center rounded-lg text-verdex-ink transition-colors hover:bg-verdex-bg-2 md:hidden"
          >
            {open ? (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M1 1l16 16M17 1L1 17" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="18" height="14" viewBox="0 0 18 14" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M0 1h18M0 7h18M0 13h18" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-verdex-rule px-6 py-3 md:hidden">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-2 py-2.5 text-sm text-verdex-ink-2 transition-colors hover:bg-verdex-bg-2 hover:text-verdex-ink"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  )
}
