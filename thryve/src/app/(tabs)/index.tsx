import { useMemo, useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { T } from '../../lib/theme';
import { EVENTS, WALKUP, partitionGoing } from '../../lib/data';
import { useRsvps } from '../../lib/rsvps';
import { CategoryRail, type FilterId } from '../../components/CategoryRail';
import { PulseHero } from '../../components/PulseHero';
import { WalkupDrop } from '../../components/WalkupDrop';
import { HeroCard } from '../../components/HeroCard';
import { TodayTimeline } from '../../components/TodayTimeline';
import { EventCard } from '../../components/EventCard';

export default function Discover() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [cat, setCat] = useState<FilterId>('all');
  const { isGoing, toggle } = useRsvps();

  const filtered = useMemo(
    () => (cat === 'all' ? EVENTS : EVENTS.filter((e) => e.cat === cat)),
    [cat],
  );
  const featured = filtered[0];
  const rest = filtered.filter((e) => e !== featured);
  const networkCount = useMemo(() => {
    const set = new Set<string>();
    EVENTS.forEach((e) => partitionGoing(e.going).youKnow.forEach((h) => set.add(h)));
    return set.size;
  }, []);
  const todayEvents = EVENTS.filter((e) => e.startsIn < 36 * 60);

  const openEvent = (id: string) => router.push(`/event/${id}`);
  const openShare = (id: string) => router.push({ pathname: `/event/${id}`, params: { share: '1' } });

  return (
    <View style={{ flex: 1, backgroundColor: T.page }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 130 }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            paddingTop: insets.top + 8,
            paddingHorizontal: 18,
            paddingBottom: 10,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Pressable style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <Feather name="map-pin" size={14} color={T.ink} />
            <Text style={{ color: T.ink, fontSize: 14, fontWeight: '600', letterSpacing: -0.2 }}>
              Charleston, SC
            </Text>
            <Feather name="chevron-down" size={13} color={T.mute} />
          </Pressable>
          <Text style={{ color: T.ink, fontSize: 19, fontWeight: '600', letterSpacing: -0.7 }}>
            thryve
          </Text>
          <View style={{ flexDirection: 'row', gap: 6 }}>
            <Pressable
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                borderWidth: 1,
                borderColor: T.hair,
                backgroundColor: T.paper,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Feather name="map" size={16} color={T.ink} />
            </Pressable>
            <Pressable
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                borderWidth: 1,
                borderColor: T.hair,
                backgroundColor: T.paper,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Feather name="bell" size={16} color={T.ink} />
              <View
                style={{
                  position: 'absolute',
                  top: 7,
                  right: 8,
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: T.hot,
                  borderWidth: 1.5,
                  borderColor: T.paper,
                }}
              />
            </Pressable>
          </View>
        </View>

        <PulseHero networkCount={networkCount} />

        {WALKUP && cat === 'all' && <WalkupDrop onPress={() => openEvent('e1')} />}

        <CategoryRail cat={cat} setCat={setCat} />

        {featured && (
          <HeroCard
            event={featured}
            going={isGoing(featured.id)}
            onOpen={() => openEvent(featured.id)}
            onRsvp={() => toggle(featured.id)}
            onShare={() => openShare(featured.id)}
          />
        )}

        <TodayTimeline events={todayEvents} onOpen={openEvent} />

        {rest.length > 0 && (
          <View style={{ paddingHorizontal: 18, paddingTop: 26 }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                marginBottom: 10,
              }}
            >
              <Text
                style={{
                  color: T.ink,
                  fontSize: 18,
                  fontWeight: '600',
                  letterSpacing: -0.4,
                }}
              >
                This week, near you
              </Text>
              <Text style={{ color: T.mute, fontSize: 12.5, fontWeight: '500' }}>By distance</Text>
            </View>
            <View style={{ gap: 12 }}>
              {rest.map((e, i) => (
                <EventCard
                  key={e.id}
                  event={e}
                  index={i}
                  going={isGoing(e.id)}
                  onOpen={() => openEvent(e.id)}
                  onRsvp={() => toggle(e.id)}
                />
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
