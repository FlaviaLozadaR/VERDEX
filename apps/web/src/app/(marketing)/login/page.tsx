"use client"

import { useState } from "react"
import Link from "next/link"

export default function LoginPage() {
  const [showClienteInfo, setShowClienteInfo] = useState(false)

  return (
    <div className="mx-auto flex max-w-sm flex-col gap-4 px-6 py-24 animate-fade-in-up">
      <h1 className="font-serif text-3xl text-verdex-ink">Bienvenido</h1>
      <p className="text-sm text-verdex-ink-3">
        Todavía no hay login real conectado — hace falta un proyecto de Supabase para eso, y
        eso lo tiene que crear el dueño de la cuenta. Mientras tanto, elegí con qué panel
        querés entrar a explorar.
      </p>

      <Link
        href="/empresa/dashboard"
        className="mt-4 rounded-full bg-verdex-green px-4 py-3 text-center text-sm font-medium text-white transition-colors hover:bg-verdex-green-deep"
      >
        Continuar como empresa
      </Link>
      <Link
        href="/admin"
        className="rounded-full border border-verdex-rule px-4 py-3 text-center text-sm font-medium text-verdex-ink-2 transition-colors hover:border-verdex-green"
      >
        Continuar como admin
      </Link>
      <button
        type="button"
        onClick={() => setShowClienteInfo((v) => !v)}
        className="rounded-full border border-verdex-rule px-4 py-3 text-center text-sm font-medium text-verdex-ink-2 transition-colors hover:border-verdex-green"
      >
        Continuar como cliente
      </button>

      {showClienteInfo && (
        <div className="animate-fade-in-up rounded-2xl border border-verdex-rule bg-verdex-paper p-4 text-sm text-verdex-ink-2">
          La experiencia de cliente (escanear, canjear, mapa, perfil) vive en la app móvil, no
          en este sitio — es la que usa la persona que recicla desde su celular. Para verla:
          <code className="mt-2 block rounded-lg bg-verdex-bg px-3 py-2 font-mono text-xs text-verdex-ink">
            npm run dev:mobile
          </code>
          y desde esa terminal apretá <strong>w</strong> para abrirla en el navegador, o escaneá
          el QR con la app Expo Go en tu celular.
        </div>
      )}

      <p className="mt-2 text-center text-xs text-verdex-ink-3">
        ¿Sos reciclador? Ese acceso también vive en la app móvil, con su propio menú.
      </p>
    </div>
  )
}
