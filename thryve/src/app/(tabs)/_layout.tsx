import { Tabs, useRouter } from 'expo-router';
import { View, Pressable, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { T } from '../../lib/theme';

type IconName = 'compass' | 'calendar' | 'users' | 'user';

const TABS: { name: string; icon: IconName; label: string }[] = [
  { name: 'index', icon: 'compass', label: 'Discover' },
  { name: 'calendar', icon: 'calendar', label: 'Calendar' },
  { name: 'crews', icon: 'users', label: 'Crews' },
  { name: 'profile', icon: 'user', label: 'You' },
];

function CustomTabBar({ state, navigation }: any) {
  const router = useRouter();
  const left = TABS.slice(0, 2);
  const right = TABS.slice(2);

  const renderTab = (tab: (typeof TABS)[number]) => {
    const route = state.routes.find((r: any) => r.name === tab.name);
    if (!route) return null;
    const isFocused = state.routes[state.index].name === tab.name;
    return (
      <Pressable
        key={tab.name}
        onPress={() => navigation.navigate(tab.name)}
        style={{
          flex: 1,
          paddingVertical: 8,
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
        }}
      >
        <Feather
          name={tab.icon}
          size={19}
          color={isFocused ? T.paper : 'rgba(250,249,244,0.5)'}
        />
        <Text
          style={{
            color: isFocused ? T.paper : 'rgba(250,249,244,0.45)',
            fontSize: 10,
            fontWeight: '600',
          }}
        >
          {tab.label}
        </Text>
      </Pressable>
    );
  };

  return (
    <View
      style={{
        position: 'absolute',
        left: 14,
        right: 14,
        bottom: 18,
        backgroundColor: T.ink,
        borderRadius: 22,
        borderWidth: 1,
        borderColor: T.ink2,
        paddingHorizontal: 8,
        paddingVertical: 6,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: T.ink,
        shadowOpacity: 0.18,
        shadowRadius: 36,
        shadowOffset: { width: 0, height: 12 },
        elevation: 8,
      }}
    >
      {left.map(renderTab)}
      <Pressable
        onPress={() => router.push('/create')}
        style={{
          width: 50,
          height: 50,
          borderRadius: 14,
          backgroundColor: T.glow,
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: -22,
          shadowColor: T.glow,
          shadowOpacity: 0.5,
          shadowRadius: 18,
          shadowOffset: { width: 0, height: 8 },
          elevation: 6,
        }}
      >
        <Feather name="plus" size={22} color={T.glowInk} />
      </Pressable>
      {right.map(renderTab)}
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
