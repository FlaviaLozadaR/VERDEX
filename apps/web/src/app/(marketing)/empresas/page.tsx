import Link from "next/link"
import { getDataSource } from "@verdex/shared"

const MODELO = [
  {
    title: "Dashboard ESG",
    body: "Métricas reales de impacto — kg reciclados, CO₂ evitado, agua ahorrada, usuarios activos afiliados — listas para tu memoria de sostenibilidad.",
  },
  {
    title: "Campañas de sostenibilidad",
    body: "Sumá a tus empleados como usuarios afiliados: su reciclaje cuenta para el impacto de tu empresa y les da recompensas reales.",
  },
  {
    title: "Alianzas estratégicas",
    body: "Puntos de acopio en tus sedes, co-branding en recompensas, y acceso directo al equipo Verdex para diseñar la campaña.",
  },
]

const PLANES = [
  {
    tier: "Starter",
    fit: "Una sola sede",
    features: ["Dashboard ESG básico", "Kg reciclados y CO₂ evitado", "1 usuario con acceso al panel"],
  },
  {
    tier: "Crecimiento",
    fit: "Varias sedes o campus",
    features: ["Ranking por sede", "Tendencia mensual e histórico", "Empleados afiliados sin límite", "Certificado de impacto descargable"],
    highlight: true,
  },
  {
    tier: "Enterprise",
    fit: "Reportes ESG formales",
    features: ["Todo lo de Crecimiento", "Exportación de métricas", "Acompañamiento dedicado del equipo Verdex"],
  },
]

export default async function EmpresasPage() {
  const impact = await getDataSource().getNetworkImpact()

  return (
    <div className="animate-fade-in-up">
      <section className="mx-auto max-w-4xl px-6 py-24 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-verdex-green">Para empresas</p>
        <h1 className="mt-4 text-balance font-serif text-5xl text-verdex-ink md:text-6xl">
          Un Dashboard ESG con el impacto real de tu marca.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-verdex-ink-3">
          Suscribí a tu empresa al ecosistema Verdex: tus empleados reciclan con recompensas reales,
          vos recibís los datos que tu reporte de sostenibilidad necesita.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link
            href="/contacto"
            className="rounded-full bg-verdex-green px-6 py-3 text-sm font-medium text-white transition hover:bg-verdex-green-deep"
          >
            Agendar demo
          </Link>
          <Link
            href="/empresa/dashboard"
            className="rounded-full border border-verdex-rule px-6 py-3 text-sm font-medium text-verdex-ink transition hover:border-verdex-green"
          >
            Ver dashboard demo
          </Link>
        </div>
        <p className="mt-8 font-mono text-xs uppercase tracking-widest text-verdex-ink-3">
          Parte de una red que ya recicló {Math.round(impact.kgTotal).toLocaleString("es-BO")} kg entre{" "}
          {impact.empresasActivas} empresas
        </p>
      </section>

      <section className="border-t border-verdex-rule bg-verdex-paper">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="font-serif text-3xl text-verdex-ink">Qué incluye la suscripción</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {MODELO.map((m) => (
              <div key={m.title} className="rounded-2xl border border-verdex-rule bg-white p-6">
                <div className="font-serif text-xl text-verdex-ink">{m.title}</div>
                <div className="mt-3 text-sm text-verdex-ink-3">{m.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="font-serif text-3xl text-verdex-ink">Planes</h2>
        <p className="mt-3 max-w-2xl text-verdex-ink-3">
          Elegimos el plan con vos según cuántas sedes y cuántos empleados afiliados tengas —
          escribinos y lo definimos juntos.
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {PLANES.map((p) => (
            <div
              key={p.tier}
              className={`rounded-2xl border p-6 ${p.highlight ? "border-verdex-green bg-verdex-green-soft" : "border-verdex-rule bg-white"}`}
            >
              <div className="font-serif text-2xl text-verdex-ink">{p.tier}</div>
              <div className="mt-1 text-xs uppercase tracking-widest text-verdex-ink-3">{p.fit}</div>
              <ul className="mt-5 space-y-2.5 border-t border-verdex-rule pt-5">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-verdex-ink-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-verdex-green" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-verdex-rule bg-verdex-green-deep">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center">
          <p className="text-balance font-serif text-2xl italic text-white">
            &ldquo;Descargá un certificado de impacto listo para tu memoria de sostenibilidad.&rdquo;
          </p>
          <Link
            href="/contacto"
            className="mt-8 inline-block rounded-full bg-white px-6 py-3 text-sm font-medium text-verdex-green-deep transition hover:bg-verdex-bg"
          >
            Solicitar acceso
          </Link>
        </div>
      </section>
    </div>
  )
}
