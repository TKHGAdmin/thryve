import { useEffect, useRef } from 'react';
import { View, Text, Pressable, ScrollView, Animated } from 'react-native';
import { fmtCountdown, ACCENT, T, CAT } from '../lib/theme';
import type { EventItem } from '../lib/data';

const DARK = '#111827';
const MUTE = '#6B7280';

type Props = {
  events: EventItem[];
  onOpen: (id: string) => void;
};

const PulsingDot = ({ size = 8 }: { size?: number }) => {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(scale, { toValue: 1.5, duration: 1000, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 0.4, duration: 1000, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(scale, { toValue: 1, duration: 1000, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 1, duration: 1000, useNativeDriver: true }),
        ]),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [scale, opacity]);
  return (
    <Animated.View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: ACCENT,
        transform: [{ scale }],
        opacity,
      }}
    />
  );
};

export const TodayTimeline = ({ events, onOpen }: Props) => {
  if (events.length === 0) return null;
  const sorted = [...events].sort((a, b) => a.startsIn - b.startsIn);
  return (
    <View style={{ marginTop: 26 }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
          paddingHorizontal: 20,
          marginBottom: 14,
        }}
      >
        <PulsingDot size={8} />
        <Text
          style={{
            color: DARK,
            fontSize: 13,
            fontWeight: '700',
            letterSpacing: 1,
            textTransform: 'uppercase',
          }}
        >
          Live now
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 12, paddingHorizontal: 20 }}
      >
        {sorted.map((e) => {
          const c = CAT[e.cat];
          return (
            <Pressable
              key={e.id}
              onPress={() => onOpen(e.id)}
              style={{
                minWidth: 200,
                backgroundColor: T.ink,
                borderRadius: 18,
                paddingHorizontal: 16,
                paddingVertical: 14,
                overflow: 'hidden',
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
              <Text
                numberOfLines={1}
                style={{ color: T.paper, fontSize: 15, fontWeight: '700' }}
              >
                {e.title}
              </Text>
              <Text
                numberOfLines={1}
                style={{
                  color: 'rgba(250,249,244,0.65)',
                  fontSize: 12,
                  fontWeight: '500',
                  marginTop: 2,
                }}
              >
                {e.crew}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: 12,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <PulsingDot size={6} />
                  <Text style={{ color: ACCENT, fontSize: 12, fontWeight: '700' }}>
                    Starts in {fmtCountdown(e.startsIn)}
                  </Text>
                </View>
                <Pressable
                  onPress={() => onOpen(e.id)}
                  style={{
                    backgroundColor: ACCENT,
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderRadius: 12,
                  }}
                >
                  <Text style={{ color: DARK, fontSize: 13, fontWeight: '700' }}>Join</Text>
                </Pressable>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
};
