export const T = {
  page: '#EDEEF0',
  paper: '#FFFFFF',
  paperW: '#FCFBF6',
  ink: '#0E1112',
  ink2: '#27292B',
  mute: '#6E7173',
  mute2: '#9DA0A3',
  hair: '#EDEAE0',
  hair2: '#E2DED1',
  glow: '#C9F23C',
  glowInk: '#0F1A02',
  hot: '#E0432D',
  free: '#0F8E4F',
  freeBg: '#E6F4EC',
  amber: '#C77808',
} as const;

export const ACCENT = '#B9FF66';

export type CategoryId =
  | 'cold' | 'run' | 'breath' | 'fest' | 'yoga' | 'social' | 'hike' | 'pkl' | 'sauna';

export type CategoryDef = {
  label: string;
  short: string;
  palettes: [string, string, string][];
  ink: string;
  tint: string;
  tintBg: string;
  dot: string;
};

export const CAT: Record<CategoryId, CategoryDef> = {
  cold: {
    label: 'Cold plunge', short: 'Plunge',
    palettes: [
      ['#0F4068', '#1E6FA8', '#88C5E8'],
      ['#0A2F4E', '#3D87BC', '#B8DCEE'],
      ['#1B5288', '#4F9CCB', '#D6EBF5'],
    ],
    ink: '#1E3A5F', tint: '#E5EFF7', tintBg: '#F1F6FA', dot: '#3D87BC',
  },
  run: {
    label: 'Run club', short: 'Run',
    palettes: [
      ['#1A4520', '#3D7C44', '#8FBE85'],
      ['#244C2A', '#558E5C', '#A8CFA0'],
      ['#1F3A26', '#4A8050', '#7FB078'],
    ],
    ink: '#234B2C', tint: '#E6EFE5', tintBg: '#F1F6F0', dot: '#558E5C',
  },
  breath: {
    label: 'Breathwork', short: 'Breath',
    palettes: [
      ['#7A3D1A', '#C77B40', '#F0BC85'],
      ['#5D2C0E', '#A55C26', '#E2A875'],
      ['#8E4A1E', '#D4894E', '#F5D0A6'],
    ],
    ink: '#5C3520', tint: '#F5E4D0', tintBg: '#FAF1E5', dot: '#C77B40',
  },
  fest: {
    label: 'Festival', short: 'Fest',
    palettes: [
      ['#7A2438', '#C46B85', '#F4C0CF'],
      ['#8E1F3A', '#D85577', '#F8B8C8'],
      ['#5E1F2E', '#B16080', '#E5A5BA'],
    ],
    ink: '#5F2438', tint: '#F4DBE3', tintBg: '#FAEDF0', dot: '#C46B85',
  },
  yoga: {
    label: 'Yoga', short: 'Yoga',
    palettes: [
      ['#3B2870', '#7E6BB8', '#C6BCE0'],
      ['#2E1F58', '#6F5DA8', '#B5A8D6'],
      ['#4A368A', '#8E7BC4', '#D4CCEA'],
    ],
    ink: '#3E2A6B', tint: '#E5DFF0', tintBg: '#F0EBF8', dot: '#7E6BB8',
  },
  social: {
    label: 'Coffee social', short: 'Social',
    palettes: [
      ['#5C4012', '#A0792B', '#E2C275'],
      ['#48340E', '#8C6A24', '#D4B463'],
      ['#5E4318', '#B0883D', '#EBCC85'],
    ],
    ink: '#5C4318', tint: '#F1E4C0', tintBg: '#FAF2DB', dot: '#A0792B',
  },
  hike: {
    label: 'Hike', short: 'Hike',
    palettes: [
      ['#1F4538', '#4D7E6A', '#A2C0B2'],
      ['#283E32', '#5F876F', '#A8C0AE'],
      ['#264438', '#587862', '#9CB7A4'],
    ],
    ink: '#244338', tint: '#DCE7DF', tintBg: '#EBF1ED', dot: '#4D7E6A',
  },
  pkl: {
    label: 'Pickleball', short: 'Pickle',
    palettes: [
      ['#3F5818', '#7A9F30', '#C5DC85'],
      ['#4A6420', '#8FB23C', '#D4E69E'],
      ['#36501A', '#6F9128', '#B7D278'],
    ],
    ink: '#3F5818', tint: '#EAF2D8', tintBg: '#F4F8E8', dot: '#7A9F30',
  },
  sauna: {
    label: 'Sauna', short: 'Sauna',
    palettes: [
      ['#5C1A18', '#A03A2E', '#D87863'],
      ['#4D1612', '#8C322A', '#C66854'],
      ['#6B1F1B', '#B04438', '#E08A75'],
    ],
    ink: '#5C2218', tint: '#F4DDD4', tintBg: '#FAEAE2', dot: '#A03A2E',
  },
};

export const fmtCountdown = (mins: number): string => {
  if (mins < 60) return `${mins}m`;
  if (mins < 24 * 60) {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return m === 0 ? `${h}h` : `${h}h ${m}m`;
  }
  const d = Math.floor(mins / (24 * 60));
  return d === 1 ? 'Tomorrow' : `${d}d`;
};
