"use client"

import { useState, type ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

// `icon` is a pre-rendered element (e.g. `<Users size={18} />`), not a component
// reference — Next.js doesn't allow passing component references as props from
// a Server Component (the layout files) into a Client Component (this one).
// Color comes for free: lucide icons default to stroke="currentColor", so they
// pick up whatever text color class wraps them.
export type RoleNavItem = { href: string; label: string; icon?: ReactNode }

function navLinkClass(active: boolean) {
  return (
    "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-verdex-green " +
    (active
      ? "bg-verdex-green-soft font-medium text-verdex-green-deep"
      : "text-verdex-ink-2 hover:bg-verdex-bg-2 hover:text-verdex-ink")
  )
}

export function RoleShell({
  brand,
  navItems,
  mobileNav = "menu",
  children,
}: {
  brand: string
  navItems: RoleNavItem[]
  /** "menu" = hamburger + dropdown (admin: too many sections for a bottom bar).
   *  "tabs" = fixed bottom tab bar, one slot per item (empresa: exactly 5 sections). */
  mobileNav?: "menu" | "tabs"
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <div className="flex min-h-full flex-col md:flex-row">
      {/* Mobile top bar — plain logo for "tabs" (nav lives in the bottom bar instead),
          logo + hamburger for "menu". */}
      <div className="flex items-center justify-between border-b border-verdex-rule bg-verdex-paper px-4 py-3 md:hidden">
        <Link href="/" className="flex items-center gap-2 font-serif text-lg text-verdex-ink" onClick={() => setOpen(false)}>
          <span className="inline-block h-5 w-5 rounded-md bg-verdex-green" aria-hidden="true" />
          Verdex
        </Link>
        {mobileNav === "menu" && (
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-verdex-ink transition-colors hover:bg-verdex-bg-2"
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
        )}
      </div>
      {mobileNav === "menu" && (
        <>
          {/* Backdrop — click to close. */}
          <div
            onClick={() => setOpen(false)}
            aria-hidden="true"
            className={
              "fixed inset-0 z-20 bg-verdex-ink/40 transition-opacity duration-200 md:hidden " +
              (open ? "opacity-100" : "pointer-events-none opacity-0")
            }
          />
          {/* Drawer — slides in from the left, only part of the screen width. */}
          <nav
            className={
              "fixed inset-y-0 left-0 z-30 flex w-64 max-w-[78%] flex-col gap-0.5 overflow-y-auto border-r border-verdex-rule bg-verdex-paper p-4 shadow-xl transition-transform duration-200 ease-out md:hidden " +
              (open ? "translate-x-0" : "-translate-x-full")
            }
          >
            <Link
              href="/"
              className="mb-4 flex items-center gap-2 font-serif text-lg text-verdex-ink"
              onClick={() => setOpen(false)}
            >
              <span className="inline-block h-5 w-5 rounded-md bg-verdex-green" aria-hidden="true" />
              Verdex
            </Link>
            <p className="mb-1 px-2 font-mono text-[10px] uppercase tracking-[0.12em] text-verdex-ink-3">{brand}</p>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={navLinkClass(pathname === item.href)}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>
        </>
      )}

      {/* Desktop sidebar — same for both variants. */}
      <aside className="hidden w-60 shrink-0 flex-col gap-1 border-r border-verdex-rule bg-verdex-paper p-4 md:flex">
        <Link
          href="/"
          className="mb-4 flex items-center gap-2 font-serif text-lg text-verdex-ink transition-opacity hover:opacity-70"
        >
          <span className="inline-block h-5 w-5 rounded-md bg-verdex-green" aria-hidden="true" />
          Verdex
        </Link>
        <p className="mb-1 px-2 font-mono text-[10px] uppercase tracking-[0.12em] text-verdex-ink-3">{brand}</p>
        <nav className="flex flex-col gap-0.5">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className={navLinkClass(pathname === item.href)}>
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <main
        key={pathname}
        className={
          "flex-1 overflow-y-auto animate-fade-in-up " + (mobileNav === "tabs" ? "pb-16 md:pb-0" : "")
        }
      >
        {children}
      </main>

      {/* Mobile bottom tab bar — Instagram-style, one slot per section. */}
      {mobileNav === "tabs" && (
        <nav className="fixed inset-x-0 bottom-0 z-10 flex items-stretch justify-around border-t border-verdex-rule bg-verdex-paper md:hidden">
          {navItems.map((item) => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-1 flex-col items-center gap-1 py-2.5 text-center"
              >
                {item.icon && (
                  <span className={active ? "text-verdex-green" : "text-verdex-ink-3"}>{item.icon}</span>
                )}
                <span
                  className={
                    "text-[11px] leading-tight " +
                    (active ? "font-medium text-verdex-green-deep" : "text-verdex-ink-3")
                  }
                >
                  {item.label}
                </span>
              </Link>
            )
          })}
        </nav>
      )}
    </div>
  )
}
