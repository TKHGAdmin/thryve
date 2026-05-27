import { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { T, ACCENT } from '../../lib/theme';
import { useRsvps } from '../../lib/rsvps';
import { useFeed } from '../../hooks/useFeed';
import { useLocation } from '../../hooks/useLocation';
import { toEventItem } from '../../lib/eventMapper';
import { CategoryRail, type FilterId } from '../../components/CategoryRail';
import { PulseHero } from '../../components/PulseHero';
import { HeroCard } from '../../components/HeroCard';
import { TodayTimeline } from '../../components/TodayTimeline';
import { EventCard } from '../../components/EventCard';
import type { ScoredEvent } from '../../lib/algorithm';
import type { EventWithCrew } from '../../hooks/useEvents';
import type { EventItem } from '../../lib/data';

export default function Discover() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [cat, setCat] = useState<FilterId>('all');
  const [refreshing, setRefreshing] = useState(false);
  const { isGoing, toggle } = useRsvps();
  const {
    happeningNow,
    forYou,
    popular,
    justDropped,
    explore,
    events,
    loading,
    error,
    refetch,
  } = useFeed();
  const { latitude, longitude } = useLocation();

  const eventMap = useMemo(() => {
    const map = new Map<string, EventWithCrew>();
    events.forEach((e) => map.set(e.id, e));
    return map;
  }, [events]);

  const mapScored = useCallback(
    (scored: ScoredEvent[]): { item: EventItem; raw: EventWithCrew; scored: ScoredEvent }[] =>
      scored
        .map((s) => {
          const raw = eventMap.get(s.event_id);
          if (!raw) return null;
          if (cat !== 'all' && raw.category !== cat) return null;
          return {
            item: toEventItem(raw, {
              userLat: latitude,
              userLng: longitude,
              scarcity: s.boosts.scarcity,
              freshness: s.boosts.freshness,
            }),
            raw,
            scored: s,
          };
        })
        .filter((x): x is NonNullable<typeof x> => x !== null),
    [eventMap, cat, latitude, longitude],
  );

  const happeningItems = useMemo(() => mapScored(happeningNow), [mapScored, happeningNow]);
  const forYouItems = useMemo(() => mapScored(forYou), [mapScored, forYou]);
  const popularItems = useMemo(() => mapScored(popular), [mapScored, popular]);
  const justDroppedItems = useMemo(() => mapScored(justDropped), [mapScored, justDropped]);
  const exploreItems = useMemo(() => mapScored(explore), [mapScored, explore]);

  const featured = forYouItems[0] ?? popularItems[0] ?? exploreItems[0] ?? null;
  const restForYou = forYouItems.filter((e) => e.item.id !== featured?.item.id);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const openEvent = (id: string) => router.push(`/event/${id}`);
  const openShare = (id: string) =>
    router.push({ pathname: `/event/${id}`, params: { share: '1' } });

  const empty = !loading && events.length === 0 && !error;

  return (
    <View style={{ flex: 1, backgroundColor: T.page }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 130 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={T.ink} />
        }
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
          <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
            <Text style={{ color: T.ink, fontSize: 19, fontWeight: '600', letterSpacing: -0.7 }}>
              thryve
            </Text>
            <Text style={{ color: ACCENT, fontSize: 19, fontWeight: '600', letterSpacing: -0.7 }}>
              .
            </Text>
          </View>
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

        <PulseHero networkCount={0} />

        <CategoryRail cat={cat} setCat={setCat} />

        {loading && events.length === 0 && (
          <View style={{ paddingVertical: 80, alignItems: 'center' }}>
            <ActivityIndicator color={T.ink} />
          </View>
        )}

        {error && (
          <View style={{ paddingHorizontal: 18, paddingVertical: 24 }}>
            <Text style={{ color: T.hot, fontSize: 14, fontWeight: '600' }}>
              Something went wrong. Pull to refresh.
            </Text>
          </View>
        )}

        {empty && (
          <View style={{ paddingHorizontal: 18, paddingVertical: 60, alignItems: 'center' }}>
            <Text style={{ color: T.ink, fontSize: 18, fontWeight: '600', marginBottom: 8 }}>
              No events nearby
            </Text>
            <Text style={{ color: T.mute, fontSize: 14, marginBottom: 16, textAlign: 'center' }}>
              Be the first to drop one.
            </Text>
            <Pressable
              onPress={() => router.push('/(tabs)/create')}
              style={{
                paddingHorizontal: 18,
                paddingVertical: 12,
                borderRadius: 12,
                backgroundColor: ACCENT,
              }}
            >
              <Text style={{ color: T.ink, fontSize: 14, fontWeight: '700' }}>Create Event</Text>
            </Pressable>
          </View>
        )}

        {happeningItems.length > 0 && (
          <TodayTimeline
            events={happeningItems.map((x) => x.item)}
            onOpen={openEvent}
          />
        )}

        {featured && (
          <HeroCard
            event={featured.item}
            going={isGoing(featured.item.id)}
            onOpen={() => openEvent(featured.item.id)}
            onRsvp={() => toggle(featured.item.id)}
            onShare={() => openShare(featured.item.id)}
          />
        )}

        {justDroppedItems.length > 0 && (
          <View style={{ paddingHorizontal: 18, paddingTop: 26 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: ACCENT }} />
              <Text style={{ color: T.ink, fontSize: 18, fontWeight: '600', letterSpacing: -0.4 }}>
                Just dropped
              </Text>
            </View>
            <View style={{ gap: 12 }}>
              {justDroppedItems.map((x, i) => (
                <EventCard
                  key={x.item.id}
                  event={x.item}
                  index={i}
                  going={isGoing(x.item.id)}
                  onOpen={() => openEvent(x.item.id)}
                  onRsvp={() => toggle(x.item.id)}
                />
              ))}
            </View>
          </View>
        )}

        {restForYou.length > 0 && (
          <View style={{ paddingHorizontal: 18, paddingTop: 26 }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                marginBottom: 10,
              }}
            >
              <Text style={{ color: T.ink, fontSize: 18, fontWeight: '600', letterSpacing: -0.4 }}>
                For you
              </Text>
              <Text style={{ color: T.mute, fontSize: 12.5, fontWeight: '500' }}>
                Based on your interests
              </Text>
            </View>
            <View style={{ gap: 12 }}>
              {restForYou.map((x, i) => (
                <EventCard
                  key={x.item.id}
                  event={x.item}
                  index={i}
                  going={isGoing(x.item.id)}
                  onOpen={() => openEvent(x.item.id)}
                  onRsvp={() => toggle(x.item.id)}
                />
              ))}
            </View>
          </View>
        )}

        {popularItems.length > 0 && (
          <View style={{ paddingTop: 26 }}>
            <View style={{ paddingHorizontal: 18, marginBottom: 10 }}>
              <Text style={{ color: T.ink, fontSize: 18, fontWeight: '600', letterSpacing: -0.4 }}>
                Popular nearby
              </Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 12, paddingHorizontal: 18 }}
            >
              {popularItems.map((x, i) => (
                <View key={x.item.id} style={{ width: 320 }}>
                  <EventCard
                    event={x.item}
                    index={i}
                    going={isGoing(x.item.id)}
                    onOpen={() => openEvent(x.item.id)}
                    onRsvp={() => toggle(x.item.id)}
                  />
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {exploreItems.length > 0 && (
          <View style={{ paddingHorizontal: 18, paddingTop: 26 }}>
            <Text
              style={{
                color: T.ink,
                fontSize: 18,
                fontWeight: '600',
                letterSpacing: -0.4,
                marginBottom: 10,
              }}
            >
              Explore
            </Text>
            <View style={{ gap: 12 }}>
              {exploreItems.map((x, i) => (
                <EventCard
                  key={x.item.id}
                  event={x.item}
                  index={i}
                  going={isGoing(x.item.id)}
                  onOpen={() => openEvent(x.item.id)}
                  onRsvp={() => toggle(x.item.id)}
                />
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
