import { DarkTheme, ThemeProvider } from 'expo-router';
import { NativeTabs } from 'expo-router/native-tabs';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';

import '@/i18n';
import { colors } from '@/ui/theme';

const theme = {
  ...DarkTheme,
  colors: { ...DarkTheme.colors, background: colors.background, card: colors.background, primary: colors.accent },
};

export default function TabLayout() {
  const { t } = useTranslation();

  return (
    <ThemeProvider value={theme}>
      <StatusBar style="light" />
      <NativeTabs backgroundColor={colors.background} tintColor={colors.accent}>
        <NativeTabs.Trigger name="index">
          <NativeTabs.Trigger.Label>{t('tabs.blip')}</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon sf="face.smiling" md="mood" />
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="missions">
          <NativeTabs.Trigger.Label>{t('tabs.missions')}</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon sf="medal" md="military_tech" />
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="network">
          <NativeTabs.Trigger.Label>{t('tabs.network')}</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon sf="point.3.connected.trianglepath.dotted" md="hub" />
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="badge">
          <NativeTabs.Trigger.Label>{t('tabs.badge')}</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon sf="person.text.rectangle" md="badge" />
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="profile">
          <NativeTabs.Trigger.Label>{t('tabs.profile')}</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon sf="person.crop.circle" md="account_circle" />
        </NativeTabs.Trigger>
      </NativeTabs>
    </ThemeProvider>
  );
}
