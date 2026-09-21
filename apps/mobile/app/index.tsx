import { View, Text, Pressable, StyleSheet } from "react-native"
import { Link } from "expo-router"
import { colors } from "../constants/theme"

export default function Entry() {
  return (
    <View style={styles.page}>
      <View style={styles.brandDot} />
      <Text style={styles.title}>Verdex</Text>
      <Text style={styles.subtitle}>
        Pantalla de entrada temporal — hasta que Supabase Auth esté conectado, elegí con qué rol
        querés explorar la app.
      </Text>

      <Link href="/usuario" asChild>
        <Pressable style={StyleSheet.flatten([styles.button, styles.buttonPrimary])}>
          <Text style={styles.buttonPrimaryText}>Continuar como usuario</Text>
        </Pressable>
      </Link>

      <Link href="/reciclador" asChild>
        <Pressable style={StyleSheet.flatten([styles.button, styles.buttonSecondary])}>
          <Text style={styles.buttonSecondaryText}>Continuar como reciclador</Text>
        </Pressable>
      </Link>
    </View>
  )
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    gap: 12,
  },
  brandDot: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: colors.green,
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: "600",
    color: colors.ink,
  },
  subtitle: {
    fontSize: 14,
    color: colors.ink3,
    textAlign: "center",
    maxWidth: 320,
    marginBottom: 16,
  },
  button: {
    width: 280,
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: "center",
  },
  buttonPrimary: {
    backgroundColor: colors.green,
  },
  buttonPrimaryText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  buttonSecondary: {
    borderWidth: 1,
    borderColor: colors.rule,
  },
  buttonSecondaryText: {
    color: colors.ink2,
    fontWeight: "600",
    fontSize: 14,
  },
})
