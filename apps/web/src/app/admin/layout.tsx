import { LayoutDashboard, Users, Building2, Recycle, Gift, Wallet, ShieldAlert, UserCog } from "lucide-react"
import { RoleShell, type RoleNavItem } from "@/components/RoleShell"

const ICON_SIZE = 18
const ICON_STROKE = 1.8

// TODO: gate this whole segment on Supabase auth + role === 'admin' once the backend exists.
const NAV: RoleNavItem[] = [
  { href: "/admin", label: "Overview", icon: <LayoutDashboard size={ICON_SIZE} strokeWidth={ICON_STROKE} /> },
  { href: "/admin/usuarios", label: "Usuarios", icon: <Users size={ICON_SIZE} strokeWidth={ICON_STROKE} /> },
  { href: "/admin/empresas", label: "Empresas", icon: <Building2 size={ICON_SIZE} strokeWidth={ICON_STROKE} /> },
  { href: "/admin/recicladores", label: "Recicladores", icon: <Recycle size={ICON_SIZE} strokeWidth={ICON_STROKE} /> },
  { href: "/admin/recompensas", label: "Recompensas", icon: <Gift size={ICON_SIZE} strokeWidth={ICON_STROKE} /> },
  { href: "/admin/pagos", label: "Pagos", icon: <Wallet size={ICON_SIZE} strokeWidth={ICON_STROKE} /> },
  { href: "/admin/fraude", label: "Fraude", icon: <ShieldAlert size={ICON_SIZE} strokeWidth={ICON_STROKE} /> },
  { href: "/admin/equipo", label: "Equipo interno", icon: <UserCog size={ICON_SIZE} strokeWidth={ICON_STROKE} /> },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleShell brand="Panel admin" navItems={NAV} mobileNav="menu">
      {children}
    </RoleShell>
  )
}
