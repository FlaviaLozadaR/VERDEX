import { Tabs } from "expo-router"
import { colors } from "../../constants/theme"

// TODO: gate this whole segment on auth + role === 'reciclador' once Supabase is wired.
export default function RecicladorLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.amberDeep,
        tabBarInactiveTintColor: colors.ink3,
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Mi zona" }} />
      <Tabs.Screen name="validar" options={{ title: "Validar" }} />
      <Tabs.Screen name="pagos" options={{ title: "Pagos" }} />
      <Tabs.Screen name="perfil" options={{ title: "Perfil" }} />
    </Tabs>
  )
}
