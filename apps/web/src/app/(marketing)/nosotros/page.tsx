const TIMELINE = [
  {
    title: "Feria de Innovación UPSSA",
    body: "Un equipo universitario presenta la idea: una botella puede generar valor para todos.",
  },
  {
    title: "ElevateU",
    body: "Finalistas nacionales — la idea ya no era solo un proyecto de feria.",
  },
  {
    title: "Feria de Emprendimiento CAINCO",
    body: "Ganan también acá, y esta vez varias empresas muestran interés real en trabajar con Verdex.",
  },
  {
    title: "Verdex Platform",
    body: "Esa tracción es la razón por la que reconstruimos el producto entero, pensado para escalar: 4 roles, backend real, apps móvil y web.",
  },
]

const VALORES = [
  { title: "Datos reales", body: "El Dashboard ESG solo vale si lo que reporta pasó de verdad — por eso existe el rol reciclador." },
  { title: "Valor para los tres", body: "Usuarios, empresas y recicladores tienen que ganar todos, o el ecosistema no cierra." },
  { title: "Construido para escalar", body: "No un MVP de feria — un producto pensado desde el día uno para múltiples roles y crecimiento." },
]

export default function NosotrosPage() {
  return (
    <div className="animate-fade-in-up">
      <section className="mx-auto max-w-4xl px-6 py-24 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-verdex-green">Nosotros</p>
        <h1 className="mt-4 text-balance font-serif text-5xl text-verdex-ink md:text-6xl">
          El equipo detrás de Verdex.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-verdex-ink-3">
          Somos el equipo universitario boliviano que llevó Verdex de una idea de feria a un producto
          con tracción real, liderado por Andrés Melgar como CEO.
        </p>
      </section>

      <section className="border-t border-verdex-rule bg-verdex-paper">
        <div className="mx-auto max-w-4xl px-6 py-20">
          <h2 className="font-serif text-3xl text-verdex-ink">De la feria UPSSA a CAINCO</h2>
          <div className="mt-10 space-y-6 border-l border-verdex-rule pl-6">
            {TIMELINE.map((t) => (
              <div key={t.title}>
                <div className="font-serif text-lg text-verdex-ink">{t.title}</div>
                <div className="mt-1 text-sm text-verdex-ink-3">{t.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="font-serif text-3xl text-verdex-ink">Lo que nos guía</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {VALORES.map((v) => (
            <div key={v.title} className="rounded-2xl border border-verdex-rule bg-white p-6">
              <div className="font-serif text-xl text-verdex-ink">{v.title}</div>
              <div className="mt-3 text-sm text-verdex-ink-3">{v.body}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-verdex-rule bg-verdex-paper">
        <div className="mx-auto max-w-3xl px-6 py-16 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-verdex-green">
            Equipo fundador
          </p>
          <p className="mt-3 font-serif text-2xl text-verdex-ink">Andrés Melgar — CEO</p>
          <p className="mx-auto mt-4 max-w-xl text-sm text-verdex-ink-3">
            Fotos y bios del resto del equipo fundador llegan a esta página apenas las tengamos
            listas — el crédito completo del equipo que ganó las tres ferias está pendiente acá.
          </p>
        </div>
      </section>
    </div>
  )
}
