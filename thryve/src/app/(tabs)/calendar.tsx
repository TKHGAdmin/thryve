import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { T } from '../../lib/theme';
import { EVENTS } from '../../lib/data';
import { useRsvps } from '../../lib/rsvps';
import { Screen } from '../../components/Screen';
import { PhotoTile } from '../../components/PhotoTile';

export default function Calendar() {
  const router = useRouter();
  const { isGoing } = useRsvps();
  const mine = EVENTS.filter((e) => isGoing(e.id));

  return (
    <Screen pretitle="Your queue" title="Calendar" sub={`${mine.length} on your list`}>
      <View style={{ marginTop: 22, gap: 10 }}>
        {mine.length === 0 && (
          <View
            style={{
              backgroundColor: T.paper,
              borderWidth: 1,
              borderColor: T.hair,
              padding: 30,
              borderRadius: 16,
              alignItems: 'center',
              marginTop: 30,
            }}
          >
            <Text style={{ color: T.ink, fontSize: 18, fontWeight: '600' }}>Nothing booked.</Text>
            <Text style={{ color: T.mute, fontSize: 13, marginTop: 6 }}>Find one on Discover.</Text>
          </View>
        )}
        {mine.map((e) => (
          <Pressable
            key={e.id}
            onPress={() => router.push(`/event/${e.id}`)}
            style={{
              borderRadius: 18,
              overflow: 'hidden',
              backgroundColor: T.paper,
              borderWidth: 1,
              borderColor: T.hair,
            }}
          >
            <PhotoTile cat={e.cat} idx={0} width="100%" height={110} radius={0} />
            <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
              <Text
                style={{
                  color: T.ink,
                  fontSize: 17,
                  fontWeight: '600',
                  letterSpacing: -0.4,
                }}
              >
                {e.title}
              </Text>
              <Text style={{ color: T.mute, fontSize: 12.5, fontWeight: '500', marginTop: 4 }}>
                {e.when} · {e.venue}
              </Text>
            </View>
          </Pressable>
        ))}
      </View>
    </Screen>
  );
}
