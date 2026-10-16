// Monochrome like the badge's OLED, with the cyan of the PING trail as the only accent.
export const colors = {
  background: '#000000',
  surface: '#111111',
  border: '#2E2E2E',
  text: '#FFFFFF',
  muted: '#9A9A9A',
  accent: '#4FF0DC',
  onAccent: '#000000',
  danger: '#FF6B6B',
  success: '#7CFFB2',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radius = {
  sm: 6,
  md: 10,
  pill: 999,
} as const;
