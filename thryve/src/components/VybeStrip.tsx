import { View } from 'react-native';
import { PhotoTile } from './PhotoTile';
import type { CategoryId } from '../lib/theme';

type Props = {
  cat: CategoryId;
  height?: number;
  gap?: number;
};

export const VybeStrip = ({ cat, height = 56, gap = 4 }: Props) => (
  <View style={{ flexDirection: 'row', height, gap }}>
    {[0, 1, 2].map((i) => (
      <View key={i} style={{ flex: 1, height: '100%' }}>
        <PhotoTile cat={cat} idx={i} width="100%" height={height} radius={8} />
      </View>
    ))}
  </View>
);
