import { View, Text } from 'react-native';
import { T } from '../../lib/theme';
import { useRsvps } from '../../lib/rsvps';
import { Screen } from '../../components/Screen';

export default function Profile() {
  const { count } = useRsvps();
  const stats = [
    { label: 'Going', value: count },
    { label: 'Attended', value: 12 },
    { label: 'Streak', value: 8 },
  ];
  return (
    <Screen pretitle="@caseymorris" title="Casey M." sub="Charleston, SC · IG connected">
      <View style={{ marginTop: 22, flexDirection: 'row', gap: 8 }}>
        {stats.map((s) => (
          <View
            key={s.label}
            style={{
              flex: 1,
              backgroundColor: T.paper,
              borderWidth: 1,
              borderColor: T.hair,
              padding: 14,
              borderRadius: 14,
            }}
          >
            <Text
              style={{
                color: T.ink,
                fontSize: 28,
                fontWeight: '600',
                letterSpacing: -1,
              }}
            >
              {s.value}
            </Text>
            <Text style={{ color: T.mute, fontSize: 11.5, fontWeight: '500', marginTop: 6 }}>
              {s.label}
            </Text>
          </View>
        ))}
      </View>
    </Screen>
  );
}
