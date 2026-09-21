import { useCallback, useEffect, useState } from "react"
import { View, Text, Pressable, ScrollView, StyleSheet, RefreshControl } from "react-native"
import {
  DEMO_RECICLADOR_ID,
  getDataSource,
  type CollectionPoint,
  type Deposit,
  type Material,
  type MaterialId,
} from "@verdex/shared"
import { QrScanner } from "../../components/QrScanner"
import { MaterialPicker } from "../../components/MaterialPicker"
import { Pressed } from "../../components/Pressed"
import { colors } from "../../constants/theme"

const DEPOSIT_QR_PREFIX = "verdex:deposit:"

type Step = "list" | "scan" | "detail"

export default function Validar() {
  const [view, setView] = useState<Step>("list")
  const [pending, setPending] = useState<Deposit[]>([])
  const [points, setPoints] = useState<CollectionPoint[]>([])
  const [materials, setMaterials] = useState<Material[]>([])
  const [selected, setSelected] = useState<Deposit | null>(null)
  const [materialId, setMaterialId] = useState<MaterialId | null>(null)
  const [qty, setQty] = useState(1)
  const [busy, setBusy] = useState(false)

  const loadPending = useCallback(() => {
    getDataSource().listPendingDepositsForReciclador(DEMO_RECICLADOR_ID).then(setPending)
  }, [])

  useEffect(() => {
    loadPending()
    getDataSource().listCollectionPoints().then(setPoints)
    getDataSource().listMaterials().then(setMaterials)
  }, [loadPending])

  function openDetail(deposit: Deposit) {
    const material = materials.find((m) => m.id === deposit.material)
    setSelected(deposit)
    setMaterialId(deposit.material)
    setQty(material ? round1(deposit.kg / material.kgPerUnit) : deposit.kg)
    setView("detail")
  }

  function handleScanned(data: string) {
    if (!data.startsWith(DEPOSIT_QR_PREFIX)) return
    const id = data.slice(DEPOSIT_QR_PREFIX.length)
    const match = pending.find((d) => d.id === id)
    if (match) openDetail(match)
  }

  function backToList() {
    setSelected(null)
    setView("list")
    loadPending()
  }

  async function validate() {
    if (!selected || !materialId) return
    setBusy(true)
    await getDataSource().validateDeposit(selected.id, DEMO_RECICLADOR_ID, { material: materialId, qty })
    setBusy(false)
    backToList()
  }

  async function reject() {
    if (!selected) return
    setBusy(true)
    await getDataSource().rejectDeposit(selected.id, DEMO_RECICLADOR_ID)
    setBusy(false)
    backToList()
  }

  const pointName = (id: string) => points.find((p) => p.id === id)?.name ?? id

  return (
    <ScrollView
      style={styles.page}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={false} onRefresh={loadPending} />}
    >
      <Text style={styles.eyebrow}>Reciclador · Validar</Text>

      {view === "list" && (
        <>
          <Text style={styles.title}>Depósitos pendientes</Text>
          <Text style={styles.description}>
            Confirmá en persona el peso y material real de cada depósito en tus puntos asignados —
            esto es lo que le da veracidad al Dashboard ESG de las empresas.
          </Text>

          <Pressed style={styles.scanEntry} onPress={() => setView("scan")}>
            <Text style={styles.scanEntryText}>Escanear código del depósito</Text>
          </Pressed>

          {pending.length === 0 ? (
            <Text style={styles.empty}>No hay depósitos pendientes en tus puntos ahora mismo.</Text>
          ) : (
            <View style={styles.list}>
              {pending.map((d) => (
                <Pressed key={d.id} style={styles.listItem} onPress={() => openDetail(d)}>
                  <Text style={styles.listItemPoint}>{pointName(d.collectionPointId)}</Text>
                  <Text style={styles.listItemMeta}>
                    {materials.find((m) => m.id === d.material)?.nm ?? d.material} · {d.kg.toFixed(2)} kg ·{" "}
                    {timeAgo(d.createdAt)}
                  </Text>
                </Pressed>
              ))}
            </View>
          )}
        </>
      )}

      {view === "scan" && (
        <>
          <Text style={styles.title}>Escaneá el código</Text>
          <Text style={styles.description}>
            El código lo muestra la app del usuario al momento de registrar el depósito.
          </Text>
          <QrScanner
            hint="Apuntá al código que te muestra el usuario."
            onScanned={handleScanned}
            onManual={() => setView("list")}
          />
        </>
      )}

      {view === "detail" && selected && (
        <>
          <Text style={styles.title}>{pointName(selected.collectionPointId)}</Text>
          <Text style={styles.description}>
            Reportado por el usuario: {materials.find((m) => m.id === selected.material)?.nm} ·{" "}
            {selected.kg.toFixed(2)} kg. Corregí si no coincide con lo que ves en persona.
          </Text>

          <MaterialPicker
            materials={materials}
            selectedId={materialId}
            qty={qty}
            onSelect={setMaterialId}
            onQtyChange={setQty}
          />

          <Pressed style={[styles.primaryButton, busy && styles.disabled]} disabled={busy} onPress={validate}>
            <Text style={styles.primaryButtonText}>{busy ? "Guardando..." : "Validar depósito"}</Text>
          </Pressed>
          <Pressed style={[styles.rejectButton, busy && styles.disabled]} disabled={busy} onPress={reject}>
            <Text style={styles.rejectButtonText}>Rechazar</Text>
          </Pressed>
          <Pressable style={styles.secondaryButton} onPress={backToList}>
            <Text style={styles.secondaryButtonText}>Cancelar</Text>
          </Pressable>
        </>
      )}
    </ScrollView>
  )
}

function round1(n: number) {
  return Math.round(n * 10) / 10
}

function timeAgo(iso: string) {
  const mins = Math.max(1, Math.round((Date.now() - new Date(iso).getTime()) / 60000))
  if (mins < 60) return `hace ${mins} min`
  const hours = Math.round(mins / 60)
  return `hace ${hours} h`
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
  title: { fontSize: 24, fontWeight: "600", color: colors.ink, marginTop: 8 },
  description: { fontSize: 14, color: colors.ink3, marginTop: 8, lineHeight: 20, marginBottom: 16 },
  scanEntry: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.amberDeep,
    backgroundColor: colors.amberSoft,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 18,
  },
  scanEntryText: { color: colors.amberDeep, fontWeight: "600", fontSize: 14 },
  empty: { fontSize: 13, color: colors.ink3, textAlign: "center", marginTop: 24 },
  list: { gap: 10 },
  listItem: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.rule,
    backgroundColor: colors.paper,
    padding: 14,
  },
  listItemPoint: { fontSize: 14, fontWeight: "600", color: colors.ink },
  listItemMeta: { fontSize: 12, color: colors.ink3, marginTop: 2 },
  primaryButton: {
    marginTop: 20,
    backgroundColor: colors.amberDeep,
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: "center",
  },
  primaryButtonText: { color: "#fff", fontWeight: "600", fontSize: 14 },
  rejectButton: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: colors.rule,
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: "center",
  },
  rejectButtonText: { color: colors.ink2, fontWeight: "600", fontSize: 14 },
  secondaryButton: { marginTop: 12, alignItems: "center", paddingVertical: 8 },
  secondaryButtonText: { color: colors.ink3, fontSize: 13 },
  disabled: { opacity: 0.5 },
})
