import { Tabs } from "expo-router"
import { colors } from "../../constants/theme"

// TODO: gate this whole segment on auth + role === 'usuario' once Supabase is wired.
export default function UsuarioLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.green,
        tabBarInactiveTintColor: colors.ink3,
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Inicio" }} />
      <Tabs.Screen name="escanear" options={{ title: "Escanear" }} />
      <Tabs.Screen name="canjear" options={{ title: "Canjear" }} />
      <Tabs.Screen name="mapa" options={{ title: "Mapa" }} />
      <Tabs.Screen name="perfil" options={{ title: "Perfil" }} />
    </Tabs>
  )
}
