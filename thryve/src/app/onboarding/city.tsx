import { useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import { ACCENT } from '../../lib/theme';
import { supabase } from '../../lib/supabase';
import { registerForPushNotifications } from '../../lib/notifications';
import { useAuth } from '../../hooks/useAuth';
import { OnboardingProgress } from '../../components/OnboardingProgress';

const DARK = '#111827';
const MUTE = '#6B7280';
const PLACEHOLDER = '#9CA3AF';
const INPUT_BG = '#F3F4F6';
const DISABLED_BG = '#E5E7EB';
const HAIR = '#E5E7EB';

const CITIES = [
  'Charleston, SC',
  'Charlotte, NC',
  'Raleigh, NC',
  'Asheville, NC',
  'Atlanta, GA',
  'Savannah, GA',
  'Nashville, TN',
  'Knoxville, TN',
  'Memphis, TN',
  'Austin, TX',
  'Houston, TX',
  'Dallas, TX',
  'Miami, FL',
  'Tampa, FL',
  'Orlando, FL',
  'Jacksonville, FL',
  'New Orleans, LA',
  'Birmingham, AL',
  'Richmond, VA',
  'Washington, DC',
  'Brooklyn, NY',
  'New York, NY',
  'Boston, MA',
  'Philadelphia, PA',
  'Pittsburgh, PA',
  'Chicago, IL',
  'Denver, CO',
  'Boulder, CO',
  'Salt Lake City, UT',
  'Phoenix, AZ',
  'Los Angeles, CA',
  'San Diego, CA',
  'San Francisco, CA',
  'Portland, OR',
  'Seattle, WA',
];

export default function OnboardingCity() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, refetchProfile } = useAuth();

  const [search, setSearch] = useState('');
  const [city, setCity] = useState<string | null>(null);
  const [locating, setLocating] = useState(false);
  const [usedLocation, setUsedLocation] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const matches = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return [] as string[];
    return CITIES.filter((c) => c.toLowerCase().includes(q)).slice(0, 6);
  }, [search]);

  const onUseLocation = async () => {
    if (locating) return;
    setLocating(true);
    const perm = await Location.requestForegroundPermissionsAsync();
    if (!perm.granted) {
      setLocating(false);
      return;
    }
    try {
      const pos = await Location.getCurrentPositionAsync({});
      const [addr] = await Location.reverseGeocodeAsync({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      });
      const cityName = addr?.city ?? addr?.subregion ?? null;
      const region = addr?.region ?? null;
      const formatted = cityName && region ? `${cityName}, ${region}` : cityName;
      if (formatted) {
        setCity(formatted);
        setUsedLocation(true);
        setSearch('');
      }
    } catch {
      // swallow — user can still search manually
    }
    setLocating(false);
  };

  const onSelectCity = (c: string) => {
    setCity(c);
    setUsedLocation(false);
    setSearch(c);
  };

  const onLetsGo = async () => {
    if (!city || !user || submitting) return;
    setSubmitting(true);
    const { error } = await supabase
      .from('users')
      .update({ city } as any)
      .eq('id', user.id);
    if (error) {
      setSubmitting(false);
      return;
    }
    // Fire-and-forget push registration. Don't block routing if user denies.
    registerForPushNotifications().catch(() => {});
    await refetchProfile();
    setSubmitting(false);
    router.replace('/(tabs)');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#FFFFFF' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: insets.top + 16,
          paddingBottom: insets.bottom + 24,
          flexGrow: 1,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <OnboardingProgress step={3} />

        <Text
          style={{
            marginTop: 32,
            color: DARK,
            fontSize: 28,
            fontWeight: '700',
            letterSpacing: -0.5,
          }}
        >
          Where are you?
        </Text>
        <Text style={{ marginTop: 8, color: MUTE, fontSize: 15, lineHeight: 21 }}>
          We'll show you events nearby.
        </Text>

        <Pressable
          onPress={onUseLocation}
          disabled={locating}
          style={{
            marginTop: 28,
            height: 56,
            borderRadius: 16,
            backgroundColor: INPUT_BG,
            paddingHorizontal: 16,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <Feather name="navigation" size={18} color={DARK} />
          <Text style={{ flex: 1, color: DARK, fontSize: 16, fontWeight: '600' }}>
            {usedLocation && city ? city : 'Use my location'}
          </Text>
          {locating && <ActivityIndicator color={DARK} />}
          {usedLocation && city && !locating && <Feather name="check" size={18} color={ACCENT} />}
        </Pressable>

        <View
          style={{
            marginTop: 20,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ color: PLACEHOLDER, fontSize: 13 }}>— or —</Text>
        </View>

        <TextInput
          value={search}
          onChangeText={(t) => {
            setSearch(t);
            if (city && t !== city) {
              setCity(null);
              setUsedLocation(false);
            }
          }}
          placeholder="Search for a city"
          placeholderTextColor={PLACEHOLDER}
          autoCapitalize="words"
          autoCorrect={false}
          style={{
            marginTop: 20,
            height: 56,
            borderRadius: 16,
            backgroundColor: INPUT_BG,
            paddingHorizontal: 20,
            fontSize: 17,
            color: DARK,
          }}
        />

        {matches.length > 0 && search.trim() !== city && (
          <View
            style={{
              marginTop: 8,
              backgroundColor: '#FFFFFF',
              borderRadius: 16,
              borderWidth: 1,
              borderColor: HAIR,
              overflow: 'hidden',
            }}
          >
            {matches.map((c, i) => (
              <Pressable
                key={c}
                onPress={() => onSelectCity(c)}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                  borderTopWidth: i === 0 ? 0 : 1,
                  borderTopColor: HAIR,
                }}
              >
                <Text style={{ color: DARK, fontSize: 15 }}>{c}</Text>
              </Pressable>
            ))}
          </View>
        )}

        <View style={{ flex: 1 }} />

        <Pressable
          onPress={onLetsGo}
          disabled={!city || submitting}
          style={{
            marginTop: 32,
            height: 56,
            borderRadius: 16,
            backgroundColor: city ? ACCENT : DISABLED_BG,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {submitting ? (
            <ActivityIndicator color={DARK} />
          ) : (
            <Text style={{ color: DARK, fontSize: 16, fontWeight: '700' }}>Let's go</Text>
          )}
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
