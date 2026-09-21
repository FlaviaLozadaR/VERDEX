import { useEffect, useState } from "react"
import { View, Text, ScrollView, StyleSheet } from "react-native"
import { router } from "expo-router"
import { DEMO_RECICLADOR_ID, getDataSource, type CollectionPoint, type Deposit } from "@verdex/shared"
import { Pressed } from "../../components/Pressed"
import { Skeleton } from "../../components/Skeleton"
import { colors } from "../../constants/theme"

export default function MiZona() {
  const [points, setPoints] = useState<CollectionPoint[]>([])
  const [pending, setPending] = useState<Deposit[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    getDataSource()
      .listCollectionPoints()
      .then((all) => {
        setPoints(all.filter((p) => p.recicladorId === DEMO_RECICLADOR_ID))
        setLoaded(true)
      })
    getDataSource().listPendingDepositsForReciclador(DEMO_RECICLADOR_ID).then(setPending)
  }, [])

  const pendingByPoint = (pointId: string) => pending.filter((d) => d.collectionPointId === pointId).length
  const totalPending = pending.length

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.content}>
      <Text style={styles.eyebrow}>Reciclador · Mi zona</Text>
      <Text style={styles.title}>Puntos asignados</Text>
      <Text style={styles.description}>
        Este es el rol que le da veracidad real al sistema: acá confirmás en campo lo que cada
        usuario dijo haber depositado.
      </Text>

      {totalPending > 0 && (
        <Pressed style={styles.banner} onPress={() => router.push("/reciclador/validar")}>
          <Text style={styles.bannerText}>
            {totalPending} depósito{totalPending === 1 ? "" : "s"} esperando validación
          </Text>
          <Text style={styles.bannerLink}>Ir a validar →</Text>
        </Pressed>
      )}

      {!loaded ? (
        <View style={styles.list}>
          <Skeleton style={{ height: 62, borderRadius: 14 }} />
          <Skeleton style={{ height: 62, borderRadius: 14 }} />
        </View>
      ) : points.length === 0 ? (
        <Text style={styles.empty}>Todavía no tenés puntos de acopio asignados.</Text>
      ) : (
        <View style={styles.list}>
          {points.map((p) => {
            const count = pendingByPoint(p.id)
            return (
              <View key={p.id} style={styles.card}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardName}>{p.name}</Text>
                  <Text style={styles.cardMeta}>{p.meta}</Text>
                </View>
                <Text style={[styles.badge, count > 0 ? styles.badgePending : styles.badgeClear]}>
                  {count > 0 ? `${count} pendiente${count === 1 ? "" : "s"}` : "Al día"}
                </Text>
              </View>
            )
          })}
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
  description: { fontSize: 13, color: colors.ink3, marginTop: 8, lineHeight: 19 },
  banner: {
    marginTop: 18,
    borderRadius: 14,
    backgroundColor: colors.amberSoft,
    borderWidth: 1,
    borderColor: colors.amberDeep,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  bannerText: { fontSize: 13, fontWeight: "600", color: colors.amberDeep, flex: 1 },
  bannerLink: { fontSize: 12, fontWeight: "700", color: colors.amberDeep },
  empty: { fontSize: 13, color: colors.ink3, textAlign: "center", marginTop: 32 },
  list: { gap: 10, marginTop: 20 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.rule,
    backgroundColor: colors.paper,
    padding: 14,
  },
  cardName: { fontSize: 14, fontWeight: "600", color: colors.ink },
  cardMeta: { fontSize: 12, color: colors.ink3, marginTop: 2 },
  badge: {
    fontSize: 10,
    fontWeight: "700",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    textAlign: "center",
  },
  badgePending: { color: colors.amberDeep, backgroundColor: colors.amberSoft },
  badgeClear: { color: colors.greenDeep, backgroundColor: colors.greenSoft },
})
