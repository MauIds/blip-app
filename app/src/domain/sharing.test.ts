import { EMPTY_PROFILE, type Profile } from './profile';
import {
  DEFAULT_SHARE_SETTINGS,
  SHAREABLE_FIELDS,
  buildSharedProfile,
  type ShareSettings,
} from './sharing';

const fullProfile: Profile = {
  ...EMPTY_PROFILE,
  displayName: 'Mau Díaz',
  badgeName: 'MAU',
  roleTitle: 'Founder en Blipz',
  roleCode: 1,
  seniority: 'lead',
  interests: ['ai_agents', 'hardware'],
  birthYear: 1995,
  eventCode: 'DD26',
  contact: {
    email: 'mau@blipz.app',
    github: 'mauids',
    linkedin: 'https://linkedin.com/in/mau',
    cvUrl: 'https://mau.dev/cv.pdf',
  },
};

const everythingOn: ShareSettings = {
  name: true,
  role: true,
  interests: true,
  github: true,
  linkedin: true,
  cv: true,
  email: true,
};

describe('share settings', () => {
  it('share only name and role by default', () => {
    expect(DEFAULT_SHARE_SETTINGS).toEqual({
      name: true,
      role: true,
      interests: false,
      github: false,
      linkedin: false,
      cv: false,
      email: false,
    });
  });

  it('never offer age as a shareable field', () => {
    expect(SHAREABLE_FIELDS).not.toContain('age');
    expect(SHAREABLE_FIELDS).not.toContain('birthYear');
  });
});

describe('buildSharedProfile', () => {
  it('returns only name and role with the default settings', () => {
    expect(buildSharedProfile(fullProfile, DEFAULT_SHARE_SETTINGS)).toEqual({
      displayName: 'Mau Díaz',
      roleTitle: 'Founder en Blipz',
      roleCode: 1,
    });
  });

  it('includes every selected field', () => {
    expect(buildSharedProfile(fullProfile, everythingOn)).toEqual({
      displayName: 'Mau Díaz',
      roleTitle: 'Founder en Blipz',
      roleCode: 1,
      interests: ['ai_agents', 'hardware'],
      github: 'mauids',
      linkedin: 'https://linkedin.com/in/mau',
      cvUrl: 'https://mau.dev/cv.pdf',
      email: 'mau@blipz.app',
    });
  });

  it('never includes the age, even with every toggle on or a forged setting', () => {
    const forged = { ...everythingOn, age: true, birthYear: true } as unknown as ShareSettings;
    const shared = buildSharedProfile(fullProfile, forged);
    expect(shared).not.toHaveProperty('birthYear');
    expect(shared).not.toHaveProperty('age');
    expect(JSON.stringify(shared)).not.toContain('1995');
  });

  it('omits selected fields that are empty in the profile', () => {
    const shared = buildSharedProfile(
      { ...fullProfile, interests: [], contact: { ...fullProfile.contact, github: '' } },
      everythingOn,
    );
    expect(shared).not.toHaveProperty('interests');
    expect(shared).not.toHaveProperty('github');
  });
});
