import { useEffect, useState } from "react"
import { View, Text, Pressable, ScrollView, StyleSheet } from "react-native"
import { DEMO_USUARIO_ID, getDataSource, levelFor, LEVELS, type Txn, type UsuarioSummary } from "@verdex/shared"
import { Skeleton } from "../../components/Skeleton"
import { colors } from "../../constants/theme"

export default function Perfil() {
  const [summary, setSummary] = useState<UsuarioSummary | null>(null)
  const [activity, setActivity] = useState<Txn[]>([])

  useEffect(() => {
    getDataSource().getUsuarioSummary(DEMO_USUARIO_ID).then(setSummary)
    getDataSource().listUsuarioActivity(DEMO_USUARIO_ID).then(setActivity)
  }, [])

  if (!summary) {
    return (
      <View style={styles.page}>
        <View style={styles.content}>
          <View style={styles.identity}>
            <Skeleton style={{ width: 52, height: 52, borderRadius: 26 }} />
            <View style={{ gap: 6 }}>
              <Skeleton style={{ width: 120, height: 16 }} />
              <Skeleton style={{ width: 80, height: 12 }} />
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

  const lv = levelFor(summary.totalEarned)

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.content}>
      <Text style={styles.eyebrow}>Usuario · Perfil</Text>

      <View style={styles.identity}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>DV</Text>
        </View>
        <View>
          <Text style={styles.name}>Demo Verdex</Text>
          <Text style={styles.level}>Nivel {lv.nm}</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <Stat label="Saldo" value={summary.points.toLocaleString("es-BO")} />
        <Stat label="Histórico" value={summary.totalEarned.toLocaleString("es-BO")} />
        <Stat label="Kg reciclados" value={summary.kg.toFixed(1)} />
      </View>

      <Text style={styles.sectionTitle}>Actividad</Text>
      {activity.length === 0 ? (
        <Text style={styles.empty}>Todavía no tenés movimientos.</Text>
      ) : (
        <View style={styles.list}>
          {activity.map((t) => (
            <View key={t.id} style={styles.item}>
              <View style={styles.itemIcon}>
                <Text style={styles.itemIconText}>{t.ic}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.itemLabel}>{t.label}</Text>
                <Text style={styles.itemSub}>{t.sub}</Text>
              </View>
              <Text style={[styles.itemPts, t.pts < 0 && styles.itemPtsNegative]}>
                {t.pts > 0 ? "+" : ""}
                {t.pts.toLocaleString("es-BO")}
              </Text>
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
    color: colors.green,
    fontWeight: "600",
  },
  identity: { flexDirection: "row", alignItems: "center", gap: 14, marginTop: 16 },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.greenDeep,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  name: { fontSize: 18, fontWeight: "600", color: colors.ink },
  level: { fontSize: 12, color: colors.ink3, marginTop: 2 },
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
  statValue: { fontSize: 18, fontWeight: "600", color: colors.ink },
  statLabel: { fontSize: 9, color: colors.ink3, marginTop: 4, textTransform: "uppercase" },
  sectionTitle: { fontSize: 13, fontWeight: "600", color: colors.ink, marginTop: 28, marginBottom: 10 },
  empty: { fontSize: 13, color: colors.ink3 },
  list: { gap: 8 },
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.rule,
    backgroundColor: colors.paper,
    padding: 12,
  },
  itemIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: colors.greenSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  itemIconText: { fontSize: 10, fontWeight: "700", color: colors.greenDeep },
  itemLabel: { fontSize: 13, fontWeight: "600", color: colors.ink },
  itemSub: { fontSize: 11, color: colors.ink3, marginTop: 1 },
  itemPts: { fontSize: 13, fontWeight: "700", color: colors.green },
  itemPtsNegative: { color: colors.amberDeep },
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
