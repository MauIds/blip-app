import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing } from './theme';

/** Placeholder for tabs whose phase has not been built yet. */
export function ComingSoon({ title, body, children }: { title: string; body: string; children?: ReactNode }) {
  return (
    <View style={styles.container}>
      <Text accessibilityRole="header" style={styles.title}>
        {title}
      </Text>
      <Text style={styles.body}>{body}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    gap: spacing.md,
  },
  title: { color: colors.text, fontSize: 24, fontWeight: '700' },
  body: { color: colors.muted, fontSize: 16, textAlign: 'center' },
});
