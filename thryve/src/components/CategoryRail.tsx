import { ScrollView, Pressable, Text, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { type CategoryId, ACCENT } from '../lib/theme';

export type FilterId = 'all' | CategoryId;

const CATS: { id: FilterId; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'cold', label: 'Cold' },
  { id: 'run', label: 'Run' },
  { id: 'yoga', label: 'Yoga' },
  { id: 'breath', label: 'Breath' },
  { id: 'social', label: 'Social' },
  { id: 'fest', label: 'Fest' },
  { id: 'hike', label: 'Hike' },
  { id: 'pkl', label: 'Pickle' },
  { id: 'sauna', label: 'Sauna' },
];

const DARK = '#111827';
const MUTE = '#6B7280';

type Props = {
  cat: FilterId;
  setCat: (id: FilterId) => void;
};

export const CategoryRail = ({ cat, setCat }: Props) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={{ gap: 8, paddingHorizontal: 20, paddingTop: 20, paddingBottom: 4 }}
  >
    {CATS.map((c) => {
      const active = cat === c.id;
      if (active) {
        return (
          <Pressable
            key={c.id}
            onPress={() => setCat(c.id)}
            style={{
              backgroundColor: ACCENT,
              paddingHorizontal: 10,
              paddingVertical: 8,
              borderRadius: 24,
              shadowColor: ACCENT,
              shadowOpacity: 0.3,
              shadowRadius: 12,
              shadowOffset: { width: 0, height: 4 },
              elevation: 4,
            }}
          >
            <Text style={{ color: DARK, fontSize: 13, fontWeight: '600' }}>{c.label}</Text>
          </Pressable>
        );
      }
      return (
        <Pressable
          key={c.id}
          onPress={() => setCat(c.id)}
          style={{
            borderRadius: 24,
            overflow: 'hidden',
            shadowColor: '#000',
            shadowOpacity: 0.04,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 2 },
            elevation: 2,
          }}
        >
          <BlurView
            intensity={20}
            tint="light"
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          />
          <View
            style={{
              backgroundColor: 'rgba(240, 240, 240, 0.45)',
              borderWidth: 0.5,
              borderColor: 'rgba(255, 255, 255, 0.25)',
              borderRadius: 24,
              paddingHorizontal: 10,
              paddingVertical: 8,
            }}
          >
            <Text style={{ color: MUTE, fontSize: 13, fontWeight: '600' }}>{c.label}</Text>
          </View>
        </Pressable>
      );
    })}
  </ScrollView>
);
