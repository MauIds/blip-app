import { Pressable, StyleSheet, Text } from 'react-native';

import { colors, radius, spacing } from './theme';

type Props = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
};

export function Button({ label, onPress, variant = 'primary' }: Props) {
  const primary = variant === 'primary';
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        primary ? styles.primary : styles.secondary,
        pressed ? styles.pressed : null,
      ]}>
      <Text style={[styles.text, primary ? styles.textPrimary : null]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
  },
  primary: { backgroundColor: colors.accent },
  secondary: { borderColor: colors.border, borderWidth: 1 },
  pressed: { opacity: 0.7 },
  text: { color: colors.text, fontSize: 16, fontWeight: '600' },
  textPrimary: { color: colors.onAccent },
});
