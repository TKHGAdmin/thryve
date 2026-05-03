import { View, Text, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { T } from '../lib/theme';
import { Screen } from '../components/Screen';

const STEPS = ['What is it?', 'When & where?', 'Free or paid?', 'Post it'];

export default function Create() {
  const router = useRouter();
  return (
    <Screen pretitle="Host" title="Drop an event." sub="Live in 60 seconds">
      <View style={{ marginTop: 22, gap: 8 }}>
        {STEPS.map((label, i) => (
          <View
            key={label}
            style={{
              backgroundColor: T.paper,
              borderWidth: 1,
              borderColor: T.hair,
              paddingHorizontal: 18,
              paddingVertical: 16,
              borderRadius: 14,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 14,
            }}
          >
            <View
              style={{
                width: 28,
                height: 28,
                borderRadius: 14,
                backgroundColor: i === 0 ? T.ink : T.page,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text
                style={{
                  color: i === 0 ? T.paper : T.mute,
                  fontSize: 12,
                  fontWeight: '600',
                }}
              >
                {i + 1}
              </Text>
            </View>
            <Text
              style={{
                flex: 1,
                color: T.ink,
                fontSize: 16,
                fontWeight: '600',
                letterSpacing: -0.3,
              }}
            >
              {label}
            </Text>
            <Feather name="chevron-right" size={14} color={T.mute} />
          </View>
        ))}
      </View>
      <Pressable
        onPress={() => router.back()}
        style={{
          marginTop: 22,
          height: 52,
          borderRadius: 14,
          backgroundColor: T.ink,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{ color: T.paper, fontSize: 15, fontWeight: '600', letterSpacing: -0.2 }}>
          Begin
        </Text>
      </Pressable>
    </Screen>
  );
}
