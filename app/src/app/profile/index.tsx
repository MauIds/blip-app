import { router, Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { ProfileScreen } from '@/features/profile/profile-screen';

export default function ProfileRoute() {
  const { t } = useTranslation();
  return (
    <>
      <Stack.Screen options={{ title: t('profile.title') }} />
      <ProfileScreen onOpenSharing={() => router.push('/profile/sharing')} />
    </>
  );
}
