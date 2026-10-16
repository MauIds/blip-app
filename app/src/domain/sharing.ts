import type { Interest, Profile, RoleCode } from './profile';

// Age is deliberately absent: there is no setting that could ever share it.
export const SHAREABLE_FIELDS = ['name', 'role', 'interests', 'github', 'linkedin', 'cv', 'email'] as const;
export type ShareableField = (typeof SHAREABLE_FIELDS)[number];

export type ShareSettings = Record<ShareableField, boolean>;

export const DEFAULT_SHARE_SETTINGS: ShareSettings = {
  name: true,
  role: true,
  interests: false,
  github: false,
  linkedin: false,
  cv: false,
  email: false,
};

export type SharedProfile = {
  displayName?: string;
  roleTitle?: string;
  roleCode?: RoleCode;
  interests?: Interest[];
  github?: string;
  linkedin?: string;
  cvUrl?: string;
  email?: string;
};

/** Whether the profile has a value for a field, so sharing it would show something. */
export function hasValueFor(profile: Profile, field: ShareableField): boolean {
  switch (field) {
    case 'name':
      return profile.displayName !== '';
    case 'role':
      return profile.roleTitle !== '' || profile.roleCode !== null;
    case 'interests':
      return profile.interests.length > 0;
    case 'github':
      return profile.contact.github !== '';
    case 'linkedin':
      return profile.contact.linkedin !== '';
    case 'cv':
      return profile.contact.cvUrl !== '';
    case 'email':
      return profile.contact.email !== '';
  }
}

/**
 * What other people see after a PING. Built field by field from an allowlist and never by
 * spreading the profile, so private fields such as birthYear cannot leak.
 */
export function buildSharedProfile(profile: Profile, settings: ShareSettings): SharedProfile {
  const shared: SharedProfile = {};
  const isOn = (field: ShareableField) => settings[field] === true && hasValueFor(profile, field);

  if (isOn('name')) shared.displayName = profile.displayName;
  if (isOn('role')) {
    if (profile.roleTitle !== '') shared.roleTitle = profile.roleTitle;
    if (profile.roleCode !== null) shared.roleCode = profile.roleCode;
  }
  if (isOn('interests')) shared.interests = [...profile.interests];
  if (isOn('github')) shared.github = profile.contact.github;
  if (isOn('linkedin')) shared.linkedin = profile.contact.linkedin;
  if (isOn('cv')) shared.cvUrl = profile.contact.cvUrl;
  if (isOn('email')) shared.email = profile.contact.email;

  return shared;
}
