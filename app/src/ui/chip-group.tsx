import { Pressable, StyleSheet, Text, View } from 'react-native';

import { FieldMessage } from './field-message';
import { colors, radius, spacing } from './theme';

export type ChipOption<T> = { value: T; label: string };

type Props<T> = {
  label: string;
  options: readonly ChipOption<T>[];
  selected: readonly T[];
  onToggle: (value: T) => void;
  multiple?: boolean;
  error?: string;
  hint?: string;
};

export function ChipGroup<T extends string | number>({
  label,
  options,
  selected,
  onToggle,
  multiple = false,
  error,
  hint,
}: Props<T>) {
  return (
    <View style={styles.group}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.chips} accessibilityRole={multiple ? undefined : 'radiogroup'}>
        {options.map((option) => {
          const checked = selected.includes(option.value);
          return (
            <Pressable
              key={option.value}
              accessibilityRole={multiple ? 'checkbox' : 'radio'}
              accessibilityState={{ checked }}
              accessibilityLabel={option.label}
              onPress={() => onToggle(option.value)}
              style={[styles.chip, checked ? styles.chipChecked : null]}>
              <Text style={[styles.chipText, checked ? styles.chipTextChecked : null]}>{option.label}</Text>
            </Pressable>
          );
        })}
      </View>
      <FieldMessage error={error} hint={hint} />
    </View>
  );
}

const styles = StyleSheet.create({
  group: { gap: spacing.sm },
  label: { color: colors.text, fontSize: 15, fontWeight: '600' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  chipChecked: { backgroundColor: colors.accent, borderColor: colors.accent },
  chipText: { color: colors.text, fontSize: 14 },
  chipTextChecked: { color: colors.onAccent, fontWeight: '600' },
});
