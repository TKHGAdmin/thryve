import { ScrollView, Pressable, Text, View } from 'react-native';
import { T, CAT, type CategoryId } from '../lib/theme';

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

type Props = {
  cat: FilterId;
  setCat: (id: FilterId) => void;
};

export const CategoryRail = ({ cat, setCat }: Props) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={{ gap: 6, paddingHorizontal: 18, paddingTop: 20, paddingBottom: 4 }}
  >
    {CATS.map((c) => {
      const active = cat === c.id;
      const dot = c.id === 'all' ? null : CAT[c.id as CategoryId].dot;
      return (
        <Pressable
          key={c.id}
          onPress={() => setCat(c.id)}
          style={{
            backgroundColor: active ? T.ink : T.paper,
            borderWidth: active ? 0 : 1,
            borderColor: T.hair,
            paddingHorizontal: 13,
            paddingVertical: 8,
            borderRadius: 999,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
          }}
        >
          {dot && !active && (
            <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: dot }} />
          )}
          <Text style={{ color: active ? T.paper : T.ink, fontSize: 13, fontWeight: '600' }}>
            {c.label}
          </Text>
        </Pressable>
      );
    })}
  </ScrollView>
);
