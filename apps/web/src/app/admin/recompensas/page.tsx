"use client"

import { useEffect, useState } from "react"
import { getDataSource, type Redemption, type Reward } from "@verdex/shared"
import { SkeletonLines } from "@/components/Skeleton"

const EMPTY_FORM = { nm: "", partner: "", cat: "", pts: 500, ic: "", color: "" }

export default function AdminRecompensasPage() {
  const [rewards, setRewards] = useState<Reward[]>([])
  const [redemptions, setRedemptions] = useState<Redemption[]>([])
  const [form, setForm] = useState(EMPTY_FORM)
  const [busy, setBusy] = useState(false)

  const load = () => {
    const ds = getDataSource()
    ds.listAllRewards().then(setRewards)
    ds.listAllRedemptions().then(setRedemptions)
  }

  useEffect(load, [])

  async function toggle(r: Reward) {
    const ds = getDataSource()
    if (r.status === "activo") await ds.pauseReward(r.id)
    else await ds.activateReward(r.id)
    load()
  }

  async function create(e: React.FormEvent) {
    e.preventDefault()
    if (!form.nm || !form.partner || !form.cat) return
    setBusy(true)
    await getDataSource().createReward({ ...form, ic: form.ic || form.nm[0].toUpperCase() })
    setForm(EMPTY_FORM)
    setBusy(false)
    load()
  }

  const redemptionsFor = (rewardId: string) => redemptions.filter((r) => r.rewardId === rewardId).length

  return (
    <div className="mx-auto max-w-4xl px-8 py-10">
      <h1 className="font-serif text-3xl text-verdex-ink">Catálogo de recompensas</h1>
      <p className="mt-1 text-verdex-ink-3">Crear, editar, pausar y dar de baja recompensas del catálogo.</p>

      {rewards.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-verdex-rule bg-verdex-paper p-4">
          <SkeletonLines count={4} />
        </div>
      ) : (
        <div className="mt-6 divide-y divide-verdex-rule rounded-2xl border border-verdex-rule bg-verdex-paper">
          {rewards.map((r, i) => (
            <div
              key={r.id}
              className="flex animate-fade-in-up flex-wrap items-center justify-between gap-3 px-4 py-3 transition-colors hover:bg-verdex-bg-2"
              style={{ animationDelay: `${i * 30}ms` }}
            >
              <div>
                <div className="text-sm text-verdex-ink">{r.nm}</div>
                <div className="text-xs text-verdex-ink-3">
                  {r.partner} · {r.cat} · {r.pts.toLocaleString("es-BO")} pts · {redemptionsFor(r.id)} canjes
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`rounded-full px-2.5 py-1 font-mono text-[10px] uppercase ${
                    r.status === "activo"
                      ? "bg-verdex-green-soft text-verdex-green-deep"
                      : "bg-verdex-bg-2 text-verdex-ink-3"
                  }`}
                >
                  {r.status}
                </span>
                <button
                  onClick={() => toggle(r)}
                  className="text-xs text-verdex-ink-2 transition-colors hover:text-verdex-ink hover:underline"
                >
                  {r.status === "activo" ? "Pausar" : "Reactivar"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <h2 className="mt-10 font-serif text-xl text-verdex-ink">Crear recompensa</h2>
      <form onSubmit={create} className="mt-4 grid gap-3 rounded-2xl border border-verdex-rule bg-verdex-paper p-5 sm:grid-cols-2">
        <input
          placeholder="Nombre"
          value={form.nm}
          onChange={(e) => setForm({ ...form, nm: e.target.value })}
          className="rounded-lg border border-verdex-rule bg-verdex-bg px-3 py-2 text-sm text-verdex-ink transition-colors focus:border-verdex-green focus:outline-none"
        />
        <input
          placeholder="Partner"
          value={form.partner}
          onChange={(e) => setForm({ ...form, partner: e.target.value })}
          className="rounded-lg border border-verdex-rule bg-verdex-bg px-3 py-2 text-sm text-verdex-ink transition-colors focus:border-verdex-green focus:outline-none"
        />
        <input
          placeholder="Categoría"
          value={form.cat}
          onChange={(e) => setForm({ ...form, cat: e.target.value })}
          className="rounded-lg border border-verdex-rule bg-verdex-bg px-3 py-2 text-sm text-verdex-ink transition-colors focus:border-verdex-green focus:outline-none"
        />
        <input
          type="number"
          min={1}
          placeholder="Costo en puntos"
          value={form.pts}
          onChange={(e) => setForm({ ...form, pts: Number(e.target.value) })}
          className="rounded-lg border border-verdex-rule bg-verdex-bg px-3 py-2 text-sm text-verdex-ink transition-colors focus:border-verdex-green focus:outline-none"
        />
        <button
          type="submit"
          disabled={busy}
          className="sm:col-span-2 w-fit rounded-full bg-verdex-green px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-verdex-green-deep active:scale-95 disabled:opacity-50"
        >
          Crear recompensa
        </button>
      </form>
    </div>
  )
}
