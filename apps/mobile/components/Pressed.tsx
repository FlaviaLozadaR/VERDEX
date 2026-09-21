import { useRef } from "react"
import {
  Animated,
  Pressable,
  type GestureResponderEvent,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from "react-native"

/**
 * Drop-in replacement for `Pressable` that adds a small scale-down animation
 * on press — RN's built-in `Animated` API only, no new dependency (see the
 * design-polish plan: reanimated is deliberately avoided here since it's
 * what broke the web bundle earlier this project).
 */
export function Pressed({
  children,
  style,
  disabled,
  onPressIn,
  onPressOut,
  ...props
}: PressableProps & { style?: StyleProp<ViewStyle>; children?: React.ReactNode }) {
  const scale = useRef(new Animated.Value(1)).current

  function animateTo(value: number) {
    Animated.spring(scale, { toValue: value, useNativeDriver: true, speed: 50, bounciness: 4 }).start()
  }

  function handlePressIn(e: GestureResponderEvent) {
    if (!disabled) animateTo(0.96)
    onPressIn?.(e)
  }

  function handlePressOut(e: GestureResponderEvent) {
    animateTo(1)
    onPressOut?.(e)
  }

  return (
    <Pressable disabled={disabled} onPressIn={handlePressIn} onPressOut={handlePressOut} {...props}>
      <Animated.View style={[style, { transform: [{ scale }] }, disabled ? { opacity: 0.5 } : null]}>
        {children}
      </Animated.View>
    </Pressable>
  )
}
