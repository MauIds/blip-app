import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

import { ROLES } from '@/domain/profile';
import type { SharedProfile } from '@/domain/sharing';
import { colors, radius, spacing } from '@/ui/theme';

/** How a person looks to someone they made a PING with. Reused later by the PING network. */
export function SharedProfileCard({ shared }: { shared: SharedProfile }) {
  const { t } = useTranslation();
  const roleKey = ROLES.find((role) => role.code === shared.roleCode)?.key;
  const roleLine = [shared.roleTitle, roleKey ? t(`profile.roles.${roleKey}`) : undefined]
    .filter(Boolean)
    .join(' · ');
  const lines = [
    shared.interests?.map((interest) => t(`profile.interests.${interest}`)).join(', '),
    shared.github ? `github.com/${shared.github}` : undefined,
    shared.linkedin?.replace(/^https?:\/\//, ''),
    shared.cvUrl?.replace(/^https?:\/\//, ''),
    shared.email,
  ].filter((line): line is string => Boolean(line));

  if (!shared.displayName && !roleLine && lines.length === 0) {
    return (
      <View style={styles.card}>
        <Text style={styles.empty}>{t('sharing.previewEmpty')}</Text>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      {shared.displayName ? <Text style={styles.name}>{shared.displayName}</Text> : null}
      {roleLine ? <Text style={styles.role}>{roleLine}</Text> : null}
      {lines.map((line) => (
        <Text key={line} style={styles.line}>
          {line}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.accent,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.lg,
    gap: spacing.xs,
  },
  name: { color: colors.text, fontSize: 20, fontWeight: '700' },
  role: { color: colors.text, fontSize: 15 },
  line: { color: colors.muted, fontSize: 14 },
  empty: { color: colors.muted, fontSize: 15, textAlign: 'center' },
});
