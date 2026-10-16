import { fireEvent, render, screen } from '@testing-library/react-native';

import { EMPTY_PROFILE, type Profile } from '@/domain/profile';
import { DEFAULT_SHARE_SETTINGS } from '@/domain/sharing';
import { useProfileStore } from '@/features/profile/profile-store';

import { SharingScreen } from './sharing-screen';
import { useShareStore } from './share-store';

const profile: Profile = {
  ...EMPTY_PROFILE,
  displayName: 'Mau Díaz',
  badgeName: 'MAU',
  roleTitle: 'Founder en Blipz',
  roleCode: 1,
  birthYear: 1995,
  eventCode: 'DD26',
  contact: { email: 'mau@blipz.app', github: 'mauids', linkedin: '', cvUrl: '' },
};

beforeEach(() => {
  useProfileStore.setState({ profile });
  useShareStore.setState({ settings: DEFAULT_SHARE_SETTINGS });
});

test('age is always off and cannot be turned on', async () => {
  await render(<SharingScreen />);

  const age = await screen.findByRole('switch', { name: 'Edad' });
  expect(age).toBeDisabled();
  expect(age).not.toBeChecked();
  expect(screen.getByText('Nunca se comparte. Es una regla fija.')).toBeOnTheScreen();
});

test('the preview starts with name and role only, and never the age', async () => {
  await render(<SharingScreen />);

  expect(await screen.findByText('Mau Díaz')).toBeOnTheScreen();
  expect(screen.getByText('Founder en Blipz · Founder / CEO')).toBeOnTheScreen();
  expect(screen.queryByText('github.com/mauids')).not.toBeOnTheScreen();
  expect(screen.queryByText(/1995/)).not.toBeOnTheScreen();
});

test('turning GitHub on adds it to the preview and remembers the choice', async () => {
  await render(<SharingScreen />);

  await fireEvent(await screen.findByRole('switch', { name: 'GitHub' }), 'valueChange', true);

  expect(screen.getByText('github.com/mauids')).toBeOnTheScreen();
  expect(useShareStore.getState().settings.github).toBe(true);
});

test('a field missing from the profile cannot be shared', async () => {
  await render(<SharingScreen />);

  expect(await screen.findByRole('switch', { name: 'LinkedIn' })).toBeDisabled();
  expect(screen.getAllByText('Agrégalo en tu perfil para poder compartirlo.').length).toBeGreaterThan(0);
});

test('turning everything off leaves an empty preview', async () => {
  useShareStore.setState({ settings: { ...DEFAULT_SHARE_SETTINGS, name: false, role: false } });
  await render(<SharingScreen />);

  expect(await screen.findByText('No compartes ningún dato.')).toBeOnTheScreen();
});

test('asks to complete the profile when there is none yet', async () => {
  useProfileStore.setState({ profile: null });
  await render(<SharingScreen />);

  expect(await screen.findByText('Completa tu perfil para ver cómo te verán.')).toBeOnTheScreen();
});
