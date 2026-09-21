import { useEffect, useState } from "react"
import { View, Text, ScrollView, StyleSheet } from "react-native"
import { DEMO_RECICLADOR_ID, getDataSource, type Payout } from "@verdex/shared"
import { Skeleton } from "../../components/Skeleton"
import { colors } from "../../constants/theme"

export default function Pagos() {
  const [pending, setPending] = useState<{ kgTotal: number; amountBs: number } | null>(null)
  const [history, setHistory] = useState<Payout[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    getDataSource().getRecicladorPendingPayout(DEMO_RECICLADOR_ID).then(setPending)
    getDataSource()
      .listPayouts(DEMO_RECICLADOR_ID)
      .then((list) => {
        setHistory(list)
        setLoaded(true)
      })
  }, [])

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.content}>
      <Text style={styles.eyebrow}>Reciclador · Pagos</Text>
      <Text style={styles.title}>Mis pagos</Text>

      {pending ? (
        <View style={styles.currentBox}>
          <Text style={styles.currentLabel}>PERIODO ACTUAL · AÚN NO COBRADO</Text>
          <Text style={styles.currentAmount}>Bs {pending.amountBs.toLocaleString("es-BO")}</Text>
          <Text style={styles.currentKg}>{pending.kgTotal.toFixed(1)} kg validados</Text>
          <Text style={styles.currentHint}>Se calcula automáticamente con cada depósito que validás en campo.</Text>
        </View>
      ) : (
        <Skeleton style={{ height: 130, borderRadius: 20, marginTop: 18 }} />
      )}

      <Text style={styles.sectionTitle}>Historial de pagos</Text>
      {!loaded ? (
        <View style={styles.list}>
          <Skeleton style={{ height: 58, borderRadius: 14 }} />
          <Skeleton style={{ height: 58, borderRadius: 14 }} />
        </View>
      ) : history.length === 0 ? (
        <Text style={styles.empty}>Todavía no hay cortes de pago registrados.</Text>
      ) : (
        <View style={styles.list}>
          {history.map((p) => (
            <View key={p.id} style={styles.item}>
              <View style={{ flex: 1 }}>
                <Text style={styles.itemPeriod}>{p.period}</Text>
                <Text style={styles.itemKg}>{p.kgTotal.toFixed(1)} kg</Text>
              </View>
              <View style={{ alignItems: "flex-end" }}>
                <Text style={styles.itemAmount}>Bs {p.amountBs.toLocaleString("es-BO")}</Text>
                <Text style={[styles.badge, p.status === "pagado" ? styles.badgePaid : styles.badgePending]}>
                  {p.status}
                </Text>
              </View>
            </View>
          ))}
        </View>
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
    color: colors.amberDeep,
    fontWeight: "600",
  },
  title: { fontSize: 26, fontWeight: "600", color: colors.ink, marginTop: 8 },
  currentBox: {
    marginTop: 18,
    borderRadius: 20,
    backgroundColor: colors.amberDeep,
    padding: 20,
  },
  currentLabel: { color: "#fff", opacity: 0.85, fontSize: 10, letterSpacing: 1.2 },
  currentAmount: { color: "#fff", fontSize: 36, fontWeight: "700", marginTop: 6 },
  currentKg: { color: "#fff", opacity: 0.9, fontSize: 13, marginTop: 4 },
  currentHint: { color: "#fff", opacity: 0.8, fontSize: 11, marginTop: 10, lineHeight: 16 },
  sectionTitle: { fontSize: 13, fontWeight: "600", color: colors.ink, marginTop: 28, marginBottom: 10 },
  empty: { fontSize: 13, color: colors.ink3 },
  list: { gap: 8 },
  item: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.rule,
    backgroundColor: colors.paper,
    padding: 14,
  },
  itemPeriod: { fontSize: 14, fontWeight: "600", color: colors.ink, textTransform: "capitalize" },
  itemKg: { fontSize: 12, color: colors.ink3, marginTop: 2 },
  itemAmount: { fontSize: 14, fontWeight: "700", color: colors.ink },
  badge: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    marginTop: 4,
  },
  badgePaid: { color: colors.greenDeep, backgroundColor: colors.greenSoft },
  badgePending: { color: colors.amberDeep, backgroundColor: colors.amberSoft },
})
