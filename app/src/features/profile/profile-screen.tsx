import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text } from 'react-native';

import {
  BADGE_NAME_MAX_LENGTH,
  EMPTY_PROFILE,
  EVENT_CODE_MAX_LENGTH,
  INTERESTS,
  ROLES,
  SENIORITY_LEVELS,
  sanitizeProfile,
  validateProfile,
  type ContactInfo,
  type Interest,
  type Profile,
  type ProfileErrors,
  type ProfileField,
} from '@/domain/profile';
import { useHasHydrated } from '@/services/persisted-store';
import { Button } from '@/ui/button';
import { ChipGroup } from '@/ui/chip-group';
import { Screen } from '@/ui/screen';
import { SectionTitle } from '@/ui/section-title';
import { TextField } from '@/ui/text-field';
import { colors } from '@/ui/theme';

import { useProfileStore } from './profile-store';

type Props = { onOpenSharing: () => void };

export function ProfileScreen({ onOpenSharing }: Props) {
  const hydrated = useHasHydrated(useProfileStore);
  const saved = useProfileStore((state) => state.profile);
  // The form copies the saved profile once, so it must wait until it is loaded from the phone.
  if (!hydrated) return null;
  return <ProfileForm initial={saved ?? EMPTY_PROFILE} onOpenSharing={onOpenSharing} />;
}

type Status = 'editing' | 'saved' | 'invalid';

