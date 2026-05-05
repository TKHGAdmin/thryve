import { useRef, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ACCENT, CAT, type CategoryId } from '../../lib/theme';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { OnboardingProgress } from '../../components/OnboardingProgress';

const DARK = '#111827';
const MUTE = '#6B7280';
const DISABLED_BG = '#E5E7EB';

type CatOption = { id: CategoryId; emoji: string; label: string };

const CATEGORIES: CatOption[] = [
  { id: 'cold',   emoji: '🧊', label: 'Cold Plunge' },
  { id: 'run',    emoji: '🏃', label: 'Run Club' },
  { id: 'yoga',   emoji: '🧘', label: 'Yoga' },
  { id: 'breath', emoji: '🌬', label: 'Breathwork' },
  { id: 'fest',   emoji: '🎪', label: 'Festivals' },
  { id: 'hike',   emoji: '🥾', label: 'Hiking' },
  { id: 'social', emoji: '☕', label: 'Coffee+Wellness' },
  { id: 'pkl',    emoji: '🏓', label: 'Pickleball' },
  { id: 'sauna',  emoji: '🧖', label: 'Sauna' },
];

const MIN_INTERESTS = 3;

const CategoryCard = ({
  cat,
  selected,
  onPress,
}: {
  cat: CatOption;
  selected: boolean;
  onPress: () => void;
}) => {
  const scale = useRef(new Animated.Value(selected ? 1.02 : 1)).current;
  const opacity = useRef(new Animated.Value(selected ? 1 : 0.5)).current;

  const animateTo = (s: boolean) => {
    Animated.parallel([
      Animated.spring(scale, { toValue: s ? 1.02 : 1, useNativeDriver: true, friction: 8 }),
      Animated.timing(opacity, { toValue: s ? 1 : 0.5, duration: 180, useNativeDriver: true }),
    ]).start();
  };

  return (
    <Animated.View style={{ flex: 1, transform: [{ scale }], opacity }}>
      <Pressable
        onPress={() => {
          animateTo(!selected);
          onPress();
        }}
        style={{
          height: 100,
          borderRadius: 20,
          backgroundColor: CAT[cat.id].tint,
          borderWidth: 2.5,
          borderColor: selected ? ACCENT : 'transparent',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
        }}
      >
        <Text style={{ fontSize: 32 }}>{cat.emoji}</Text>
        <Text style={{ color: DARK, fontSize: 12, fontWeight: '600' }}>{cat.label}</Text>
      </Pressable>
    </Animated.View>
  );
};

export default function OnboardingInterests() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, refetchProfile } = useAuth();

  const [selected, setSelected] = useState<Set<CategoryId>>(new Set());
  const [submitting, setSubmitting] = useState(false);

  const count = selected.size;
  const valid = count >= MIN_INTERESTS;

  const toggle = (id: CategoryId) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const onContinue = async () => {
    if (!valid || !user || submitting) return;
    setSubmitting(true);
    const { error } = await supabase
      .from('users')
      .update({ interests: Array.from(selected) } as any)
      .eq('id', user.id);
    if (error) {
      setSubmitting(false);
      return;
    }
    await refetchProfile();
    setSubmitting(false);
    router.push('/onboarding/city');
  };

  const rows: CatOption[][] = [
    CATEGORIES.slice(0, 3),
    CATEGORIES.slice(3, 6),
    CATEGORIES.slice(6, 9),
  ];

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: insets.top + 16,
          paddingBottom: insets.bottom + 24,
          flexGrow: 1,
        }}
        showsVerticalScrollIndicator={false}
      >
        <OnboardingProgress step={2} />

        <Text
          style={{
            marginTop: 32,
            color: DARK,
            fontSize: 28,
            fontWeight: '700',
            letterSpacing: -0.5,
          }}
        >
          What are you into?
        </Text>
        <Text style={{ marginTop: 8, color: MUTE, fontSize: 15, lineHeight: 21 }}>
          Pick at least 3. We'll show you events you'll love.
        </Text>

        <View style={{ marginTop: 28, gap: 10 }}>
          {rows.map((row, ri) => (
            <View key={ri} style={{ flexDirection: 'row', gap: 10 }}>
              {row.map((cat) => (
                <CategoryCard
                  key={cat.id}
                  cat={cat}
                  selected={selected.has(cat.id)}
                  onPress={() => toggle(cat.id)}
                />
              ))}
            </View>
          ))}
        </View>

        <View style={{ flex: 1 }} />

        <Pressable
          onPress={onContinue}
          disabled={!valid || submitting}
          style={{
            marginTop: 32,
            height: 56,
            borderRadius: 16,
            backgroundColor: valid ? ACCENT : DISABLED_BG,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {submitting ? (
            <ActivityIndicator color={DARK} />
          ) : (
            <Text style={{ color: DARK, fontSize: 16, fontWeight: '700' }}>
              {valid ? `Continue (${count} selected)` : 'Continue'}
            </Text>
          )}
        </Pressable>
      </ScrollView>
    </View>
  );
}
