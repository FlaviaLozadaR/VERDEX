import { useEffect, useState } from "react"
import { View, Text, Pressable, ScrollView, StyleSheet } from "react-native"
import { DEMO_RECICLADOR_ID, getDataSource, type CollectionPoint, type RecicladorProfile } from "@verdex/shared"
import { Skeleton } from "../../components/Skeleton"
import { colors } from "../../constants/theme"

export default function PerfilReciclador() {
  const [profile, setProfile] = useState<RecicladorProfile | null>(null)
  const [zonePoints, setZonePoints] = useState<CollectionPoint[]>([])
  const [pendingCount, setPendingCount] = useState(0)

  useEffect(() => {
    getDataSource().getRecicladorProfile(DEMO_RECICLADOR_ID).then(setProfile)
    getDataSource()
      .listCollectionPoints()
      .then((points) => setZonePoints(points.filter((p) => p.recicladorId === DEMO_RECICLADOR_ID)))
    getDataSource()
      .listPendingDepositsForReciclador(DEMO_RECICLADOR_ID)
      .then((deposits) => setPendingCount(deposits.length))
  }, [])

  if (!profile) {
    return (
      <View style={styles.page}>
        <View style={styles.content}>
          <View style={styles.identity}>
            <Skeleton style={{ width: 52, height: 52, borderRadius: 26 }} />
            <View style={{ gap: 6 }}>
              <Skeleton style={{ width: 120, height: 16 }} />
              <Skeleton style={{ width: 90, height: 12 }} />
            </View>
          </View>
          <View style={styles.statsRow}>
            <Skeleton style={{ flex: 1, height: 56, borderRadius: 14 }} />
            <Skeleton style={{ flex: 1, height: 56, borderRadius: 14 }} />
            <Skeleton style={{ flex: 1, height: 56, borderRadius: 14 }} />
          </View>
        </View>
      </View>
    )
  }

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.content}>
      <Text style={styles.eyebrow}>Reciclador · Perfil</Text>

      <View style={styles.identity}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {profile.operatorName
              .split(" ")
              .map((w) => w[0])
              .slice(0, 2)
              .join("")}
          </Text>
        </View>
        <View>
          <Text style={styles.name}>{profile.operatorName}</Text>
          <Text style={styles.zone}>{profile.zone}</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <Stat label="Tarifa" value={`Bs ${profile.payoutRateBsKg}/kg`} />
        <Stat label="Puntos asignados" value={String(zonePoints.length)} />
        <Stat label="Pendientes" value={String(pendingCount)} />
      </View>

      <Text style={styles.sectionTitle}>Zona asignada</Text>
      {zonePoints.length === 0 ? (
        <Text style={styles.empty}>Todavía no tenés puntos de acopio asignados.</Text>
      ) : (
        <View style={styles.list}>
          {zonePoints.map((p) => (
            <View key={p.id} style={styles.item}>
              <Text style={styles.itemName}>{p.name}</Text>
              <Text style={styles.itemMeta}>{p.meta}</Text>
            </View>
          ))}
        </View>
      )}

      <Text style={styles.sectionTitle}>Ajustes</Text>
      <Pressable style={styles.logoutButton} disabled>
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </Pressable>
      <Text style={styles.logoutHint}>
        Se habilita cuando esté conectado Supabase Auth — hoy estás explorando con un perfil demo.
      </Text>
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
  content: { padding: 20, paddingTop: 28, paddingBottom: 40 },
  eyebrow: {
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    color: colors.amberDeep,
    fontWeight: "600",
  },
  identity: { flexDirection: "row", alignItems: "center", gap: 14, marginTop: 16 },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.amberDeep,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  name: { fontSize: 18, fontWeight: "600", color: colors.ink },
  zone: { fontSize: 12, color: colors.ink3, marginTop: 2 },
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
  statValue: { fontSize: 15, fontWeight: "600", color: colors.ink },
  statLabel: { fontSize: 9, color: colors.ink3, marginTop: 4, textTransform: "uppercase", textAlign: "center" },
  sectionTitle: { fontSize: 13, fontWeight: "600", color: colors.ink, marginTop: 28, marginBottom: 10 },
  empty: { fontSize: 13, color: colors.ink3 },
  list: { gap: 8 },
  item: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.rule,
    backgroundColor: colors.paper,
    padding: 12,
  },
  itemName: { fontSize: 13, fontWeight: "600", color: colors.ink },
  itemMeta: { fontSize: 11, color: colors.ink3, marginTop: 2 },
  logoutButton: {
    borderWidth: 1,
    borderColor: colors.rule,
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: "center",
    opacity: 0.5,
  },
  logoutText: { color: colors.ink2, fontWeight: "600", fontSize: 14 },
  logoutHint: { fontSize: 11, color: colors.ink3, marginTop: 8, textAlign: "center" },
})
