import { render, screen, userEvent } from '@testing-library/react-native';

import { ProfileScreen } from './profile-screen';
import { useProfileStore } from './profile-store';

beforeEach(() => {
  useProfileStore.setState({ profile: null });
});

async function renderScreen(onOpenSharing = jest.fn()) {
  await render(<ProfileScreen onOpenSharing={onOpenSharing} />);
  return screen.findByRole('button', { name: 'Guardar perfil' });
}

test('an empty form shows every required field and saves nothing', async () => {
  const user = userEvent.setup();
  const save = await renderScreen();

  await user.press(save);

  expect(screen.getAllByText('Este campo es obligatorio.')).toHaveLength(5);
  expect(screen.getByText('Revisa los campos marcados.')).toBeOnTheScreen();
  expect(useProfileStore.getState().profile).toBeNull();
});

test('saves a cleaned-up profile on the phone', async () => {
  const user = userEvent.setup();
  const save = await renderScreen();

  await user.type(screen.getByLabelText('Nombre'), 'Mau Díaz');
  await user.type(screen.getByLabelText('Nombre en el badge'), 'mau');
  await user.type(screen.getByLabelText('Puesto'), 'Founder en Blipz');
  await user.press(screen.getByRole('radio', { name: 'Founder / CEO' }));
  await user.press(screen.getByRole('checkbox', { name: 'Hardware' }));
  await user.type(screen.getByLabelText('Año de nacimiento'), '1995');
  await user.type(screen.getByLabelText('Código del evento'), 'dd26');
  await user.type(screen.getByLabelText('Usuario de GitHub'), 'https://github.com/mauids');
  await user.press(save);

  expect(screen.getByText('Perfil guardado.')).toBeOnTheScreen();
  expect(useProfileStore.getState().profile).toMatchObject({
    displayName: 'Mau Díaz',
    badgeName: 'MAU',
    roleTitle: 'Founder en Blipz',
    roleCode: 1,
    interests: ['hardware'],
    birthYear: 1995,
    eventCode: 'DD26',
    contact: { github: 'mauids' },
  });
});

test('shows the error next to an invalid field', async () => {
  const user = userEvent.setup();
  const save = await renderScreen();

  await user.type(screen.getByLabelText('Correo'), 'mau@');
  await user.press(save);

  expect(screen.getByText('Revisa el correo.')).toBeOnTheScreen();
});

test('loads the saved profile into the form', async () => {
  useProfileStore.setState({
    profile: {
      displayName: 'Mau Díaz',
      badgeName: 'MAU',
      roleTitle: 'Founder en Blipz',
      roleCode: 1,
      seniority: null,
      interests: [],
      birthYear: null,
      eventCode: 'DD26',
      contact: { email: '', github: '', linkedin: '', cvUrl: '' },
    },
  });
  await renderScreen();

  expect(screen.getByLabelText('Nombre')).toHaveDisplayValue('Mau Díaz');
  expect(screen.getByRole('radio', { name: 'Founder / CEO' })).toBeChecked();
});

test('opens the sharing settings', async () => {
  const user = userEvent.setup();
  const onOpenSharing = jest.fn();
  await renderScreen(onOpenSharing);

  await user.press(screen.getByRole('button', { name: 'Elegir qué datos compartes' }));

  expect(onOpenSharing).toHaveBeenCalledTimes(1);
});
