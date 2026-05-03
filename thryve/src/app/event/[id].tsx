import { useMemo, useState, type ReactNode } from 'react';
import { View, Text, ScrollView, Pressable, Linking, Platform } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { T, CAT, fmtCountdown } from '../../lib/theme';
import { EVENTS, PEOPLE, partitionGoing, trybeBanner } from '../../lib/data';
import { useRsvps } from '../../lib/rsvps';
import { PhotoTile } from '../../components/PhotoTile';
import { VybeStrip } from '../../components/VybeStrip';
import { IgAvatar, IgAvatarStack } from '../../components/IgAvatar';

const openUber = async (lat: number, lng: number, name: string) => {
  const nick = encodeURIComponent(name);
  const deep = `uber://?action=setPickup&pickup=my_location&dropoff[latitude]=${lat}&dropoff[longitude]=${lng}&dropoff[nickname]=${nick}`;
  const web = `https://m.uber.com/ul/?action=setPickup&pickup=my_location&dropoff[latitude]=${lat}&dropoff[longitude]=${lng}&dropoff[nickname]=${nick}`;
  const ok = await Linking.canOpenURL(deep);
  Linking.openURL(ok ? deep : web);
};

const openLyft = async (lat: number, lng: number) => {
  const deep = `lyft://ridetype?id=lyft&destination[latitude]=${lat}&destination[longitude]=${lng}`;
  const web = `https://www.lyft.com/ride?id=lyft&destination[latitude]=${lat}&destination[longitude]=${lng}`;
  const ok = await Linking.canOpenURL(deep);
  Linking.openURL(ok ? deep : web);
};

const openAppleMaps = (lat: number, lng: number) => {
  const url =
    Platform.OS === 'ios'
      ? `maps://?daddr=${lat},${lng}&dirflg=d`
      : `https://maps.google.com/?daddr=${lat},${lng}&dirflg=d`;
  Linking.openURL(url);
};

type RideButtonProps = {
  label: string;
  icon: ReactNode;
  bg: string;
  fg: string;
  onPress: () => void;
};

const RideButton = ({ label, icon, bg, fg, onPress }: RideButtonProps) => (
  <Pressable
    onPress={onPress}
    style={{
      flex: 1,
      paddingVertical: 14,
      borderRadius: 12,
      backgroundColor: bg,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
    }}
  >
    {icon}
    <Text style={{ color: fg, fontSize: 13, fontWeight: '600', letterSpacing: -0.1 }}>{label}</Text>
  </Pressable>
);

