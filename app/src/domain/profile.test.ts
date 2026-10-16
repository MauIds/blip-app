import {
  EMPTY_PROFILE,
  normalizeBadgeName,
  normalizeEventCode,
  sanitizeProfile,
  validateProfile,
  type Profile,
} from './profile';

const NOW = new Date('2026-10-16T12:00:00Z');

const validProfile: Profile = {
  ...EMPTY_PROFILE,
  displayName: 'Mau Díaz',
  badgeName: 'MAU',
  roleTitle: 'Founder en Blipz',
  roleCode: 1,
  eventCode: 'DD26',
};

describe('normalizeBadgeName', () => {
  it('uppercases and strips accents so the OLED font can draw it', () => {
    expect(normalizeBadgeName('José Ñandú')).toBe('JOSE NANDU');
  });

  it('turns symbols into single spaces', () => {
    expect(normalizeBadgeName('a__b--c')).toBe('A B C');
  });

  it('keeps at most 12 characters without a trailing space', () => {
    expect(normalizeBadgeName('Maximiliano Fernandez')).toBe('MAXIMILIANO');
  });
});

describe('normalizeEventCode', () => {
  it('keeps only uppercase letters and digits, up to 8', () => {
    expect(normalizeEventCode(' dd-26 ')).toBe('DD26');
    expect(normalizeEventCode('conference2026x')).toBe('CONFEREN');
  });
});

describe('sanitizeProfile', () => {
  it('extracts the GitHub username from a pasted URL', () => {
    const result = sanitizeProfile({
      ...validProfile,
      contact: { ...validProfile.contact, github: 'https://github.com/mauids/' },
    });
    expect(result.contact.github).toBe('mauids');
  });

  it('adds https:// to links typed without it', () => {
    const result = sanitizeProfile({
      ...validProfile,
      contact: { ...validProfile.contact, linkedin: 'linkedin.com/in/mau', cvUrl: 'mau.dev/cv.pdf' },
    });
    expect(result.contact.linkedin).toBe('https://linkedin.com/in/mau');
    expect(result.contact.cvUrl).toBe('https://mau.dev/cv.pdf');
  });

  it('trims text fields and normalizes badge name and event code', () => {
    const result = sanitizeProfile({ ...validProfile, displayName: '  Mau  ', badgeName: 'mau', eventCode: 'dd-26' });
    expect(result.displayName).toBe('Mau');
    expect(result.badgeName).toBe('MAU');
    expect(result.eventCode).toBe('DD26');
  });
});

describe('validateProfile', () => {
  it('accepts a profile with only the required fields', () => {
    expect(validateProfile(validProfile, NOW)).toEqual({ ok: true });
  });

  it('reports every missing required field', () => {
    const result = validateProfile(EMPTY_PROFILE, NOW);
    expect(result).toEqual({
      ok: false,
      errors: {
        displayName: 'required',
        badgeName: 'required',
        roleTitle: 'required',
        roleCode: 'required',
        eventCode: 'required',
      },
    });
  });

  it('rejects a birth year outside 1920 to ten years ago', () => {
    expect(validateProfile({ ...validProfile, birthYear: 1919 }, NOW)).toEqual({
      ok: false,
      errors: { birthYear: 'invalidYear' },
    });
    expect(validateProfile({ ...validProfile, birthYear: 2017 }, NOW)).toEqual({
      ok: false,
      errors: { birthYear: 'invalidYear' },
    });
    expect(validateProfile({ ...validProfile, birthYear: 2016 }, NOW)).toEqual({ ok: true });
  });

  it('rejects malformed contact data', () => {
    const result = validateProfile(
      {
        ...validProfile,
        contact: {
          email: 'mau@',
          github: 'not a user',
          linkedin: 'https://example.com/mau',
          cvUrl: 'notaurl',
        },
      },
      NOW,
    );
    expect(result).toEqual({
      ok: false,
      errors: {
        email: 'invalidEmail',
        github: 'invalidGithub',
        linkedin: 'invalidLinkedin',
        cvUrl: 'invalidUrl',
      },
    });
  });

  it('allows at most 5 interests', () => {
    const result = validateProfile(
      { ...validProfile, interests: ['ai_agents', 'web', 'mobile', 'hardware', 'iot', 'cloud'] },
      NOW,
    );
    expect(result).toEqual({ ok: false, errors: { interests: 'tooManyInterests' } });
  });
});
