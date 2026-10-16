import { StyleSheet, Switch, Text, View } from 'react-native';

import { colors, spacing } from './theme';

type Props = {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  description?: string;
  disabled?: boolean;
};

export function ToggleRow({ label, value, onValueChange, description, disabled = false }: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.texts}>
        <Text style={[styles.label, disabled ? styles.labelDisabled : null]}>{label}</Text>
        {description ? <Text style={styles.description}>{description}</Text> : null}
      </View>
      <Switch
        accessibilityLabel={label}
        accessibilityState={{ disabled, checked: value }}
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        trackColor={{ true: colors.accent, false: colors.border }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomColor: colors.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  texts: { flex: 1, gap: 2 },
  label: { color: colors.text, fontSize: 16 },
  labelDisabled: { color: colors.muted },
  description: { color: colors.muted, fontSize: 13 },
});