export default function EventDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { isGoing, toggle } = useRsvps();
  const [groupOpen, setGroupOpen] = useState(false);

  const event = useMemo(() => EVENTS.find((e) => e.id === id), [id]);
  if (!event) {
    return (
      <View style={{ flex: 1, backgroundColor: T.page, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: T.ink }}>Event not found</Text>
      </View>
    );
  }

  const c = CAT[event.cat];
  const part = partitionGoing(event.going);
  const banner = trybeBanner(event.going);
  const going = isGoing(event.id);
  const mutuals = Object.entries(PEOPLE).filter(([, p]) => p.rel === 'mutual').slice(0, 6);

  return (
    <View style={{ flex: 1, backgroundColor: T.page }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 130 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ height: 280 }}>
          <PhotoTile cat={event.cat} idx={0} width="100%" height={280} radius={0} />
          <Pressable
            onPress={() => router.back()}
            style={{
              position: 'absolute',
              top: insets.top + 10,
              right: 16,
              width: 34,
              height: 34,
              borderRadius: 17,
              borderWidth: 1,
              borderColor: T.hair,
              backgroundColor: T.paper,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Feather name="x" size={16} color={T.ink} />
          </Pressable>
          <View
            style={{
              position: 'absolute',
              left: 18,
              bottom: 16,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <View
              style={{
                backgroundColor: T.paper,
                paddingHorizontal: 10,
                paddingVertical: 5,
                borderRadius: 999,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: c.dot }} />
              <Text style={{ color: c.ink, fontSize: 11.5, fontWeight: '600' }}>{c.label}</Text>
            </View>
            <View
              style={{
                backgroundColor: 'rgba(15,17,18,0.55)',
                paddingHorizontal: 10,
                paddingVertical: 5,
                borderRadius: 999,
              }}
            >
              <Text style={{ color: T.paper, fontSize: 11.5, fontWeight: '600' }}>
                Starts in {fmtCountdown(event.startsIn)}
              </Text>
            </View>
          </View>
        </View>

        <View style={{ paddingHorizontal: 18, paddingTop: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 6 }}>
            <Text style={{ color: T.mute, fontSize: 13, fontWeight: '500' }}>{event.crew}</Text>
            {event.verified && <Feather name="check-circle" size={13} color={T.ink} />}
            <Text style={{ color: T.mute2, fontSize: 13, fontWeight: '500' }}>· {event.hostHandle}</Text>
          </View>
          <Text
            style={{
              color: T.ink,
              fontSize: 30,
              fontWeight: '600',
              letterSpacing: -1.1,
              lineHeight: 32,
            }}
          >
            {event.title}
          </Text>

          <View style={{ flexDirection: 'row', gap: 8, marginTop: 18 }}>
            <View
              style={{
                flex: 1,
                backgroundColor: T.paper,
                borderWidth: 1,
                borderColor: T.hair,
                paddingHorizontal: 14,
                paddingVertical: 12,
                borderRadius: 14,
              }}
            >
              <Text style={{ color: T.mute, fontSize: 11, fontWeight: '500' }}>When</Text>
              <Text style={{ color: T.ink, fontSize: 14, fontWeight: '600', marginTop: 3 }}>
                {event.when}
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                backgroundColor: T.paper,
                borderWidth: 1,
                borderColor: T.hair,
                paddingHorizontal: 14,
                paddingVertical: 12,
                borderRadius: 14,
              }}
            >
              <Text style={{ color: T.mute, fontSize: 11, fontWeight: '500' }}>Where</Text>
              <Text
                numberOfLines={1}
                style={{ color: T.ink, fontSize: 14, fontWeight: '600', marginTop: 3 }}
              >
                {event.venue}
              </Text>
              <Text style={{ color: T.mute, fontSize: 11, fontWeight: '500', marginTop: 1 }}>
                {event.neighborhood} · {event.distance}
              </Text>
            </View>
          </View>

          <View
            style={{
              backgroundColor: T.paper,
              borderWidth: 1,
              borderColor: T.hair,
              paddingHorizontal: 16,
              paddingVertical: 14,
              borderRadius: 14,
              marginTop: 8,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 10,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                <Feather name="instagram" size={12} color={T.mute} />
                <Text
                  style={{
                    color: T.mute,
                    fontSize: 11,
                    fontWeight: '600',
                    letterSpacing: 0.3,
                    textTransform: 'uppercase',
                  }}
                >
                  From {event.hostHandle} · {(event.hostFollowers / 1000).toFixed(1)}k
                </Text>
              </View>
              <Text style={{ color: T.mute2, fontSize: 11, fontWeight: '500' }}>{event.repeats}</Text>
            </View>
            <VybeStrip cat={event.cat} height={84} gap={4} />
            <Text
              style={{
                marginTop: 10,
                color: T.ink2,
                fontSize: 13.5,
                fontStyle: 'italic',
                lineHeight: 20,
              }}
            >
              "{event.vybe}"
            </Text>
          </View>

          <View
            style={{
              backgroundColor: T.paper,
              borderWidth: 1,
              borderColor: T.hair,
              paddingHorizontal: 16,
              paddingVertical: 14,
              borderRadius: 14,
              marginTop: 8,
            }}
          >
            <Text style={{ color: T.ink2, fontSize: 14, lineHeight: 21 }}>{event.desc}</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 5, marginTop: 12 }}>
              {event.tags.map((t) => (
                <View
                  key={t}
                  style={{
                    backgroundColor: T.page,
                    borderWidth: 1,
                    borderColor: T.hair,
                    paddingHorizontal: 9,
                    paddingVertical: 3,
                    borderRadius: 999,
                  }}
                >
                  <Text style={{ color: T.mute, fontSize: 11.5, fontWeight: '500' }}>#{t}</Text>
                </View>
              ))}
            </View>
          </View>

          <View
            style={{
              backgroundColor: T.paper,
              borderWidth: 1,
              borderColor: T.hair,
              paddingHorizontal: 16,
              paddingVertical: 14,
              borderRadius: 14,
              marginTop: 8,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <IgAvatarStack handles={event.going} max={5} size={32} border={T.paper} />
              <View style={{ flex: 1 }}>
                <Text
                  style={{ color: T.ink, fontSize: 14, fontWeight: '600', letterSpacing: -0.2 }}
                >
                  {banner ? banner.text : `${event.total} going`}
                </Text>
                <Text style={{ color: T.mute, fontSize: 12, fontWeight: '500', marginTop: 2 }}>
                  {part.mutual.length} mutuals · {part.follow.length} you follow ·{' '}
                  {part.follower.length} follow you
                </Text>
              </View>
              <Feather name="chevron-right" size={14} color={T.mute} />
            </View>
            <Pressable
              onPress={() => setGroupOpen((o) => !o)}
              style={{
                marginTop: 10,
                paddingHorizontal: 12,
                paddingVertical: 10,
                borderRadius: 11,
                backgroundColor: T.page,
                borderWidth: 1,
                borderColor: T.hair,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
              }}
            >
              <Feather name="users" size={14} color={T.ink} />
              <Text style={{ color: T.ink, fontSize: 13, fontWeight: '600', letterSpacing: -0.1 }}>
                Bring 3 friends · group RSVP
              </Text>
            </Pressable>
            {groupOpen && (
              <View
                style={{
                  marginTop: 8,
                  padding: 10,
                  borderRadius: 11,
                  backgroundColor: T.page,
                  borderWidth: 1,
                  borderColor: T.hair,
                }}
              >
                <Text
                  style={{
                    color: T.mute,
                    fontSize: 11,
                    fontWeight: '600',
                    letterSpacing: 0.3,
                    textTransform: 'uppercase',
                    marginBottom: 8,
                  }}
                >
                  Pick from your IG mutuals
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                  {mutuals.map(([h, p]) => (
                    <Pressable key={h} style={{ alignItems: 'center', gap: 4 }}>
                      <IgAvatar handle={h} size={42} border={T.page} />
                      <Text style={{ color: T.ink2, fontSize: 10.5, fontWeight: '500' }}>
                        {p.name.split(' ')[0]}
                      </Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>

          <View
            style={{
              backgroundColor: T.paper,
              borderWidth: 1,
              borderColor: T.hair,
              paddingHorizontal: 16,
              paddingVertical: 14,
              borderRadius: 14,
              marginTop: 8,
            }}
          >
            <Text
              style={{
                color: T.mute,
                fontSize: 11,
                fontWeight: '600',
                letterSpacing: 0.3,
                textTransform: 'uppercase',
                marginBottom: 10,
              }}
            >
              Get there
            </Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <RideButton
                label="Uber"
                icon={<Feather name="navigation" size={18} color={T.paper} />}
                bg={T.ink}
                fg={T.paper}
                onPress={() => openUber(event.lat, event.lng, event.venue)}
              />
              <RideButton
                label="Lyft"
                icon={<Feather name="navigation" size={18} color={T.paper} />}
                bg="#FF00BF"
                fg={T.paper}
                onPress={() => openLyft(event.lat, event.lng)}
              />
              <RideButton
                label="Maps"
                icon={
                  <Ionicons
                    name={Platform.OS === 'ios' ? 'navigate' : 'map'}
                    size={18}
                    color={T.ink}
                  />
                }
                bg={T.page}
                fg={T.ink}
                onPress={() => openAppleMaps(event.lat, event.lng)}
              />
            </View>
            <Text style={{ color: T.mute, fontSize: 11.5, fontWeight: '500', marginTop: 10 }}>
              {event.venue} · {event.distance} away
            </Text>
          </View>
        </View>
      </ScrollView>

      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          paddingHorizontal: 14,
          paddingTop: 16,
          paddingBottom: insets.bottom + 14,
          backgroundColor: T.page,
          borderTopWidth: 1,
          borderTopColor: T.hair,
          flexDirection: 'row',
          gap: 8,
        }}
      >
        <Pressable
          style={{
            width: 52,
            height: 52,
            borderRadius: 14,
            borderWidth: 1,
            borderColor: T.hair,
            backgroundColor: T.paper,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Feather name="send" size={17} color={T.ink} />
        </Pressable>
        <Pressable
          onPress={() => toggle(event.id)}
          style={{
            flex: 1,
            height: 52,
            borderRadius: 14,
            backgroundColor: going ? T.glow : T.ink,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            gap: 6,
          }}
        >
          {going ? (
            <>
              <Feather name="check" size={17} color={T.glowInk} />
              <Text style={{ color: T.glowInk, fontSize: 15, fontWeight: '600', letterSpacing: -0.2 }}>
                You're going · ride locked
              </Text>
            </>
          ) : (
            <Text style={{ color: T.paper, fontSize: 15, fontWeight: '600', letterSpacing: -0.2 }}>
              {event.price ? `Get ticket · $${event.price}` : 'Hold to RSVP'}
            </Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}
