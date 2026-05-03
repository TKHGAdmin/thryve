import { View, Text, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { T, type CategoryId } from '../../lib/theme';
import { Screen } from '../../components/Screen';
import { PhotoTile } from '../../components/PhotoTile';

type Crew = { id: string; name: string; members: number; cat: CategoryId; verified: boolean };

const CREWS: Crew[] = [
  { id: 'c1', name: 'Cold Plunge CHS', members: 342, cat: 'cold', verified: true },
  { id: 'c2', name: 'Charleston Run Club', members: 1203, cat: 'run', verified: true },
  { id: 'c3', name: 'Breathe CHS', members: 187, cat: 'breath', verified: false },
  { id: 'c4', name: 'SWEAT Festival', members: 5021, cat: 'fest', verified: true },
  { id: 'c5', name: 'Lowcountry Yoga Co', members: 415, cat: 'yoga', verified: false },
];

export default function Crews() {
  const router = useRouter();
  return (
    <Screen pretitle="Your network" title="Crews" sub="Hosts you follow">
      <View
        style={{
          marginTop: 22,
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 8,
        }}
      >
        {CREWS.map((cr) => (
          <Pressable
            key={cr.id}
            onPress={() => router.push(`/crew/${cr.id}`)}
            style={{
              width: '48.5%',
              borderRadius: 18,
              overflow: 'hidden',
              backgroundColor: T.paper,
              borderWidth: 1,
              borderColor: T.hair,
            }}
          >
            <PhotoTile cat={cr.cat} idx={1} width="100%" height={84} radius={0} />
            <View style={{ paddingHorizontal: 12, paddingVertical: 10 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Text
                  numberOfLines={1}
                  style={{
                    flex: 1,
                    color: T.ink,
                    fontSize: 14,
                    fontWeight: '600',
                    letterSpacing: -0.3,
                  }}
                >
                  {cr.name}
                </Text>
                {cr.verified && <Feather name="check-circle" size={11} color={T.ink} />}
              </View>
              <Text style={{ color: T.mute, fontSize: 11.5, fontWeight: '500', marginTop: 3 }}>
                {cr.members.toLocaleString()} members
              </Text>
            </View>
          </Pressable>
        ))}
      </View>
    </Screen>
  );
}
