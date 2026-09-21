import { getDataSource } from "@verdex/shared"

const LOGROS = [
  { title: "Ganador", body: "Feria de Innovación UPSSA" },
  { title: "Finalista nacional", body: "ElevateU" },
  { title: "Ganador", body: "Feria de Emprendimiento CAINCO" },
]

export default async function ImpactoPage() {
  const impact = await getDataSource().getNetworkImpact()

  return (
    <div className="animate-fade-in-up">
      <section className="mx-auto max-w-4xl px-6 py-24 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-verdex-green">
          Impacto y validación
        </p>
        <h1 className="mt-4 text-balance font-serif text-5xl text-verdex-ink md:text-6xl">
          Los números detrás del ecosistema.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-verdex-ink-3">
          Esto es el impacto agregado de toda la red — no el de una empresa individual, eso vive en
          el Dashboard ESG de cada una.
        </p>
      </section>

      <section className="border-t border-verdex-rule bg-verdex-paper">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
            <Stat label="Kg reciclados" value={Math.round(impact.kgTotal).toLocaleString("es-BO")} />
            <Stat label="CO₂ evitado" value={`${Math.round(impact.co2Kg).toLocaleString("es-BO")} kg`} />
            <Stat
              label="Agua ahorrada"
              value={`${(impact.aguaLitros / 1000).toLocaleString("es-BO", { maximumFractionDigits: 1 })} m³`}
            />
            <Stat label="Usuarios activos" value={impact.usuariosActivos.toLocaleString("es-BO")} />
          </div>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 md:grid-cols-2">
            <Stat label="Empresas en la red" value={String(impact.empresasActivas)} />
            <Stat label="Recicladores activos" value={String(impact.recicladoresActivos)} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-20">
        <h2 className="text-center font-serif text-3xl text-verdex-ink">Validación del mercado</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {LOGROS.map((l) => (
            <div key={l.body} className="rounded-2xl border border-verdex-rule bg-white p-6 text-center">
              <div className="font-mono text-xs uppercase tracking-widest text-verdex-amber-deep">
                {l.title}
              </div>
              <div className="mt-3 font-serif text-lg text-verdex-ink">{l.body}</div>
            </div>
          ))}
        </div>
        <p className="mx-auto mt-10 max-w-2xl text-center text-sm text-verdex-ink-3">
          MVP funcional, en validación con usuarios reales y en piloto con empresas — esa tracción es
          la razón por la que reconstruimos el producto pensado para escalar.
        </p>
      </section>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-verdex-rule bg-white p-6 text-center">
      <div className="font-serif text-3xl text-verdex-ink">{value}</div>
      <div className="mt-2 text-xs uppercase tracking-widest text-verdex-ink-3">{label}</div>
    </div>
  )
}
