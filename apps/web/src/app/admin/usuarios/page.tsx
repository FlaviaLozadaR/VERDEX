"use client"

import { useEffect, useState } from "react"
import { getDataSource, type Txn, type UsuarioAccount } from "@verdex/shared"
import { SkeletonLines } from "@/components/Skeleton"

export default function AdminUsuariosPage() {
  const [usuarios, setUsuarios] = useState<UsuarioAccount[]>([])
  const [query, setQuery] = useState("")
  const [expanded, setExpanded] = useState<string | null>(null)
  const [activity, setActivity] = useState<Txn[]>([])

  const load = () => {
    getDataSource().listUsuarios().then(setUsuarios)
  }

  useEffect(load, [])

  async function toggle(id: string) {
    if (expanded === id) {
      setExpanded(null)
      return
    }
    setExpanded(id)
    const list = await getDataSource().listUsuarioActivity(id)
    setActivity(list)
  }

  async function toggleStatus(u: UsuarioAccount) {
    const ds = getDataSource()
    if (u.status === "activo") await ds.suspendUsuario(u.id)
    else await ds.reactivateUsuario(u.id)
    load()
  }

  const filtered = usuarios.filter((u) =>
    `${u.name} ${u.email}`.toLowerCase().includes(query.trim().toLowerCase())
  )

  return (
    <div className="mx-auto max-w-4xl px-8 py-10">
      <h1 className="font-serif text-3xl text-verdex-ink">Gestión de usuarios</h1>
      <p className="mt-1 text-verdex-ink-3">Buscar, ver actividad y suspender cuentas cuando sea necesario.</p>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar por nombre o email..."
        className="mt-6 w-full rounded-lg border border-verdex-rule bg-verdex-paper px-4 py-3 text-sm text-verdex-ink transition-colors focus:border-verdex-green focus:outline-none"
      />

      {usuarios.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-verdex-rule bg-verdex-paper p-4">
          <SkeletonLines count={4} />
        </div>
      ) : (
        <div className="mt-4 divide-y divide-verdex-rule rounded-2xl border border-verdex-rule bg-verdex-paper">
          {filtered.map((u) => (
            <div key={u.id}>
              <div className="flex items-center justify-between px-4 py-3 transition-colors hover:bg-verdex-bg-2">
                <button onClick={() => toggle(u.id)} className="text-left">
                  <div className="text-sm text-verdex-ink">{u.name}</div>
                  <div className="text-xs text-verdex-ink-3">{u.email}</div>
                </button>
                <div className="flex items-center gap-3">
                  <span
                    className={`rounded-full px-2.5 py-1 font-mono text-[10px] uppercase ${
                      u.status === "activo"
                        ? "bg-verdex-green-soft text-verdex-green-deep"
                        : "bg-verdex-amber-soft text-verdex-amber-deep"
                    }`}
                  >
                    {u.status}
                  </span>
                  <button
                    onClick={() => toggleStatus(u)}
                    className="text-xs text-verdex-ink-2 transition-colors hover:text-verdex-ink hover:underline"
                  >
                    {u.status === "activo" ? "Suspender" : "Reactivar"}
                  </button>
                </div>
              </div>
              {expanded === u.id && (
                <div className="animate-fade-in-up border-t border-verdex-rule bg-verdex-bg px-4 py-3">
                  {activity.length === 0 ? (
                    <p className="text-xs text-verdex-ink-3">Sin movimientos todavía.</p>
                  ) : (
                    <div className="space-y-2">
                      {activity.map((t) => (
                        <div key={t.id} className="flex items-center justify-between text-xs">
                          <span className="text-verdex-ink-2">
                            {t.label} — {t.sub}
                          </span>
                          <span className={t.pts < 0 ? "text-verdex-amber-deep" : "text-verdex-green-deep"}>
                            {t.pts > 0 ? "+" : ""}
                            {t.pts}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
