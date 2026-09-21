import { useEffect, useRef } from "react"
import { Animated, type StyleProp, type ViewStyle } from "react-native"
import { colors } from "../constants/theme"

/** Pulsing placeholder block for loading states — same idea as the web Skeleton. */
export function Skeleton({ style }: { style?: StyleProp<ViewStyle> }) {
  const opacity = useRef(new Animated.Value(0.4)).current

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 700, useNativeDriver: true }),
      ])
    )
    loop.start()
    return () => loop.stop()
  }, [opacity])

  return <Animated.View style={[{ backgroundColor: colors.rule, borderRadius: 8, opacity }, style]} />
}
