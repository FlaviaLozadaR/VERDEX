import { useEffect, useRef, useState } from "react"
import { Animated, View, Text, ScrollView, StyleSheet } from "react-native"
import { router } from "expo-router"
import {
  DEMO_USUARIO_ID,
  getDataSource,
  type CollectionPoint,
  type Material,
  type MaterialId,
} from "@verdex/shared"
import { QrScanner } from "../../components/QrScanner"
import { MaterialPicker } from "../../components/MaterialPicker"
import { Pressed } from "../../components/Pressed"
import { colors } from "../../constants/theme"

const POINT_QR_PREFIX = "verdex:point:"

type Step = "point" | "manualPoint" | "material" | "done"

export default function Escanear() {
  const [step, setStep] = useState<Step>("point")
  const [points, setPoints] = useState<CollectionPoint[]>([])
  const [materials, setMaterials] = useState<Material[]>([])
  const [point, setPoint] = useState<CollectionPoint | null>(null)
  const [materialId, setMaterialId] = useState<MaterialId | null>(null)
  const [qty, setQty] = useState(1)
  const [pointsAwarded, setPointsAwarded] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const doneAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    getDataSource().listCollectionPoints().then(setPoints)
    getDataSource().listMaterials().then(setMaterials)
  }, [])

  useEffect(() => {
    if (step !== "done") return
    doneAnim.setValue(0)
    Animated.spring(doneAnim, { toValue: 1, useNativeDriver: true, speed: 14, bounciness: 8 }).start()
  }, [step, doneAnim])

  function choosePoint(p: CollectionPoint) {
    setPoint(p)
    setStep("material")
  }

  function handleScanned(data: string) {
    if (!data.startsWith(POINT_QR_PREFIX)) return
    const id = data.slice(POINT_QR_PREFIX.length)
    const match = points.find((p) => p.id === id)
    if (match) choosePoint(match)
  }

  async function confirm() {
    if (!point || !materialId) return
    setSubmitting(true)
    const deposit = await getDataSource().createDeposit({
      usuarioId: DEMO_USUARIO_ID,
      collectionPointId: point.id,
      material: materialId,
      qty,
    })
    setPointsAwarded(deposit.pointsAwarded)
    setSubmitting(false)
    setStep("done")
  }

  function reset() {
    setPoint(null)
    setMaterialId(null)
    setQty(1)
    setStep("point")
  }

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.content}>
      <Text style={styles.eyebrow}>Usuario · Escanear</Text>

      {step === "point" && (
        <>
          <Text style={styles.title}>Escaneá el punto de acopio</Text>
          <Text style={styles.description}>
            Apuntá la cámara al QR del contenedor o máquina donde vas a depositar.
          </Text>
          <View style={styles.block}>
            <QrScanner
              hint="El QR está pegado en el contenedor o en la máquina inteligente."
              onScanned={handleScanned}
              onManual={() => setStep("manualPoint")}
            />
          </View>
        </>
      )}

      {step === "manualPoint" && (
        <>
          <Text style={styles.title}>Elegí el punto de acopio</Text>
          <Text style={styles.description}>Seleccioná dónde estás depositando.</Text>
          <View style={styles.list}>
            {points.map((p) => (
              <Pressed key={p.id} style={styles.listItem} onPress={() => choosePoint(p)}>
                <Text style={styles.listItemName}>{p.name}</Text>
                <Text style={styles.listItemMeta}>{p.meta}</Text>
              </Pressed>
            ))}
          </View>
        </>
      )}

      {step === "material" && point && (
        <>
          <Text style={styles.title}>{point.name}</Text>
          <Text style={styles.description}>Elegí el material y la cantidad que estás depositando.</Text>
          <View style={styles.block}>
            <MaterialPicker
              materials={materials}
              selectedId={materialId}
              qty={qty}
              onSelect={setMaterialId}
              onQtyChange={setQty}
            />
          </View>
          <Pressed
            style={[styles.primaryButton, !materialId && styles.primaryButtonDisabled]}
            disabled={!materialId || submitting}
            onPress={confirm}
          >
            <Text style={styles.primaryButtonText}>{submitting ? "Registrando..." : "Confirmar depósito"}</Text>
          </Pressed>
        </>
      )}

      {step === "done" && (
        <Animated.View
          style={[
            styles.doneBox,
            {
              opacity: doneAnim,
              transform: [{ scale: doneAnim.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1] }) }],
            },
          ]}
        >
          <Text style={styles.doneEyebrow}>¡Depósito registrado!</Text>
          <Text style={styles.donePoints}>+{pointsAwarded.toLocaleString("es-BO")} pts</Text>
          <Text style={styles.doneNote}>
            Pendiente de validación — un reciclador va a confirmar el peso y material real en el
            punto de acopio antes de que sume a tu saldo. Así garantizamos que los datos del
            Dashboard ESG sean reales.
          </Text>
          <Pressed style={styles.doneButton} onPress={() => router.replace("/usuario")}>
            <Text style={styles.doneButtonText}>Volver a inicio</Text>
          </Pressed>
          <Pressed style={styles.doneButtonOutline} onPress={reset}>
            <Text style={styles.doneButtonOutlineText}>Registrar otro depósito</Text>
          </Pressed>
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
  title: { fontSize: 24, fontWeight: "600", color: colors.ink, marginTop: 8 },
  description: { fontSize: 14, color: colors.ink3, marginTop: 8, lineHeight: 20, marginBottom: 20 },
  block: { marginTop: 4 },
  list: { gap: 10, marginTop: 8 },
  listItem: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.rule,
    backgroundColor: colors.paper,
    padding: 14,
  },
  listItemName: { fontSize: 14, fontWeight: "600", color: colors.ink },
  listItemMeta: { fontSize: 12, color: colors.ink3, marginTop: 2 },
  primaryButton: {
    marginTop: 20,
    backgroundColor: colors.green,
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: "center",
  },
  primaryButtonDisabled: { opacity: 0.4 },
  primaryButtonText: { color: "#fff", fontWeight: "600", fontSize: 14 },
  secondaryButton: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: colors.rule,
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: "center",
  },
  secondaryButtonText: { color: colors.ink2, fontWeight: "600", fontSize: 14 },
  doneBox: {
    marginTop: 20,
    borderRadius: 20,
    backgroundColor: colors.greenDeep,
    padding: 24,
    alignItems: "center",
  },
  doneEyebrow: { color: "#fff", fontSize: 14, fontWeight: "600" },
  donePoints: { color: "#fff", fontSize: 40, fontWeight: "700", marginTop: 6 },
  doneNote: { color: "#fff", opacity: 0.9, fontSize: 13, textAlign: "center", marginTop: 14, lineHeight: 19 },
  doneButton: {
    marginTop: 20,
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: "center",
  },
  doneButtonText: { color: colors.greenDeep, fontWeight: "600", fontSize: 14 },
  doneButtonOutline: {
    marginTop: 12,
    width: "100%",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.5)",
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: "center",
  },
  doneButtonOutlineText: { color: "#fff", fontWeight: "600", fontSize: 14 },
})
