import { useEffect, useRef, useState } from "react"
import { Animated, View, Text, ScrollView, StyleSheet } from "react-native"
import { levelFor, LEVELS, getDataSource, DEMO_USUARIO_ID, type UsuarioSummary } from "@verdex/shared"
import { colors } from "../../constants/theme"
import { Skeleton } from "../../components/Skeleton"

export default function UsuarioHome() {
  const [summary, setSummary] = useState<UsuarioSummary | null>(null)
  const barWidth = useRef(new Animated.Value(0)).current

  useEffect(() => {
    getDataSource().getUsuarioSummary(DEMO_USUARIO_ID).then(setSummary)
  }, [])

  useEffect(() => {
    if (!summary) return
    const lv = levelFor(summary.totalEarned)
    const range = Math.max(1, lv.max - lv.min)
    const pct = Math.min(100, ((summary.totalEarned - lv.min) / range) * 100)
    Animated.timing(barWidth, { toValue: pct, duration: 700, useNativeDriver: false }).start()
  }, [summary, barWidth])

  if (!summary) {
    return (
      <View style={styles.page}>
        <View style={styles.content}>
          <Skeleton style={{ width: 180, height: 24 }} />
          <Skeleton style={{ width: 240, height: 14, marginTop: 8 }} />
          <Skeleton style={{ height: 140, marginTop: 20, borderRadius: 20 }} />
          <View style={styles.statsRow}>
            <Skeleton style={{ flex: 1, height: 64, borderRadius: 14 }} />
            <Skeleton style={{ flex: 1, height: 64, borderRadius: 14 }} />
            <Skeleton style={{ flex: 1, height: 64, borderRadius: 14 }} />
          </View>
        </View>
      </View>
    )
  }

  // Level reflects lifetime points earned, not the spendable balance — redeeming
  // a reward shouldn't demote you.
  const lv = levelFor(summary.totalEarned)
  const next = LEVELS[Math.min(lv.idx + 1, LEVELS.length - 1)]

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.content}>
      <Text style={styles.hello}>¡Hola, Demo Verdex!</Text>
      <Text style={styles.sub}>Cada acción cuenta. Sigamos generando impacto.</Text>

      <View style={styles.wallet}>
        <Text style={styles.walletLabel}>PUNTOS VERDES</Text>
        <Text style={styles.walletPts}>{summary.points.toLocaleString("es-BO")}</Text>
        <View style={styles.barTrack}>
          <Animated.View
            style={[styles.barFill, { width: barWidth.interpolate({ inputRange: [0, 100], outputRange: ["0%", "100%"] }) }]}
          />
        </View>
        <Text style={styles.walletNext}>
          {lv.nm} → {next.nm} · {Math.max(0, next.min - summary.totalEarned).toLocaleString("es-BO")} pts restantes
        </Text>
      </View>

      <View style={styles.statsRow}>
        <Stat label="Kg reciclados" value={summary.kg.toFixed(1)} />
        <Stat label="CO₂ evitado" value={(summary.kg * 0.5).toFixed(1)} />
        <Stat label="Nivel" value={lv.nm} />
      </View>
    </ScrollView>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 20, paddingTop: 24, paddingBottom: 40 },
  hello: { fontSize: 24, fontWeight: "600", color: colors.ink },
  sub: { fontSize: 13, color: colors.ink3, marginTop: 4 },
  wallet: {
    marginTop: 20,
    borderRadius: 20,
    padding: 20,
    backgroundColor: colors.greenDeep,
  },
  walletLabel: { color: "#fff", opacity: 0.85, fontSize: 10, letterSpacing: 1.2 },
  walletPts: { color: "#fff", fontSize: 40, fontWeight: "700", marginTop: 4 },
  barTrack: { height: 5, borderRadius: 999, backgroundColor: "rgba(255,255,255,0.2)", marginTop: 14, overflow: "hidden" },
  barFill: { height: "100%", backgroundColor: colors.greenBright },
  walletNext: { color: "#fff", opacity: 0.85, fontSize: 11, marginTop: 10 },
  statsRow: { flexDirection: "row", gap: 10, marginTop: 20 },
  stat: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.rule,
    backgroundColor: colors.paper,
    paddingVertical: 14,
    alignItems: "center",
  },
  statValue: { fontSize: 20, fontWeight: "600", color: colors.ink },
  statLabel: { fontSize: 9, color: colors.ink3, marginTop: 4, textTransform: "uppercase" },
})
