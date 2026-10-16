import { StyleSheet, Text } from 'react-native';

import { colors } from './theme';

/** Shows the error if there is one, otherwise the hint. */
export function FieldMessage({ error, hint }: { error?: string; hint?: string }) {
  if (error) return <Text style={[styles.text, styles.error]}>{error}</Text>;
  if (hint) return <Text style={styles.text}>{hint}</Text>;
  return null;
}

const styles = StyleSheet.create({
  text: { color: colors.muted, fontSize: 13 },
  error: { color: colors.danger },
});
