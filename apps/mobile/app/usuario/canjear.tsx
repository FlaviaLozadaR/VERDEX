import { useEffect, useMemo, useRef, useState } from "react"
import { Animated, View, Text, Pressable, ScrollView, StyleSheet } from "react-native"
import {
  DEMO_USUARIO_ID,
  getDataSource,
  type Redemption,
  type Reward,
  type UsuarioSummary,
} from "@verdex/shared"
import { Pressed } from "../../components/Pressed"
import { Skeleton } from "../../components/Skeleton"
import { colors } from "../../constants/theme"

type Tab = "catalogo" | "historial"

export default function Canjear() {
  const [tab, setTab] = useState<Tab>("catalogo")
  const [rewards, setRewards] = useState<Reward[]>([])
  const [summary, setSummary] = useState<UsuarioSummary | null>(null)
  const [redemptions, setRedemptions] = useState<Redemption[]>([])
  const [cat, setCat] = useState("Todos")
  const [selected, setSelected] = useState<Reward | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastCode, setLastCode] = useState<string | null>(null)
  const sheetAnim = useRef(new Animated.Value(0)).current

  const load = () => {
    getDataSource().listRewards().then(setRewards)
    getDataSource().getUsuarioSummary(DEMO_USUARIO_ID).then(setSummary)
    getDataSource().listRedemptions(DEMO_USUARIO_ID).then(setRedemptions)
  }

  useEffect(load, [])

  useEffect(() => {
    if (!selected) return
    sheetAnim.setValue(0)
    Animated.timing(sheetAnim, { toValue: 1, duration: 220, useNativeDriver: true }).start()
  }, [selected, sheetAnim])

  const categories = useMemo(() => ["Todos", ...Array.from(new Set(rewards.map((r) => r.cat)))], [rewards])
  const filtered = cat === "Todos" ? rewards : rewards.filter((r) => r.cat === cat)

  async function confirmRedeem() {
    if (!selected) return
    setBusy(true)
    setError(null)
    try {
      const redemption = await getDataSource().redeemReward(DEMO_USUARIO_ID, selected.id)
      setLastCode(redemption.code)
      setSelected(null)
      load()
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo canjear.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.content}>
      <Text style={styles.eyebrow}>Usuario · Canjear</Text>
      <Text style={styles.title}>Recompensas</Text>

      <View style={styles.walletRow}>
        <Text style={styles.walletLabel}>PUNTOS DISPONIBLES</Text>
        <Text style={styles.walletValue}>{(summary?.points ?? 0).toLocaleString("es-BO")}</Text>
      </View>

      <View style={styles.tabs}>
        <Pressable style={[styles.tab, tab === "catalogo" && styles.tabActive]} onPress={() => setTab("catalogo")}>
          <Text style={[styles.tabText, tab === "catalogo" && styles.tabTextActive]}>Catálogo</Text>
        </Pressable>
        <Pressable style={[styles.tab, tab === "historial" && styles.tabActive]} onPress={() => setTab("historial")}>
          <Text style={[styles.tabText, tab === "historial" && styles.tabTextActive]}>
            Mis canjes{redemptions.length > 0 ? ` (${redemptions.length})` : ""}
          </Text>
        </Pressable>
      </View>

      {lastCode && (
        <View style={styles.successBox}>
          <Text style={styles.successTitle}>¡Canje confirmado!</Text>
          <Text style={styles.successCode}>{lastCode}</Text>
          <Text style={styles.successHint}>Mostrá este código en el punto aliado para reclamarlo.</Text>
          <Pressable onPress={() => setLastCode(null)}>
            <Text style={styles.dismiss}>Cerrar</Text>
          </Pressable>
        </View>
      )}

      {tab === "catalogo" && (
        <>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsRow}>
            {categories.map((c) => (
              <Pressable key={c} style={[styles.chip, cat === c && styles.chipActive]} onPress={() => setCat(c)}>
                <Text style={[styles.chipText, cat === c && styles.chipTextActive]}>{c}</Text>
              </Pressable>
            ))}
          </ScrollView>

          {rewards.length === 0 ? (
            <View style={styles.grid}>
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} style={{ width: "47%", height: 96, borderRadius: 16 }} />
              ))}
            </View>
          ) : (
            <View style={styles.grid}>
              {filtered.map((r) => {
                const affordable = (summary?.points ?? 0) >= r.pts
                return (
                  <Pressed
                    key={r.id}
                    style={[styles.card, !affordable && styles.cardDisabled]}
                    onPress={() => {
                      setError(null)
                      setSelected(r)
                    }}
                  >
                    <Text style={styles.cardIcon}>{r.ic}</Text>
                    <Text style={styles.cardName}>{r.nm}</Text>
                    <Text style={styles.cardPartner}>{r.partner}</Text>
                    <Text style={[styles.cardPts, !affordable && styles.cardPtsDisabled]}>
                      {r.pts.toLocaleString("es-BO")} pts
                    </Text>
                  </Pressed>
                )
              })}
            </View>
          )}
        </>
      )}

      {tab === "historial" &&
        (redemptions.length === 0 ? (
          <Text style={styles.empty}>Todavía no canjeaste ninguna recompensa.</Text>
        ) : (
          <View style={styles.list}>
            {redemptions.map((red) => {
              const reward = rewards.find((r) => r.id === red.rewardId)
              return (
                <View key={red.id} style={styles.historyItem}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.historyName}>{reward?.nm ?? red.rewardId}</Text>
                    <Text style={styles.historyCode}>{red.code}</Text>
                  </View>
                  <Text style={[styles.badge, red.status === "usado" ? styles.badgeUsed : styles.badgePending]}>
                    {red.status}
                  </Text>
                </View>
              )
            })}
          </View>
        ))}

      {selected && (
        <Animated.View
          style={[
            styles.sheet,
            {
              opacity: sheetAnim,
              transform: [{ translateY: sheetAnim.interpolate({ inputRange: [0, 1], outputRange: [12, 0] }) }],
            },
          ]}
        >
          <Text style={styles.sheetTitle}>{selected.nm}</Text>
          <Text style={styles.sheetPartner}>{selected.partner}</Text>
          <Text style={styles.sheetPts}>{selected.pts.toLocaleString("es-BO")} pts</Text>
          {error && <Text style={styles.errorText}>{error}</Text>}
          <Pressed style={[styles.primaryButton, busy && styles.disabled]} disabled={busy} onPress={confirmRedeem}>
            <Text style={styles.primaryButtonText}>{busy ? "Canjeando..." : "Confirmar canje"}</Text>
          </Pressed>
          <Pressable style={styles.secondaryButton} onPress={() => setSelected(null)}>
            <Text style={styles.secondaryButtonText}>Cancelar</Text>
          </Pressable>
        </Animated.View>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 20, paddingTop: 28, paddingBottom: 40 },
  eyebrow: {
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    color: colors.green,
    fontWeight: "600",
  },
  title: { fontSize: 26, fontWeight: "600", color: colors.ink, marginTop: 8 },
  walletRow: {
    marginTop: 16,
    borderRadius: 16,
    backgroundColor: colors.greenSoft,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  walletLabel: { fontSize: 10, letterSpacing: 1, color: colors.greenDeep, fontWeight: "600" },
  walletValue: { fontSize: 20, fontWeight: "700", color: colors.greenDeep },
  tabs: { flexDirection: "row", gap: 8, marginTop: 18 },
  tab: {
    flex: 1,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.rule,
    paddingVertical: 10,
    alignItems: "center",
  },
  tabActive: { backgroundColor: colors.green, borderColor: colors.green },
  tabText: { fontSize: 13, fontWeight: "600", color: colors.ink2 },
  tabTextActive: { color: "#fff" },
  chipsRow: { marginTop: 18 },
  chip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.rule,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginRight: 8,
  },
  chipActive: { backgroundColor: colors.greenSoft, borderColor: colors.green },
  chipText: { fontSize: 12, color: colors.ink2, fontWeight: "600" },
  chipTextActive: { color: colors.greenDeep },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 14 },
  card: {
    width: "47%",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.rule,
    backgroundColor: colors.paper,
    padding: 14,
    gap: 4,
  },
  cardDisabled: { opacity: 0.45 },
  cardIcon: { fontSize: 11, fontWeight: "700", color: colors.ink3, letterSpacing: 0.5 },
  cardName: { fontSize: 14, fontWeight: "600", color: colors.ink, marginTop: 4 },
  cardPartner: { fontSize: 11, color: colors.ink3 },
  cardPts: { fontSize: 13, fontWeight: "700", color: colors.green, marginTop: 6 },
  cardPtsDisabled: { color: colors.ink3 },
  empty: { fontSize: 13, color: colors.ink3, textAlign: "center", marginTop: 32 },
  list: { gap: 10, marginTop: 14 },
  historyItem: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.rule,
    backgroundColor: colors.paper,
    padding: 14,
  },
  historyName: { fontSize: 14, fontWeight: "600", color: colors.ink },
  historyCode: { fontSize: 12, color: colors.ink3, marginTop: 2, fontFamily: "monospace" },
  badge: { fontSize: 11, fontWeight: "700", textTransform: "uppercase", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  badgePending: { color: colors.amberDeep, backgroundColor: colors.amberSoft },
  badgeUsed: { color: colors.ink3, backgroundColor: colors.bg2 },
  sheet: {
    marginTop: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.rule,
    backgroundColor: colors.paper,
    padding: 20,
  },
  sheetTitle: { fontSize: 18, fontWeight: "600", color: colors.ink },
  sheetPartner: { fontSize: 13, color: colors.ink3, marginTop: 2 },
  sheetPts: { fontSize: 22, fontWeight: "700", color: colors.green, marginTop: 10 },
  errorText: { fontSize: 12, color: "#B23B3B", marginTop: 10 },
  primaryButton: {
    marginTop: 16,
    backgroundColor: colors.green,
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: "center",
  },
  primaryButtonText: { color: "#fff", fontWeight: "600", fontSize: 14 },
  secondaryButton: { marginTop: 10, alignItems: "center", paddingVertical: 8 },
  secondaryButtonText: { color: colors.ink3, fontSize: 13 },
  disabled: { opacity: 0.5 },
  successBox: {
    marginTop: 18,
    borderRadius: 16,
    backgroundColor: colors.greenDeep,
    padding: 16,
    alignItems: "center",
  },
  successTitle: { color: "#fff", fontWeight: "600", fontSize: 14 },
  successCode: { color: "#fff", fontSize: 24, fontWeight: "700", marginTop: 6, fontFamily: "monospace" },
  successHint: { color: "#fff", opacity: 0.85, fontSize: 12, marginTop: 8, textAlign: "center" },
  dismiss: { color: "#fff", opacity: 0.85, fontSize: 12, marginTop: 10, textDecorationLine: "underline" },
})
