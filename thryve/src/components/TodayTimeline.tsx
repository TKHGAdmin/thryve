import { View, Text, Pressable, ScrollView } from 'react-native';
import { T, CAT, fmtCountdown } from '../lib/theme';
import { partitionGoing, type EventItem } from '../lib/data';
import { PhotoTile } from './PhotoTile';
import { IgAvatarStack } from './IgAvatar';

type Props = {
  events: EventItem[];
  onOpen: (id: string) => void;
};

export const TodayTimeline = ({ events, onOpen }: Props) => {
  if (events.length === 0) return null;
  const sorted = [...events].sort((a, b) => a.startsIn - b.startsIn);
  return (
    <View style={{ marginTop: 26 }}>
      <View
        style={{
          paddingHorizontal: 18,
          flexDirection: 'row',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          marginBottom: 12,
        }}
      >
        <View>
          <Text
            style={{
              color: T.mute,
              fontSize: 11,
              fontWeight: '600',
              letterSpacing: 0.3,
              textTransform: 'uppercase',
            }}
          >
            Live timeline
          </Text>
          <Text
            style={{
              marginTop: 2,
              color: T.ink,
              fontSize: 22,
              fontWeight: '600',
              letterSpacing: -0.7,
            }}
          >
            <Text style={{ fontStyle: 'italic', fontWeight: '400' }}>Today &</Text> tomorrow
          </Text>
        </View>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          gap: 10,
          paddingHorizontal: 18,
          paddingTop: 38,
          paddingBottom: 4,
        }}
      >
        {sorted.map((e) => {
          const c = CAT[e.cat];
          const part = partitionGoing(e.going);
          return (
            <Pressable key={e.id} onPress={() => onOpen(e.id)} style={{ width: 200 }}>
              <View style={{ alignItems: 'center', marginBottom: 8 }}>
                <Text style={{ color: T.mute, fontSize: 10, fontWeight: '600' }}>
                  {fmtCountdown(e.startsIn)}
                </Text>
                <View
                  style={{
                    marginTop: 2,
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: e.live ? T.hot : c.dot,
                    borderWidth: 2,
                    borderColor: T.page,
                  }}
                />
              </View>
              <View
                style={{
                  backgroundColor: T.paper,
                  borderWidth: 1,
                  borderColor: T.hair,
                  borderRadius: 16,
                  overflow: 'hidden',
                }}
              >
                <PhotoTile cat={e.cat} idx={1} width="100%" height={84} radius={0} />
                <View style={{ padding: 12 }}>
                  <Text
                    numberOfLines={2}
                    style={{
                      color: T.ink,
                      fontSize: 14,
                      fontWeight: '600',
                      letterSpacing: -0.3,
                      lineHeight: 17,
                      minHeight: 32,
                    }}
                  >
                    {e.title}
                  </Text>
                  <View
                    style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 }}
                  >
                    {part.youKnow.length > 0 ? (
                      <>
                        <IgAvatarStack
                          handles={e.going}
                          max={3}
                          size={18}
                          border={T.paper}
                          ring={false}
                        />
                        <Text style={{ color: T.mute, fontSize: 11, fontWeight: '500' }}>
                          {part.youKnow.length} you follow
                        </Text>
                      </>
                    ) : (
                      <Text style={{ color: T.mute, fontSize: 11, fontWeight: '500' }}>
                        {e.total} going
                      </Text>
                    )}
                  </View>
                </View>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
};
