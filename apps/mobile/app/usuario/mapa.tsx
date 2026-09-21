import { useEffect, useMemo, useState } from "react"
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet } from "react-native"
import { getDataSource, type CollectionPoint, type CollectionPointType } from "@verdex/shared"
import { Skeleton } from "../../components/Skeleton"
import { colors } from "../../constants/theme"

const TYPE_LABELS: Record<CollectionPointType, string> = {
  contenedor: "Contenedor",
  maquina: "Máquina inteligente",
  campus: "Campus",
  aliado: "Aliado",
}

export default function Mapa() {
  const [points, setPoints] = useState<CollectionPoint[]>([])
  const [loaded, setLoaded] = useState(false)
  const [type, setType] = useState<CollectionPointType | "todos">("todos")
  const [query, setQuery] = useState("")

  useEffect(() => {
    getDataSource()
      .listCollectionPoints()
      .then((list) => {
        setPoints(list)
        setLoaded(true)
      })
  }, [])

  const types = useMemo(() => {
    const present = Array.from(new Set(points.map((p) => p.type)))
    return present
  }, [points])

  const filtered = points.filter((p) => {
    if (type !== "todos" && p.type !== type) return false
    if (query.trim() && !`${p.name} ${p.meta}`.toLowerCase().includes(query.trim().toLowerCase())) return false
    return true
  })

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.content}>
      <Text style={styles.eyebrow}>Usuario · Mapa</Text>
      <Text style={styles.title}>Puntos de reciclaje</Text>
      <Text style={styles.description}>
        Todavía no tenemos coordenadas reales cargadas por punto, así que por ahora es una lista
        filtrable — el mapa con pines llega apenas carguemos esa ubicación.
      </Text>

      <TextInput
        style={styles.search}
        placeholder="Buscar por nombre o zona..."
        placeholderTextColor={colors.ink3}
        value={query}
        onChangeText={setQuery}
      />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsRow}>
        <Pressable style={[styles.chip, type === "todos" && styles.chipActive]} onPress={() => setType("todos")}>
          <Text style={[styles.chipText, type === "todos" && styles.chipTextActive]}>Todos</Text>
        </Pressable>
        {types.map((t) => (
          <Pressable key={t} style={[styles.chip, type === t && styles.chipActive]} onPress={() => setType(t)}>
            <Text style={[styles.chipText, type === t && styles.chipTextActive]}>{TYPE_LABELS[t]}</Text>
          </Pressable>
        ))}
      </ScrollView>

      {!loaded ? (
        <View style={styles.list}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} style={{ height: 62, borderRadius: 14 }} />
          ))}
        </View>
      ) : filtered.length === 0 ? (
        <Text style={styles.empty}>No encontramos puntos con ese filtro.</Text>
      ) : (
        <View style={styles.list}>
          {filtered.map((p) => (
            <View key={p.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardName}>{p.name}</Text>
                <Text style={styles.cardType}>{TYPE_LABELS[p.type]}</Text>
              </View>
              <Text style={styles.cardMeta}>{p.meta}</Text>
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
    color: colors.green,
    fontWeight: "600",
  },
  title: { fontSize: 26, fontWeight: "600", color: colors.ink, marginTop: 8 },
  description: { fontSize: 13, color: colors.ink3, marginTop: 8, lineHeight: 19 },
  search: {
    marginTop: 18,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.rule,
    backgroundColor: colors.paper,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.ink,
  },
  chipsRow: { marginTop: 14 },
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
  empty: { fontSize: 13, color: colors.ink3, textAlign: "center", marginTop: 32 },
  list: { gap: 10, marginTop: 16 },
  card: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.rule,
    backgroundColor: colors.paper,
    padding: 14,
  },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", gap: 8 },
  cardName: { fontSize: 14, fontWeight: "600", color: colors.ink, flex: 1 },
  cardType: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.greenDeep,
    backgroundColor: colors.greenSoft,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    textTransform: "uppercase",
  },
  cardMeta: { fontSize: 12, color: colors.ink3, marginTop: 6 },
})
