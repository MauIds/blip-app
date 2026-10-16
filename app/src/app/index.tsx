import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { useProfileStore } from '@/features/profile/profile-store';
import { Button } from '@/ui/button';
import { ComingSoon } from '@/ui/coming-soon';

export default function BlipTab() {
  const { t } = useTranslation();
  const hasProfile = useProfileStore((state) => state.profile !== null);

  return (
    <ComingSoon title={t('comingSoon.blip.title')} body={t('comingSoon.blip.body')}>
      {hasProfile ? null : <Button label={t('comingSoon.completeProfile')} onPress={() => router.push('/profile')} />}
    </ComingSoon>
  );
}
