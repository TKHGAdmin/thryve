import { View, Text, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { T, CAT, fmtCountdown } from '../lib/theme';
import { trybeBanner, type EventItem } from '../lib/data';
import { PhotoTile } from './PhotoTile';
import { VybeStrip } from './VybeStrip';
import { IgAvatarStack } from './IgAvatar';
import { Pulse } from './Pulse';

type Props = {
  event: EventItem;
  going: boolean;
  onOpen: () => void;
  onRsvp: () => void;
  onShare: () => void;
};

export const HeroCard = ({ event, going, onOpen, onRsvp, onShare }: Props) => {
  const c = CAT[event.cat];
  const banner = trybeBanner(event.going);
  return (
    <View style={{ paddingHorizontal: 14, paddingTop: 14 }}>
      <Pressable
        onPress={onOpen}
        style={{
          borderRadius: 24,
          overflow: 'hidden',
          backgroundColor: T.paper,
          borderWidth: 1,
          borderColor: T.hair,
          shadowColor: T.ink,
          shadowOpacity: 0.08,
          shadowRadius: 20,
          shadowOffset: { width: 0, height: 12 },
          elevation: 4,
        }}
      >
        <View>
          <PhotoTile cat={event.cat} idx={0} width="100%" height={240} radius={0} />
          <View
            style={{
              position: 'absolute',
              left: 14,
              top: 14,
              right: 14,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: 8,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 6,
                backgroundColor: 'rgba(15,17,18,0.55)',
                paddingHorizontal: 10,
                paddingVertical: 6,
                borderRadius: 999,
              }}
            >
              {event.live && <Pulse color={T.glow} size={6} />}
              <Text style={{ color: T.paper, fontSize: 12, fontWeight: '600' }}>
                Starts in {fmtCountdown(event.startsIn)}
              </Text>
            </View>
            <Pressable
              onPress={(e) => {
                e.stopPropagation();
                onShare();
              }}
              style={{
                width: 34,
                height: 34,
                borderRadius: 17,
                backgroundColor: 'rgba(15,17,18,0.55)',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Feather name="send" size={14} color={T.paper} />
            </Pressable>
          </View>
          <View
            style={{
              position: 'absolute',
              left: 14,
              bottom: 14,
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
                flexDirection: 'row',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <Feather name="map-pin" size={11} color={T.paper} />
              <Text style={{ color: T.paper, fontSize: 11.5, fontWeight: '600' }}>
                {event.neighborhood} · {event.distance}
              </Text>
            </View>
          </View>
        </View>

        <View style={{ padding: 18 }}>
          <View
            style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 6 }}
          >
            <Text
              numberOfLines={1}
              style={{ color: T.mute, fontSize: 12.5, fontWeight: '500', flexShrink: 1 }}
            >
              {event.crew}
            </Text>
            {event.verified && <Feather name="check-circle" size={13} color={T.ink} />}
          </View>
          <Text
            style={{
              color: T.ink,
              fontSize: 26,
              fontWeight: '600',
              letterSpacing: -1,
              lineHeight: 28,
            }}
          >
            {event.title.toLowerCase()}
          </Text>
          <Text
            style={{ marginTop: 6, color: T.mute, fontSize: 13.5, fontWeight: '500', lineHeight: 19 }}
          >
            {event.when} · {event.venue}
          </Text>

          {banner && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
                paddingHorizontal: 12,
                paddingVertical: 10,
                marginTop: 12,
                borderRadius: 12,
                backgroundColor: banner.kind === 'hot' ? '#F4F8E0' : T.page,
                borderWidth: 1,
                borderColor: banner.kind === 'hot' ? '#E0EAB0' : T.hair,
              }}
            >
              <IgAvatarStack
                handles={event.going}
                max={4}
                size={26}
                border={banner.kind === 'hot' ? '#F4F8E0' : T.page}
              />
              <View style={{ flex: 1 }}>
                <Text
                  numberOfLines={1}
                  style={{ color: T.ink, fontSize: 12.5, fontWeight: '600', letterSpacing: -0.1 }}
                >
                  {banner.text}
                </Text>
                <Text style={{ color: T.mute, fontSize: 11.5, fontWeight: '500' }}>
                  via Instagram · {event.total} total going
                </Text>
              </View>
              <Feather name="instagram" size={14} color={T.mute} />
            </View>
          )}

          <View style={{ marginTop: 12 }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 6,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                <Feather name="instagram" size={11} color={T.mute} />
                <Text
                  style={{
                    color: T.mute,
                    fontSize: 11,
                    fontWeight: '600',
                    letterSpacing: 0.3,
                    textTransform: 'uppercase',
                  }}
                >
                  The vybe
                </Text>
              </View>
              <Text style={{ color: T.mute2, fontSize: 11, fontWeight: '500' }}>{event.repeats}</Text>
            </View>
            <VybeStrip cat={event.cat} height={56} gap={4} />
            <Text
              style={{
                marginTop: 8,
                color: T.ink2,
                fontSize: 13,
                fontStyle: 'italic',
                lineHeight: 19,
              }}
            >
              "{event.vybe}"
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 14,
              gap: 12,
            }}
          >
            <View
              style={{
                paddingHorizontal: event.price === 0 ? 10 : 0,
                paddingVertical: event.price === 0 ? 4 : 0,
                borderRadius: 999,
                backgroundColor: event.price === 0 ? T.freeBg : 'transparent',
              }}
            >
              <Text
                style={{
                  color: event.price === 0 ? T.free : T.ink,
                  fontSize: 13.5,
                  fontWeight: '600',
                }}
              >
                {event.price === 0 ? 'Free' : `$${event.price}`}
              </Text>
            </View>
            <Text style={{ color: T.mute, fontSize: 12, fontWeight: '500' }}>
              {event.total}/{event.cap} spots · {event.cap - event.total} open
            </Text>
          </View>

          <Pressable
            onPress={(e) => {
              e.stopPropagation();
              onRsvp();
            }}
            style={{
              marginTop: 12,
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
                <Feather name="check" size={16} color={T.glowInk} />
                <Text style={{ color: T.glowInk, fontSize: 15, fontWeight: '600', letterSpacing: -0.2 }}>
                  You're going · ride bundled
                </Text>
              </>
            ) : (
              <Text style={{ color: T.paper, fontSize: 15, fontWeight: '600', letterSpacing: -0.2 }}>
                {event.price ? `Get ticket · $${event.price}` : 'Hold to RSVP'}
              </Text>
            )}
          </Pressable>
        </View>
      </Pressable>
    </View>
  );
};
