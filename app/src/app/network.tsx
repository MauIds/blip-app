import { useTranslation } from 'react-i18next';

import { ComingSoon } from '@/ui/coming-soon';

export default function NetworkTab() {
  const { t } = useTranslation();
  return <ComingSoon title={t('comingSoon.network.title')} body={t('comingSoon.network.body')} />;
}
