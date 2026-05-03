import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RsvpProvider } from '../lib/rsvps';
import { T } from '../lib/theme';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <RsvpProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: T.page },
          }}
        >
          <Stack.Screen name="(tabs)" />
          <Stack.Screen
            name="event/[id]"
            options={{
              presentation: 'modal',
              animation: 'slide_from_bottom',
            }}
          />
          <Stack.Screen
            name="crew/[id]"
            options={{ animation: 'slide_from_right' }}
          />
        </Stack>
      </RsvpProvider>
    </SafeAreaProvider>
  );
}
