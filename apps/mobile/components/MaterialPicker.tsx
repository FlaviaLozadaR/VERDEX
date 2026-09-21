import { View, Text, Pressable, StyleSheet } from "react-native"
import type { Material, MaterialId } from "@verdex/shared"
import { colors } from "../constants/theme"

const STEP = 1

/** Material + quantity picker shared by Escanear (elegir) and Validar (corregir). */
export function MaterialPicker({
  materials,
  selectedId,
  qty,
  onSelect,
  onQtyChange,
}: {
  materials: Material[]
  selectedId: MaterialId | null
  qty: number
  onSelect: (id: MaterialId) => void
  onQtyChange: (qty: number) => void
}) {
  const selected = materials.find((m) => m.id === selectedId) ?? null
  const isByWeight = selected?.sub.toLowerCase().includes("kg") ?? false
  const kg = selected ? qty * selected.kgPerUnit : 0
  const pts = selected ? Math.round(qty * selected.ptsPerUnit) : 0

  return (
    <View>
      <View style={styles.grid}>
        {materials.map((m) => {
          const active = m.id === selectedId
          return (
            <Pressable
              key={m.id}
              style={[styles.card, active && styles.cardActive]}
              onPress={() => onSelect(m.id)}
            >
              <Text style={[styles.cardIcon, active && styles.cardIconActive]}>{m.ic}</Text>
              <Text style={[styles.cardName, active && styles.cardNameActive]}>{m.nm}</Text>
              <Text style={styles.cardSub}>{m.sub}</Text>
            </Pressable>
          )
        })}
      </View>

      {selected && (
        <View style={styles.qtyBox}>
          <Text style={styles.qtyLabel}>{isByWeight ? "Kilos" : "Cantidad"}</Text>
          <View style={styles.stepper}>
            <Pressable
              style={styles.stepButton}
              onPress={() => onQtyChange(Math.max(isByWeight ? 0.1 : 1, round1(qty - STEP)))}
            >
              <Text style={styles.stepButtonText}>−</Text>
            </Pressable>
            <Text style={styles.qtyValue}>
              {qty} {isByWeight ? "kg" : "u."}
            </Text>
            <Pressable style={styles.stepButton} onPress={() => onQtyChange(round1(qty + STEP))}>
              <Text style={styles.stepButtonText}>+</Text>
            </Pressable>
          </View>
          <Text style={styles.estimate}>
            ≈ {kg.toFixed(2)} kg · {pts.toLocaleString("es-BO")} pts
          </Text>
        </View>
      )}
    </View>
  )
}

function round1(n: number) {
  return Math.round(n * 10) / 10
}

const styles = StyleSheet.create({
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  card: {
    width: "31%",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.rule,
    backgroundColor: colors.paper,
    paddingVertical: 14,
    alignItems: "center",
    gap: 4,
  },
  cardActive: { borderColor: colors.green, backgroundColor: colors.greenSoft },
  cardIcon: { fontSize: 11, fontWeight: "700", color: colors.ink3, letterSpacing: 0.5 },
  cardIconActive: { color: colors.green },
  cardName: { fontSize: 13, fontWeight: "600", color: colors.ink },
  cardNameActive: { color: colors.greenDeep },
  cardSub: { fontSize: 10, color: colors.ink3, textAlign: "center" },
  qtyBox: {
    marginTop: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.rule,
    backgroundColor: colors.paper,
    padding: 16,
    alignItems: "center",
  },
  qtyLabel: { fontSize: 10, letterSpacing: 1, textTransform: "uppercase", color: colors.ink3 },
  stepper: { flexDirection: "row", alignItems: "center", gap: 20, marginTop: 10 },
  stepButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.greenSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  stepButtonText: { fontSize: 18, color: colors.greenDeep, fontWeight: "700" },
  qtyValue: { fontSize: 20, fontWeight: "700", color: colors.ink, minWidth: 72, textAlign: "center" },
  estimate: { fontSize: 12, color: colors.ink2, marginTop: 10 },
})
