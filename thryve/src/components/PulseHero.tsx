import { View, Text } from 'react-native';
import { T } from '../lib/theme';
import { Pulse } from './Pulse';

type Props = {
  networkCount: number;
};

export const PulseHero = ({ networkCount }: Props) => (
  <View style={{ paddingHorizontal: 18, paddingTop: 4 }}>
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 4 }}>
      <Pulse color={T.hot} size={6} />
      <Text
        style={{
          color: T.hot,
          fontSize: 12,
          fontWeight: '600',
          letterSpacing: 0.2,
          textTransform: 'uppercase',
        }}
      >
        Live in Charleston
      </Text>
    </View>
    <Text
      style={{
        marginTop: 4,
        color: T.ink,
        fontSize: 30,
        fontWeight: '600',
        letterSpacing: -1,
        lineHeight: 32,
      }}
    >
      <Text style={{ color: T.mute, fontWeight: '500' }}>happening soon, </Text>
      <Text style={{ fontStyle: 'italic', fontWeight: '400' }}>
        {networkCount} of your people
      </Text>
      <Text style={{ color: T.mute, fontWeight: '500' }}> are in.</Text>
    </Text>
  </View>
);
