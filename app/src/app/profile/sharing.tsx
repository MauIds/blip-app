import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { SharingScreen } from '@/features/sharing/sharing-screen';

export default function SharingRoute() {
  const { t } = useTranslation();
  return (
    <>
      <Stack.Screen options={{ title: t('sharing.title') }} />
      <SharingScreen />
    </>
  );
}
