import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

import { SHAREABLE_FIELDS, buildSharedProfile, hasValueFor } from '@/domain/sharing';
import { useProfileStore } from '@/features/profile/profile-store';
import { useHasHydrated } from '@/services/persisted-store';
import { Screen } from '@/ui/screen';
import { SectionTitle } from '@/ui/section-title';
import { colors } from '@/ui/theme';
import { ToggleRow } from '@/ui/toggle-row';

import { useShareStore } from './share-store';
import { SharedProfileCard } from './shared-profile-card';

export function SharingScreen() {
  const { t } = useTranslation();
  const profileLoaded = useHasHydrated(useProfileStore);
  const settingsLoaded = useHasHydrated(useShareStore);
  const profile = useProfileStore((state) => state.profile);
  const settings = useShareStore((state) => state.settings);
  const setShared = useShareStore((state) => state.setShared);

  if (!profileLoaded || !settingsLoaded) return null;

  return (
    <Screen>
      <Text style={styles.intro}>{t('sharing.intro')}</Text>
      <View>
        {SHAREABLE_FIELDS.map((field) => {
          const available = profile !== null && hasValueFor(profile, field);
          return (
            <ToggleRow
              key={field}
              label={t(`sharing.fields.${field}`)}
              value={available && settings[field]}
              onValueChange={(shared) => setShared(field, shared)}
              disabled={!available}
              description={available ? undefined : t('sharing.missingInProfile')}
            />
          );
        })}
        {/* Fixed rule: the age has no setting, this row only explains it. */}
        <ToggleRow
          label={t('sharing.age')}
          value={false}
          onValueChange={() => undefined}
          disabled
          description={t('sharing.ageNever')}
        />
      </View>

      <SectionTitle>{t('sharing.previewTitle')}</SectionTitle>
      {profile ? (
        <SharedProfileCard shared={buildSharedProfile(profile, settings)} />
      ) : (
        <Text style={styles.intro}>{t('sharing.previewNoProfile')}</Text>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: { color: colors.muted, fontSize: 15 },
});
