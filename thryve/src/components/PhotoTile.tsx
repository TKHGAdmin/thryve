import { View, type DimensionValue } from 'react-native';
import { CAT, type CategoryId } from '../lib/theme';

type Props = {
  cat: CategoryId;
  idx?: number;
  width?: DimensionValue;
  height?: DimensionValue;
  radius?: number;
};

const COMPS = [
  { sunX: 30, sunY: 30, horizonY: 62, sunSize: 28 },
  { sunX: 72, sunY: 25, horizonY: 58, sunSize: 24 },
  { sunX: 50, sunY: 22, horizonY: 65, sunSize: 32 },
  { sunX: 22, sunY: 35, horizonY: 60, sunSize: 22 },
];

export const PhotoTile = ({ cat, idx = 0, width = '100%', height = 100, radius = 14 }: Props) => {
  const c = CAT[cat];
  const palette = c.palettes[idx % c.palettes.length];
  const [dark, mid, light] = palette;
  const seed = (cat.charCodeAt(0) + idx * 7) % 4;
  const comp = COMPS[seed];
  return (
    <View
      style={{
        width,
        height,
        borderRadius: radius,
        overflow: 'hidden',
        backgroundColor: mid,
      }}
    >
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, height: `${comp.horizonY}%`, backgroundColor: mid }} />
      <View
        style={{
          position: 'absolute',
          top: `${comp.horizonY - 8}%`,
          left: 0,
          right: 0,
          height: '20%',
          backgroundColor: light,
          opacity: 0.55,
        }}
      />
      <View
        style={{
          position: 'absolute',
          top: `${comp.horizonY}%`,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: dark,
        }}
      />
      <View
        style={{
          position: 'absolute',
          top: `${comp.horizonY - 4}%`,
          left: 0,
          right: 0,
          height: '6%',
          backgroundColor: mid,
        }}
      />
      <View
        style={{
          position: 'absolute',
          top: `${comp.sunY - comp.sunSize / 2}%`,
          left: `${comp.sunX - comp.sunSize / 2}%`,
          width: `${comp.sunSize}%`,
          height: `${comp.sunSize}%`,
          borderRadius: 999,
          backgroundColor: light,
          opacity: 0.85,
        }}
      />
      <View
        style={{
          position: 'absolute',
          left: seed % 2 === 0 ? '-10%' : '60%',
          bottom: 0,
          width: '50%',
          height: '40%',
          backgroundColor: dark,
          opacity: 0.7,
          borderTopLeftRadius: 80,
          borderTopRightRadius: 80,
        }}
      />
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: '#000',
          opacity: 0.15,
        }}
      />
    </View>
  );
};
