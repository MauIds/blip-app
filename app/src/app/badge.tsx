import { useTranslation } from 'react-i18next';

import { ComingSoon } from '@/ui/coming-soon';

export default function BadgeTab() {
  const { t } = useTranslation();
  return <ComingSoon title={t('comingSoon.badge.title')} body={t('comingSoon.badge.body')} />;
}
