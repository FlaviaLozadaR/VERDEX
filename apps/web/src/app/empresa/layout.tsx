import { LayoutDashboard, BarChart3, Receipt, Users, Settings } from "lucide-react"
import { RoleShell, type RoleNavItem } from "@/components/RoleShell"

const ICON_SIZE = 18
const ICON_STROKE = 1.8

// TODO: gate this whole segment on Supabase auth + role === 'empresa' once the backend exists.
const NAV: RoleNavItem[] = [
  { href: "/empresa/dashboard", label: "Dashboard", icon: <LayoutDashboard size={ICON_SIZE} strokeWidth={ICON_STROKE} /> },
  { href: "/empresa/metricas", label: "Métricas", icon: <BarChart3 size={ICON_SIZE} strokeWidth={ICON_STROKE} /> },
  { href: "/empresa/facturacion", label: "Facturación", icon: <Receipt size={ICON_SIZE} strokeWidth={ICON_STROKE} /> },
  { href: "/empresa/equipo", label: "Equipo", icon: <Users size={ICON_SIZE} strokeWidth={ICON_STROKE} /> },
  { href: "/empresa/ajustes", label: "Ajustes", icon: <Settings size={ICON_SIZE} strokeWidth={ICON_STROKE} /> },
]

export default function EmpresaLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleShell brand="Panel empresa" navItems={NAV} mobileNav="tabs">
      {children}
    </RoleShell>
  )
}
