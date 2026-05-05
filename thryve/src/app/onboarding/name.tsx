// Note: requires a Supabase Storage bucket called "avatars" (public read).
// Create it in the dashboard: Storage → Create bucket → name "avatars" → Public.
import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Image,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { ACCENT } from '../../lib/theme';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { OnboardingProgress } from '../../components/OnboardingProgress';

const DARK = '#111827';
const MUTE = '#6B7280';
const PLACEHOLDER = '#9CA3AF';
const INPUT_BG = '#F3F4F6';
const DISABLED_BG = '#E5E7EB';

const uploadAvatar = async (uri: string, userId: string): Promise<string | null> => {
  try {
    const ext = uri.split('.').pop()?.toLowerCase() || 'jpg';
    const path = `${userId}/avatar-${Date.now()}.${ext}`;
    const res = await fetch(uri);
    const blob = await res.blob();
    const { error } = await supabase.storage
      .from('avatars')
      .upload(path, blob, { contentType: blob.type || `image/${ext}`, upsert: true });
    if (error) return null;
    const { data } = supabase.storage.from('avatars').getPublicUrl(path);
    return data.publicUrl;
  } catch {
    return null;
  }
};

export default function OnboardingName() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, refetchProfile } = useAuth();

  const [name, setName] = useState('');
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [picking, setPicking] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const trimmed = name.trim();
  const valid = trimmed.length >= 2;

  const onPickAvatar = async () => {
    if (picking) return;
    setPicking(true);
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      setPicking(false);
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (result.canceled || !result.assets[0]) {
      setPicking(false);
      return;
    }
    const uri = result.assets[0].uri;
    setAvatarUri(uri);
    if (user) {
      const url = await uploadAvatar(uri, user.id);
      setAvatarUrl(url);
    }
    setPicking(false);
  };

  const onContinue = async () => {
    if (!valid || !user || submitting) return;
    setSubmitting(true);
    const { error } = await supabase.from('users').upsert(
      {
        id: user.id,
        phone: user.email ?? `email:${user.id}`,
        name: trimmed,
        avatar_url: avatarUrl,
      } as any,
      { onConflict: 'id' },
    );
    if (error) {
      setSubmitting(false);
      return;
    }
    await refetchProfile();
    setSubmitting(false);
    router.push('/onboarding/interests');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#FFFFFF' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View
        style={{
          flex: 1,
          paddingHorizontal: 20,
          paddingTop: insets.top + 16,
          paddingBottom: insets.bottom + 24,
        }}
      >
        <OnboardingProgress step={1} />

        <Text
          style={{
            marginTop: 32,
            color: DARK,
            fontSize: 28,
            fontWeight: '700',
            letterSpacing: -0.5,
          }}
        >
          What's your name?
        </Text>
        <Text style={{ marginTop: 8, color: MUTE, fontSize: 15, lineHeight: 21 }}>
          This is how you'll appear on thryve.
        </Text>

        <View style={{ alignItems: 'center', marginTop: 32 }}>
          <Pressable
            onPress={onPickAvatar}
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              backgroundColor: INPUT_BG,
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} style={{ width: 100, height: 100 }} />
            ) : picking ? (
              <ActivityIndicator color={DARK} />
            ) : (
              <Feather name="camera" size={32} color={PLACEHOLDER} />
            )}
          </Pressable>
        </View>

        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="First name"
          placeholderTextColor={PLACEHOLDER}
          autoCapitalize="words"
          autoCorrect={false}
          autoFocus
          returnKeyType="done"
          onSubmitEditing={onContinue}
          style={{
            marginTop: 24,
            height: 56,
            borderRadius: 16,
            backgroundColor: INPUT_BG,
            paddingHorizontal: 20,
            fontSize: 17,
            color: DARK,
          }}
        />

        <View style={{ flex: 1 }} />

        <Pressable
          onPress={onContinue}
          disabled={!valid || submitting}
          style={{
            height: 56,
            borderRadius: 16,
            backgroundColor: valid ? ACCENT : DISABLED_BG,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {submitting ? (
            <ActivityIndicator color={DARK} />
          ) : (
            <Text style={{ color: DARK, fontSize: 16, fontWeight: '700' }}>Continue</Text>
          )}
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
