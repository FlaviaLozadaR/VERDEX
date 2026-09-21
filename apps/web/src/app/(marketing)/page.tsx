import Link from "next/link"

const ACTORS = [
  {
    title: "Usuarios",
    problem: "No tienen incentivos para reciclar.",
    solution: "Reciclan y obtienen recompensas reales.",
  },
  {
    title: "Empresas",
    problem: "No tienen datos para medir su impacto.",
    solution: "Reciben un Dashboard ESG con métricas reales.",
  },
  {
    title: "Recicladores",
    problem: "Trabajan con poca digitalización.",
    solution: "Digitalizan su proceso y su cobro por kg.",
  },
]

export default function Home() {
  return (
    <div className="animate-fade-in-up">
      <section className="mx-auto max-w-4xl px-6 py-24 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-verdex-green">Verdex</p>
        <h1 className="mt-4 text-balance font-serif text-5xl text-verdex-ink md:text-6xl">
          Una botella puede generar valor para todos.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-verdex-ink-3">
          Conectamos usuarios, empresas y recicladores en un mismo ecosistema tecnológico de reciclaje con
          recompensas reales.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link
            href="/login"
            className="rounded-full bg-verdex-green px-6 py-3 text-sm font-medium text-white transition hover:bg-verdex-green-deep"
          >
            Empezar a reciclar
          </Link>
          <Link
            href="/empresas"
            className="rounded-full border border-verdex-rule px-6 py-3 text-sm font-medium text-verdex-ink transition hover:border-verdex-green"
          >
            Soy una empresa
          </Link>
        </div>
      </section>

      <section className="border-t border-verdex-rule bg-verdex-paper">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="font-serif text-3xl text-verdex-ink">El problema no es el reciclaje, es el sistema.</h2>
          <p className="mt-3 max-w-2xl text-verdex-ink-3">
            En Bolivia miles de toneladas de residuos reciclables terminan cada año en rellenos sanitarios porque
            el sistema está desconectado.
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {ACTORS.map((a, i) => (
              <div
                key={a.title}
                className={`stagger-${i + 1} animate-fade-in-up rounded-2xl border border-verdex-rule bg-white p-6 transition-shadow duration-200 hover:shadow-lg hover:shadow-verdex-ink/5`}
              >
                <div className="font-serif text-xl text-verdex-ink">{a.title}</div>
                <div className="mt-2 text-sm text-verdex-ink-3">{a.problem}</div>
                <div className="mt-4 border-t border-verdex-rule pt-4 text-sm font-medium text-verdex-green-deep">
                  {a.solution}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-20 text-center">
        <p className="text-balance font-serif text-2xl italic text-verdex-ink">
          &ldquo;Transformamos residuos en datos, datos en impacto e impacto en valor.&rdquo;
        </p>
      </section>
    </div>
  )
}
