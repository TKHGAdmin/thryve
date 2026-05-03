import { View, Text, Pressable, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { T, CAT, type CategoryId } from '../../lib/theme';
import { EVENTS } from '../../lib/data';
import { PhotoTile } from '../../components/PhotoTile';
import { VybeStrip } from '../../components/VybeStrip';

const CREWS: Record<string, { name: string; cat: CategoryId; handle: string; followers: number; bio: string }> = {
  c1: { name: 'Cold Plunge CHS', cat: 'cold', handle: '@coldplungechs', followers: 4823, bio: 'Cold plunges, hot coffee, every weekend in the Lowcountry.' },
  c2: { name: 'Charleston Run Club', cat: 'run', handle: '@charlestonrunclub', followers: 12100, bio: 'Free fitness on Charleston streets. Just show up.' },
  c3: { name: 'Breathe CHS', cat: 'breath', handle: '@breathechs', followers: 1840, bio: 'Holotropic breathwork, full-moon synced.' },
  c4: { name: 'SWEAT Festival', cat: 'fest', handle: '@sweatfest', followers: 24300, bio: 'Two days of wellness on the Cooper River.' },
  c5: { name: 'Lowcountry Yoga Co', cat: 'yoga', handle: '@lowcountryyogaco', followers: 920, bio: 'Vinyasa as the sun comes up over the Atlantic.' },
};

export default function CrewProfile() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const crew = id ? CREWS[id] : null;
  if (!crew) {
    return (
      <View style={{ flex: 1, backgroundColor: T.page, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: T.ink }}>Crew not found</Text>
      </View>
    );
  }
  const c = CAT[crew.cat];
  const upcoming = EVENTS.filter((e) => e.cat === crew.cat).slice(0, 3);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: T.page }}
      contentContainerStyle={{ paddingBottom: 60 }}
      showsVerticalScrollIndicator={false}
    >
      <View>
        <PhotoTile cat={crew.cat} idx={2} width="100%" height={220} radius={0} />
        <Pressable
          onPress={() => router.back()}
          style={{
            position: 'absolute',
            top: insets.top + 10,
            left: 16,
            width: 38,
            height: 38,
            borderRadius: 19,
            borderWidth: 1,
            borderColor: T.hair,
            backgroundColor: T.paper,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Feather name="chevron-left" size={18} color={T.ink} />
        </Pressable>
      </View>
      <View style={{ paddingHorizontal: 18, paddingTop: 18 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text style={{ color: T.ink, fontSize: 28, fontWeight: '600', letterSpacing: -1 }}>
            {crew.name}
          </Text>
          <Feather name="check-circle" size={18} color={T.ink} />
        </View>
        <Text style={{ color: T.mute, fontSize: 13, fontWeight: '500', marginTop: 4 }}>
          {crew.handle} · {crew.followers.toLocaleString()} followers
        </Text>
        <Text style={{ color: T.ink2, fontSize: 14, lineHeight: 20, marginTop: 14 }}>
          {crew.bio}
        </Text>

        <Pressable
          style={{
            marginTop: 16,
            height: 48,
            borderRadius: 14,
            backgroundColor: T.ink,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            gap: 6,
          }}
        >
          <Feather name="plus" size={15} color={T.paper} />
          <Text style={{ color: T.paper, fontSize: 14, fontWeight: '600' }}>Follow crew</Text>
        </Pressable>

        <Text
          style={{
            marginTop: 24,
            color: T.mute,
            fontSize: 11,
            fontWeight: '600',
            letterSpacing: 0.3,
            textTransform: 'uppercase',
          }}
        >
          Recent vybe
        </Text>
        <View style={{ marginTop: 8 }}>
          <VybeStrip cat={crew.cat} height={92} gap={4} />
        </View>

        <Text
          style={{
            marginTop: 24,
            color: T.ink,
            fontSize: 18,
            fontWeight: '600',
            letterSpacing: -0.4,
            marginBottom: 10,
          }}
        >
          Upcoming
        </Text>
        <View style={{ gap: 8 }}>
          {upcoming.map((e) => (
            <Pressable
              key={e.id}
              onPress={() => router.push(`/event/${e.id}`)}
              style={{
                flexDirection: 'row',
                gap: 12,
                backgroundColor: T.paper,
                borderWidth: 1,
                borderColor: T.hair,
                borderRadius: 14,
                padding: 10,
                alignItems: 'center',
              }}
            >
              <PhotoTile cat={e.cat} idx={0} width={64} height={64} radius={10} />
              <View style={{ flex: 1 }}>
                <Text
                  numberOfLines={1}
                  style={{ color: T.ink, fontSize: 15, fontWeight: '600', letterSpacing: -0.3 }}
                >
                  {e.title}
                </Text>
                <Text style={{ color: T.mute, fontSize: 12, fontWeight: '500', marginTop: 2 }}>
                  {e.when} · {e.distance}
                </Text>
              </View>
              <View
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  borderRadius: 999,
                  backgroundColor: c.tint,
                }}
              >
                <Text style={{ color: c.ink, fontSize: 11, fontWeight: '600' }}>
                  {e.price === 0 ? 'Free' : `$${e.price}`}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
