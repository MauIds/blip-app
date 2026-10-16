import { useTranslation } from 'react-i18next';

import { ComingSoon } from '@/ui/coming-soon';

export default function MissionsTab() {
  const { t } = useTranslation();
  return <ComingSoon title={t('comingSoon.missions.title')} body={t('comingSoon.missions.body')} />;
}
