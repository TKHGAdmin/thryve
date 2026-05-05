import { useEffect } from 'react';
import { View, Text } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RsvpProvider } from '../lib/rsvps';
import { T, ACCENT } from '../lib/theme';
import { AuthProvider, useAuth } from '../hooks/useAuth';

const Splash = () => (
  <View
    style={{
      flex: 1,
      backgroundColor: '#FFFFFF',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
      <Text style={{ color: '#111827', fontSize: 28, fontWeight: '700', letterSpacing: -1 }}>
        thryve
      </Text>
      <Text style={{ color: ACCENT, fontSize: 28, fontWeight: '700', letterSpacing: -1 }}>.</Text>
    </View>
  </View>
);

const PROTECTED_AUTH_ROUTES = new Set(['login', 'verify']);
const ONBOARDING_ROUTE = 'onboarding';

function RootNavigator() {
  const { loading, user, profile } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    const seg0 = segments[0];
    const inAuth = PROTECTED_AUTH_ROUTES.has(String(seg0));
    const inOnboarding = seg0 === ONBOARDING_ROUTE;
    const profileComplete = !!profile?.name && !!profile?.city;

    if (!user) {
      if (!inAuth) router.replace('/login');
      return;
    }
    if (!profileComplete) {
      if (!inOnboarding && !inAuth) router.replace('/onboarding/name');
      return;
    }
    if (inAuth || inOnboarding) {
      router.replace('/(tabs)');
    }
  }, [loading, user, profile, segments, router]);

  if (loading) return <Splash />;

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: T.page },
      }}
    >
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="login" options={{ animation: 'fade' }} />
      <Stack.Screen name="verify" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="onboarding/name" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="onboarding/interests" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="onboarding/city" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="create" options={{ animation: 'slide_from_bottom', presentation: 'modal' }} />
      <Stack.Screen
        name="event/[id]"
        options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
      />
      <Stack.Screen name="crew/[id]" options={{ animation: 'slide_from_right' }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <RsvpProvider>
          <StatusBar style="dark" />
          <RootNavigator />
        </RsvpProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