function ProfileForm({ initial, onOpenSharing }: { initial: Profile; onOpenSharing: () => void }) {
  const { t } = useTranslation();
  const saveProfile = useProfileStore((state) => state.saveProfile);
  const [draft, setDraft] = useState(initial);
  const [birthYearText, setBirthYearText] = useState(initial.birthYear?.toString() ?? '');
  const [errors, setErrors] = useState<ProfileErrors>({});
  const [status, setStatus] = useState<Status>('editing');

  const update = (changes: Partial<Profile>) => {
    setDraft((current) => ({ ...current, ...changes }));
    setStatus('editing');
  };
  const updateContact = (changes: Partial<ContactInfo>) => {
    setDraft((current) => ({ ...current, contact: { ...current.contact, ...changes } }));
    setStatus('editing');
  };
  const toggleInterest = (interest: Interest) =>
    update({
      interests: draft.interests.includes(interest)
        ? draft.interests.filter((item) => item !== interest)
        : [...draft.interests, interest],
    });
  const errorFor = (field: ProfileField) => (errors[field] ? t(`profile.errors.${errors[field]}`) : undefined);

  const save = () => {
    const birthYear = birthYearText === '' ? null : Number(birthYearText);
    const candidate = sanitizeProfile({ ...draft, birthYear });
    const result = validateProfile(candidate);
    setDraft(candidate);
    if (!result.ok) {
      setErrors(result.errors);
      setStatus('invalid');
      return;
    }
    setErrors({});
    saveProfile(candidate);
    setStatus('saved');
  };

  return (
    <Screen>
      <SectionTitle>{t('profile.sections.about')}</SectionTitle>
      <TextField
        label={t('profile.fields.displayName')}
        placeholder={t('profile.placeholders.displayName')}
        value={draft.displayName}
        onChangeText={(displayName) => update({ displayName })}
        error={errorFor('displayName')}
        autoComplete="name"
      />
      <TextField
        label={t('profile.fields.badgeName')}
        placeholder={t('profile.placeholders.badgeName')}
        value={draft.badgeName}
        onChangeText={(badgeName) => update({ badgeName })}
        error={errorFor('badgeName')}
        hint={t('profile.hints.badgeName')}
        autoCapitalize="characters"
        autoCorrect={false}
        maxLength={BADGE_NAME_MAX_LENGTH}
      />
      <TextField
        label={t('profile.fields.roleTitle')}
        placeholder={t('profile.placeholders.roleTitle')}
        value={draft.roleTitle}
        onChangeText={(roleTitle) => update({ roleTitle })}
        error={errorFor('roleTitle')}
      />
      <ChipGroup
        label={t('profile.fields.roleCode')}
        options={ROLES.map((role) => ({ value: role.code, label: t(`profile.roles.${role.key}`) }))}
        selected={draft.roleCode === null ? [] : [draft.roleCode]}
        onToggle={(roleCode) => update({ roleCode })}
        error={errorFor('roleCode')}
      />
      <ChipGroup
        label={t('profile.fields.seniority')}
        options={SENIORITY_LEVELS.map((level) => ({ value: level, label: t(`profile.seniority.${level}`) }))}
        selected={draft.seniority === null ? [] : [draft.seniority]}
        onToggle={(seniority) => update({ seniority: draft.seniority === seniority ? null : seniority })}
      />
      <ChipGroup
        multiple
        label={t('profile.fields.interests')}
        options={INTERESTS.map((interest) => ({ value: interest, label: t(`profile.interests.${interest}`) }))}
        selected={draft.interests}
        onToggle={toggleInterest}
        error={errorFor('interests')}
        hint={t('profile.hints.interests')}
      />
      <TextField
        label={t('profile.fields.birthYear')}
        placeholder={t('profile.placeholders.birthYear')}
        value={birthYearText}
        onChangeText={(text) => {
          setBirthYearText(text.replace(/\D/g, '').slice(0, 4));
          setStatus('editing');
        }}
        error={errorFor('birthYear')}
        hint={t('profile.hints.birthYear')}
        keyboardType="number-pad"
        maxLength={4}
      />

      <SectionTitle>{t('profile.sections.event')}</SectionTitle>
      <TextField
        label={t('profile.fields.eventCode')}
        placeholder={t('profile.placeholders.eventCode')}
        value={draft.eventCode}
        onChangeText={(eventCode) => update({ eventCode })}
        error={errorFor('eventCode')}
        hint={t('profile.hints.eventCode')}
        autoCapitalize="characters"
        autoCorrect={false}
        maxLength={EVENT_CODE_MAX_LENGTH}
      />

      <SectionTitle>{t('profile.sections.contact')}</SectionTitle>
      <Text style={styles.hint}>{t('profile.hints.contact')}</Text>
      <TextField
        label={t('profile.fields.email')}
        placeholder={t('profile.placeholders.email')}
        value={draft.contact.email}
        onChangeText={(email) => updateContact({ email })}
        error={errorFor('email')}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
      />
      <TextField
        label={t('profile.fields.github')}
        placeholder={t('profile.placeholders.github')}
        value={draft.contact.github}
        onChangeText={(github) => updateContact({ github })}
        error={errorFor('github')}
        autoCapitalize="none"
        autoCorrect={false}
      />
      <TextField
        label={t('profile.fields.linkedin')}
        placeholder={t('profile.placeholders.linkedin')}
        value={draft.contact.linkedin}
        onChangeText={(linkedin) => updateContact({ linkedin })}
        error={errorFor('linkedin')}
        keyboardType="url"
        autoCapitalize="none"
        autoCorrect={false}
      />
      <TextField
        label={t('profile.fields.cvUrl')}
        placeholder={t('profile.placeholders.cvUrl')}
        value={draft.contact.cvUrl}
        onChangeText={(cvUrl) => updateContact({ cvUrl })}
        error={errorFor('cvUrl')}
        keyboardType="url"
        autoCapitalize="none"
        autoCorrect={false}
      />

      {status === 'saved' ? <Text style={[styles.status, styles.saved]}>{t('profile.saved')}</Text> : null}
      {status === 'invalid' ? <Text style={[styles.status, styles.invalid]}>{t('profile.hasErrors')}</Text> : null}
      <Button label={t('profile.save')} onPress={save} />
      <Button variant="secondary" label={t('profile.openSharing')} onPress={onOpenSharing} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  hint: { color: colors.muted, fontSize: 13 },
  status: { fontSize: 15, fontWeight: '600', textAlign: 'center' },
  saved: { color: colors.success },
  invalid: { color: colors.danger },
});
