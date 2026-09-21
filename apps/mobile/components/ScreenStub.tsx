import { View, Text, ScrollView, StyleSheet } from "react-native"
import { colors } from "../constants/theme"

export function ScreenStub({
  eyebrow,
  title,
  description,
  items,
}: {
  eyebrow: string
  title: string
  description: string
  items?: string[]
}) {
  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.content}>
      <Text style={styles.eyebrow}>{eyebrow}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {items?.map((item) => (
        <View key={item} style={styles.item}>
          <View style={styles.dot} />
          <Text style={styles.itemText}>{item}</Text>
        </View>
      ))}
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
  description: { fontSize: 14, color: colors.ink3, marginTop: 8, lineHeight: 20 },
  item: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.rule,
  },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.green, marginTop: 6 },
  itemText: { flex: 1, fontSize: 13, color: colors.ink2, lineHeight: 18 },
})
