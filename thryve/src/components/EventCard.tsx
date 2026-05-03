import { View, Text, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { T, CAT } from '../lib/theme';
import { trybeBanner, type EventItem } from '../lib/data';
import { PhotoTile } from './PhotoTile';
import { IgAvatarStack } from './IgAvatar';

type Props = {
  event: EventItem;
  index: number;
  going: boolean;
  onOpen: () => void;
  onRsvp: () => void;
};

export const EventCard = ({ event, index, going, onOpen, onRsvp }: Props) => {
  const c = CAT[event.cat];
  const banner = trybeBanner(event.going);
  return (
    <Pressable
      onPress={onOpen}
      style={{
        backgroundColor: T.paper,
        borderWidth: 1,
        borderColor: T.hair,
        borderRadius: 18,
        overflow: 'hidden',
        flexDirection: 'row',
      }}
    >
      <View style={{ padding: 10 }}>
        <PhotoTile cat={event.cat} idx={index % 3} width={92} height={92} radius={12} />
      </View>
      <View
        style={{
          flex: 1,
          paddingTop: 12,
          paddingBottom: 12,
          paddingRight: 14,
          justifyContent: 'space-between',
        }}
      >
        <View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <View
              style={{
                backgroundColor: c.tint,
                paddingHorizontal: 7,
                paddingVertical: 2,
                borderRadius: 999,
              }}
            >
              <Text style={{ color: c.ink, fontSize: 10.5, fontWeight: '600' }}>{c.short}</Text>
            </View>
            <Text
              numberOfLines={1}
              style={{ color: T.mute, fontSize: 11.5, fontWeight: '500', flex: 1 }}
            >
              {event.crew}
            </Text>
            {event.verified && <Feather name="check-circle" size={11} color={T.ink} />}
          </View>
          <Text
            numberOfLines={1}
            style={{
              color: T.ink,
              fontSize: 16,
              fontWeight: '600',
              letterSpacing: -0.5,
              marginTop: 3,
            }}
          >
            {event.title.toLowerCase()}
          </Text>
          <Text numberOfLines={1} style={{ color: T.mute, fontSize: 12, fontWeight: '500', marginTop: 2 }}>
            {event.when} ·{' '}
            <Text style={{ color: T.ink2, fontWeight: '600' }}>{event.distance}</Text>
            {event.urgent ? (
              <Text style={{ color: T.hot }}> · {event.urgent}</Text>
            ) : null}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 8,
            marginTop: 8,
          }}
        >
          {banner ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 }}>
              <IgAvatarStack handles={event.going} max={3} size={20} border={T.paper} ring={false} />
              <Text
                numberOfLines={1}
                style={{ color: T.ink2, fontSize: 11, fontWeight: '600', flex: 1 }}
              >
                {banner.text}
              </Text>
            </View>
          ) : (
            <Text style={{ color: T.mute, fontSize: 11.5, fontWeight: '500' }}>
              {event.total} going
            </Text>
          )}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text
              style={{
                color: event.price === 0 ? T.free : T.ink,
                fontSize: 12,
                fontWeight: '600',
              }}
            >
              {event.price === 0 ? 'Free' : `$${event.price}`}
            </Text>
            <Pressable
              onPress={(e) => {
                e.stopPropagation();
                onRsvp();
              }}
              style={{
                width: 36,
                height: 36,
                borderRadius: 11,
                backgroundColor: going ? T.glow : T.ink,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Feather
                name={going ? 'check' : 'plus'}
                size={16}
                color={going ? T.glowInk : T.paper}
              />
            </Pressable>
          </View>
        </View>
      </View>
    </Pressable>
  );
};
