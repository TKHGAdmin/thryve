import { View, Text, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { T, CAT } from '../lib/theme';
import { WALKUP } from '../lib/data';
import { Pulse } from './Pulse';

type Props = {
  onPress: () => void;
};

export const WalkupDrop = ({ onPress }: Props) => {
  const c = CAT[WALKUP.cat];
  return (
    <View style={{ paddingHorizontal: 18, paddingTop: 14 }}>
      <Pressable
        onPress={onPress}
        style={{
          backgroundColor: T.ink,
          borderRadius: 18,
          paddingHorizontal: 16,
          paddingVertical: 14,
          overflow: 'hidden',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <View
          style={{
            position: 'absolute',
            right: -40,
            top: -40,
            width: 110,
            height: 110,
            borderRadius: 55,
            backgroundColor: c.dot,
            opacity: 0.3,
          }}
        />
        <View
          style={{
            width: 50,
            height: 50,
            borderRadius: 14,
            backgroundColor: T.glow,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Feather name="zap" size={22} color={T.glowInk} />
          <View
            style={{
              position: 'absolute',
              top: -4,
              right: -4,
              backgroundColor: T.hot,
              paddingHorizontal: 5,
              paddingVertical: 2,
              borderRadius: 999,
              borderWidth: 1.5,
              borderColor: T.ink,
            }}
          >
            <Text style={{ color: T.paper, fontSize: 9, fontWeight: '700' }}>LIVE</Text>
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <Pulse color={T.glow} size={5} />
            <Text
              style={{
                color: T.glow,
                fontSize: 10.5,
                fontWeight: '600',
                letterSpacing: 0.4,
                textTransform: 'uppercase',
              }}
            >
              Walk-up · {WALKUP.droppedAgo}m ago
            </Text>
          </View>
          <Text
            numberOfLines={1}
            style={{
              color: T.paper,
              fontSize: 17,
              fontWeight: '600',
              letterSpacing: -0.4,
              marginTop: 3,
            }}
          >
            {WALKUP.title}
          </Text>
          <Text style={{ color: 'rgba(250,249,244,0.65)', fontSize: 12, fontWeight: '500', marginTop: 2 }}>
            {WALKUP.walkupVenue} ·{' '}
            <Text style={{ color: T.paper, fontWeight: '600' }}>{WALKUP.distance}</Text> ·{' '}
            {WALKUP.here}/{WALKUP.capacity} here
          </Text>
        </View>
        <Feather name="chevron-right" size={18} color={T.paper} />
      </Pressable>
    </View>
  );
};
