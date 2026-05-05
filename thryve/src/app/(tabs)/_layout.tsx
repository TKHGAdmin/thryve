import { Tabs, useRouter } from 'expo-router';
import { View, Pressable, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { T, ACCENT } from '../../lib/theme';

type IconName = 'compass' | 'calendar' | 'users' | 'user';

const TABS: { name: string; icon: IconName; label: string }[] = [
  { name: 'index', icon: 'compass', label: 'Discover' },
  { name: 'calendar', icon: 'calendar', label: 'Calendar' },
  { name: 'crews', icon: 'users', label: 'Crews' },
  { name: 'profile', icon: 'user', label: 'You' },
];

const INACTIVE = '#9CA3AF';
const DARK = '#111827';

function CustomTabBar({ state, navigation }: any) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const left = TABS.slice(0, 2);
  const right = TABS.slice(2);

  const renderTab = (tab: (typeof TABS)[number]) => {
    const route = state.routes.find((r: any) => r.name === tab.name);
    if (!route) return null;
    const isFocused = state.routes[state.index].name === tab.name;
    const color = isFocused ? ACCENT : INACTIVE;
    return (
      <Pressable
        key={tab.name}
        onPress={() => navigation.navigate(tab.name)}
        style={{
          flex: 1,
          paddingVertical: 8,
          alignItems: 'center',
          justifyContent: 'center',
          gap: 4,
        }}
      >
        <Feather name={tab.icon} size={24} color={color} />
        <Text style={{ color, fontSize: 10, fontWeight: '600' }}>{tab.label}</Text>
      </Pressable>
    );
  };

  return (
    <View
      style={{
        position: 'absolute',
        left: 16,
        right: 16,
        bottom: 16 + insets.bottom * 0.4,
        height: 64,
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 20,
        shadowOffset: { width: 0, height: -2 },
        elevation: 12,
      }}
    >
      <View
        style={{
          flex: 1,
          borderRadius: 24,
          overflow: 'hidden',
        }}
      >
        <BlurView
          intensity={40}
          tint="light"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        />
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(240, 240, 240, 0.55)',
            borderWidth: 0.5,
            borderColor: 'rgba(255, 255, 255, 0.3)',
            borderRadius: 24,
          }}
        />
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 8,
          }}
        >
          {left.map(renderTab)}
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Pressable
              onPress={() => router.push('/create')}
              style={{
                width: 52,
                height: 52,
                borderRadius: 16,
                backgroundColor: ACCENT,
                alignItems: 'center',
                justifyContent: 'center',
                transform: [{ translateY: -8 }],
                shadowColor: ACCENT,
                shadowOpacity: 0.4,
                shadowRadius: 16,
                shadowOffset: { width: 0, height: 4 },
                elevation: 8,
              }}
            >
              <Feather name="plus" size={26} color={DARK} />
            </Pressable>
          </View>
          {right.map(renderTab)}
        </View>
      </View>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: T.page } }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="calendar" />
      <Tabs.Screen name="crews" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
