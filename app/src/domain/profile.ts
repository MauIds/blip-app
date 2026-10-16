import { z } from 'zod';

// role_code travels inside every PING, so these numbers are part of the badge contract.
export const ROLES = [
  { code: 1, key: 'founder' },
  { code: 2, key: 'cto' },
  { code: 3, key: 'fullstack' },
  { code: 4, key: 'frontend' },
  { code: 5, key: 'backend' },
  { code: 6, key: 'mobile' },
  { code: 7, key: 'data_ai' },
  { code: 8, key: 'product' },
  { code: 9, key: 'design' },
  { code: 10, key: 'student' },
  { code: 11, key: 'other' },
] as const;
export type RoleCode = (typeof ROLES)[number]['code'];

export const SENIORITY_LEVELS = ['student', 'junior', 'semi_senior', 'senior', 'lead'] as const;
export type Seniority = (typeof SENIORITY_LEVELS)[number];

export const INTERESTS = [
  'ai_agents',
  'web',
  'mobile',
  'hardware',
  'iot',
  'cloud',
  'data',
  'design',
  'product',
  'startups',
  'security',
  'gaming',
] as const;
export type Interest = (typeof INTERESTS)[number];

export const MAX_INTERESTS = 5;
export const BADGE_NAME_MAX_LENGTH = 12;
export const EVENT_CODE_MAX_LENGTH = 8;
const TEXT_MAX_LENGTH = 40;
const MIN_BIRTH_YEAR = 1920;
const MIN_AGE_YEARS = 10;

export type ContactInfo = {
  email: string;
  github: string;
  linkedin: string;
  cvUrl: string;
};

export type Profile = {
  displayName: string;
  badgeName: string;
  roleTitle: string;
  roleCode: RoleCode | null;
  seniority: Seniority | null;
  interests: Interest[];
  // Private: used only to tailor missions, never shared (see domain/sharing.ts).
  birthYear: number | null;
  eventCode: string;
  contact: ContactInfo;
};

export const EMPTY_PROFILE: Profile = {
  displayName: '',
  badgeName: '',
  roleTitle: '',
  roleCode: null,
  seniority: null,
  interests: [],
  birthYear: null,
  eventCode: '',
  contact: { email: '', github: '', linkedin: '', cvUrl: '' },
};

export type ProfileField = Exclude<keyof Profile, 'contact'> | keyof ContactInfo;

export type ProfileErrorKey =
  | 'required'
  | 'tooLong'
  | 'invalidBadgeName'
  | 'invalidEventCode'
  | 'invalidYear'
  | 'invalidEmail'
  | 'invalidGithub'
  | 'invalidLinkedin'
  | 'invalidUrl'
  | 'tooManyInterests';

export type ProfileErrors = Partial<Record<ProfileField, ProfileErrorKey>>;
export type ProfileValidation = { ok: true } | { ok: false; errors: ProfileErrors };

function stripAccents(value: string): string {
  return value.normalize('NFD').replace(/[̀-ͯ]/g, '');
}

/** Uppercase A-Z, digits and single spaces only: the badge's pixel font has nothing else. */
export function normalizeBadgeName(input: string): string {
  return stripAccents(input)
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, ' ')
    .trim()
    .slice(0, BADGE_NAME_MAX_LENGTH)
    .trim();
}

export function normalizeEventCode(input: string): string {
  return stripAccents(input)
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, EVENT_CODE_MAX_LENGTH);
}

function githubHandle(input: string): string {
  return input
    .trim()
    .replace(/^(https?:\/\/)?(www\.)?github\.com\//i, '')
    .replace(/^@/, '')
    .split('/')[0];
}

function withProtocol(input: string): string {
  const value = input.trim();
  if (value === '' || /^https?:\/\//i.test(value)) return value;
  return `https://${value}`;
}

/** Cleans what people type or paste before it is validated and saved. */
export function sanitizeProfile(profile: Profile): Profile {
  return {
    ...profile,
    displayName: profile.displayName.trim(),
    badgeName: normalizeBadgeName(profile.badgeName),
    roleTitle: profile.roleTitle.trim(),
    eventCode: normalizeEventCode(profile.eventCode),
    contact: {
      email: profile.contact.email.trim(),
      github: githubHandle(profile.contact.github),
      linkedin: withProtocol(profile.contact.linkedin),
      cvUrl: withProtocol(profile.contact.cvUrl),
    },
  };
}

function parseWebUrl(value: string): URL | null {
  try {
    const url = new URL(value);
    const isWeb = url.protocol === 'https:' || url.protocol === 'http:';
    return isWeb && url.hostname.includes('.') ? url : null;
  } catch {
    return null;
  }
}

const emailSchema = z.email();
const GITHUB_HANDLE = /^[A-Za-z0-9](?:[A-Za-z0-9]|-(?=[A-Za-z0-9])){0,38}$/;
const BADGE_NAME = /^[A-Z0-9 ]{1,12}$/;
const EVENT_CODE = /^[A-Z0-9]{2,8}$/;

export function validateProfile(profile: Profile, now: Date = new Date()): ProfileValidation {
  const errors: ProfileErrors = {};

  const requireText = (field: 'displayName' | 'roleTitle') => {
    if (profile[field] === '') errors[field] = 'required';
    else if (profile[field].length > TEXT_MAX_LENGTH) errors[field] = 'tooLong';
  };
  requireText('displayName');
  requireText('roleTitle');

  if (profile.badgeName === '') errors.badgeName = 'required';
  else if (!BADGE_NAME.test(profile.badgeName)) errors.badgeName = 'invalidBadgeName';

  if (profile.roleCode === null) errors.roleCode = 'required';

  if (profile.eventCode === '') errors.eventCode = 'required';
  else if (!EVENT_CODE.test(profile.eventCode)) errors.eventCode = 'invalidEventCode';

  if (profile.birthYear !== null) {
    const latest = now.getUTCFullYear() - MIN_AGE_YEARS;
    const year = profile.birthYear;
    if (!Number.isInteger(year) || year < MIN_BIRTH_YEAR || year > latest) {
      errors.birthYear = 'invalidYear';
    }
  }

  if (profile.interests.length > MAX_INTERESTS) errors.interests = 'tooManyInterests';

  const { email, github, linkedin, cvUrl } = profile.contact;
  if (email !== '' && !emailSchema.safeParse(email).success) errors.email = 'invalidEmail';
  if (github !== '' && !GITHUB_HANDLE.test(github)) errors.github = 'invalidGithub';
  if (linkedin !== '') {
    const host = parseWebUrl(linkedin)?.hostname.toLowerCase();
    if (!host || !(host === 'linkedin.com' || host.endsWith('.linkedin.com'))) {
      errors.linkedin = 'invalidLinkedin';
    }
  }
  if (cvUrl !== '' && parseWebUrl(cvUrl) === null) errors.cvUrl = 'invalidUrl';

  return Object.keys(errors).length === 0 ? { ok: true } : { ok: false, errors };
}
