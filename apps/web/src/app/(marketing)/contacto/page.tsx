"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

const TIPOS = ["Empresa", "Reciclador o aliado", "Prensa", "Inversionista", "Otro"]

export default function ContactoPage() {
  const router = useRouter()
  const [tipo, setTipo] = useState(TIPOS[0])
  const [sent, setSent] = useState(false)

  return (
    <div className="mx-auto max-w-2xl px-6 py-20 animate-fade-in-up">
      <button
        type="button"
        onClick={() => router.back()}
        className="mb-6 flex items-center gap-1.5 text-sm text-verdex-ink-3 transition-colors hover:text-verdex-ink"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M8.5 2.5L3 7l5.5 4.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Volver
      </button>
      <p className="font-mono text-xs uppercase tracking-[0.14em] text-verdex-green">Contacto</p>
      <h1 className="mt-3 font-serif text-4xl text-verdex-ink">Hablemos.</h1>
      <p className="mt-4 text-verdex-ink-3">
        Contanos qué te interesa y te respondemos desde el equipo Verdex.
      </p>

      {sent ? (
        <div className="mt-10 rounded-2xl border border-verdex-green bg-verdex-green-soft p-6">
          <p className="font-serif text-xl text-verdex-green-deep">¡Recibimos tu mensaje!</p>
          <p className="mt-2 text-sm text-verdex-ink-2">
            Te contactamos apenas lo revisemos. Por ahora este formulario no envía datos a ningún
            backend real — se conecta cuando el sitio tenga uno.
          </p>
        </div>
      ) : (
        <form
          className="mt-10 flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault()
            setSent(true)
          }}
        >
          <div className="flex flex-wrap gap-2">
            {TIPOS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTipo(t)}
                className={`rounded-full border px-4 py-2 text-xs font-medium transition ${
                  tipo === t
                    ? "border-verdex-green bg-verdex-green-soft text-verdex-green-deep"
                    : "border-verdex-rule text-verdex-ink-2 hover:border-verdex-green"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <input
            required
            type="text"
            placeholder="Nombre"
            className="rounded-lg border border-verdex-rule bg-verdex-paper px-4 py-3 text-sm text-verdex-ink"
          />
          <input
            required
            type="email"
            placeholder="tu@email.com"
            className="rounded-lg border border-verdex-rule bg-verdex-paper px-4 py-3 text-sm text-verdex-ink"
          />
          <textarea
            required
            rows={4}
            placeholder="Contanos en qué podemos ayudarte"
            className="rounded-lg border border-verdex-rule bg-verdex-paper px-4 py-3 text-sm text-verdex-ink"
          />
          <button
            type="submit"
            className="rounded-full bg-verdex-green px-6 py-3 text-sm font-medium text-white transition hover:bg-verdex-green-deep"
          >
            Enviar mensaje
          </button>
        </form>
      )}

      <div className="mt-16 border-t border-verdex-rule pt-8 text-sm text-verdex-ink-3">
        <p>Santa Cruz de la Sierra, Bolivia</p>
        <p className="mt-1">¿Sos usuario o reciclador? Ese acceso está en la app móvil, no acá.</p>
      </div>
    </div>
  )
}
