import { useState } from "react"
import { View, Text, Pressable, StyleSheet } from "react-native"
import { CameraView, useCameraPermissions } from "expo-camera"
import { colors } from "../constants/theme"

/**
 * Shared QR entry point for Escanear (usuario) and Validar (reciclador).
 * Each caller decides how to parse the scanned string — this component only
 * handles permission state and the camera preview.
 */
export function QrScanner({
  hint,
  onScanned,
  onManual,
}: {
  hint: string
  onScanned: (data: string) => void
  onManual: () => void
}) {
  const [permission, requestPermission] = useCameraPermissions()
  const [scanned, setScanned] = useState(false)

  if (!permission) {
    return <View style={styles.box} />
  }

  if (!permission.granted) {
    return (
      <View style={styles.box}>
        <Text style={styles.title}>Necesitamos la cámara</Text>
        <Text style={styles.hint}>{hint}</Text>
        {permission.canAskAgain ? (
          <Pressable style={styles.primaryButton} onPress={requestPermission}>
            <Text style={styles.primaryButtonText}>Dar permiso de cámara</Text>
          </Pressable>
        ) : (
          <Text style={styles.hint}>
            El permiso fue denegado — habilitalo desde los ajustes del sistema, o elegí manualmente.
          </Text>
        )}
        <Pressable style={styles.secondaryButton} onPress={onManual}>
          <Text style={styles.secondaryButtonText}>Elegir manualmente</Text>
        </Pressable>
      </View>
    )
  }

  return (
    <View style={styles.box}>
      <View style={styles.cameraFrame}>
        <CameraView
          style={StyleSheet.absoluteFill}
          barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
          onBarcodeScanned={
            scanned
              ? undefined
              : ({ data }) => {
                  setScanned(true)
                  onScanned(data)
                }
          }
        />
      </View>
      <Text style={styles.hint}>{hint}</Text>
      <Pressable style={styles.secondaryButton} onPress={onManual}>
        <Text style={styles.secondaryButtonText}>No tengo el código a mano</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  box: { alignItems: "center", gap: 12 },
  title: { fontSize: 16, fontWeight: "600", color: colors.ink, textAlign: "center" },
  hint: { fontSize: 13, color: colors.ink3, textAlign: "center", lineHeight: 18 },
  cameraFrame: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: colors.ink,
  },
  primaryButton: {
    backgroundColor: colors.green,
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  primaryButtonText: { color: "#fff", fontWeight: "600", fontSize: 14 },
  secondaryButton: {
    borderWidth: 1,
    borderColor: colors.rule,
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  secondaryButtonText: { color: colors.ink2, fontWeight: "600", fontSize: 13 },
})
