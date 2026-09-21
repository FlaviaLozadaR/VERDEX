import Link from "next/link"
import { getDataSource } from "@verdex/shared"

const PASOS = [
  {
    title: "Validás en persona",
    body: "Confirmás el peso y material real de cada depósito desde la app — sin eso, ningún dato del Dashboard ESG sería verificable.",
  },
  {
    title: "Cobrás por kg",
    body: "Cada depósito validado suma a tu pago del periodo, a la tarifa acordada en Bs/kg. Lo ves acumularse en tiempo real.",
  },
  {
    title: "Gestionás tu zona",
    body: "Tus puntos de acopio asignados, cuántos depósitos están pendientes en cada uno, todo desde el celular.",
  },
]

const TIPOS_PUNTO = [
  { title: "Contenedor", body: "Un punto fijo de acopio — campus, oficina, espacio público." },
  { title: "Máquina inteligente", body: "Un punto automatizado que ya pesa y clasifica al depositar." },
  { title: "Aliado", body: "Un negocio (cafetería, supermercado) que suma un punto de recolección propio." },
]

export default async function RecicladoresPage() {
  const impact = await getDataSource().getNetworkImpact()

  return (
    <div className="animate-fade-in-up">
      <section className="mx-auto max-w-4xl px-6 py-24 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-verdex-green">
          Para recicladores y aliados
        </p>
        <h1 className="mt-4 text-balance font-serif text-5xl text-verdex-ink md:text-6xl">
          Digitaliza tu punto de acopio.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-verdex-ink-3">
          Sumate a la red que le da veracidad de campo al reciclaje con recompensas — validás lo que
          la gente deposita, y te pagamos por eso.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link
            href="/contacto"
            className="rounded-full bg-verdex-green px-6 py-3 text-sm font-medium text-white transition hover:bg-verdex-green-deep"
          >
            Postular como reciclador
          </Link>
          <Link
            href="/impacto"
            className="rounded-full border border-verdex-rule px-6 py-3 text-sm font-medium text-verdex-ink transition hover:border-verdex-green"
          >
            Ver impacto de la red
          </Link>
        </div>
        <p className="mt-8 font-mono text-xs uppercase tracking-widest text-verdex-ink-3">
          {impact.recicladoresActivos} recicladores activos en {impact.puntosRecoleccion} puntos de acopio
        </p>
      </section>

      <section className="border-t border-verdex-rule bg-verdex-paper">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="font-serif text-3xl text-verdex-ink">Cómo funciona ser reciclador Verdex</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {PASOS.map((p, i) => (
              <div key={p.title} className="rounded-2xl border border-verdex-rule bg-white p-6">
                <div className="font-mono text-xs text-verdex-green">{String(i + 1).padStart(2, "0")}</div>
                <div className="mt-2 font-serif text-xl text-verdex-ink">{p.title}</div>
                <div className="mt-3 text-sm text-verdex-ink-3">{p.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="font-serif text-3xl text-verdex-ink">Cómo sumar un punto de acopio</h2>
        <p className="mt-3 max-w-2xl text-verdex-ink-3">
          Tres formas de sumarse a la red, según lo que ya tengas montado.
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {TIPOS_PUNTO.map((t) => (
            <div key={t.title} className="rounded-2xl border border-verdex-rule bg-white p-6">
              <div className="font-serif text-xl text-verdex-ink">{t.title}</div>
              <div className="mt-3 text-sm text-verdex-ink-3">{t.body}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-verdex-rule bg-verdex-paper">
        <div className="mx-auto max-w-3xl px-6 py-20">
          <h2 className="font-serif text-3xl text-verdex-ink">Proceso de aprobación</h2>
          <ul className="mt-8 space-y-2.5 border-t border-verdex-rule pt-6">
            {[
              "Postulás desde el formulario de contacto contándonos tu zona y capacidad",
              "El equipo Verdex revisa la postulación y te asigna zona y puntos de acopio",
              "Descargás la app, validás tu primer depósito y empezás a acumular pago por kg",
            ].map((step) => (
              <li key={step} className="flex items-start gap-2.5 text-sm text-verdex-ink-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-verdex-green" />
                {step}
              </li>
            ))}
          </ul>
          <Link
            href="/contacto"
            className="mt-8 inline-block rounded-full bg-verdex-green px-6 py-3 text-sm font-medium text-white transition hover:bg-verdex-green-deep"
          >
            Postular ahora
          </Link>
        </div>
      </section>
    </div>
  )
}
