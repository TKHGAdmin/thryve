import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ACCENT } from '../lib/theme';
import { supabase } from '../lib/supabase';

const DARK = '#111827';
const MUTE = '#6B7280';
const PLACEHOLDER = '#9CA3AF';
const INPUT_BG = '#F3F4F6';
const DISABLED_BG = '#E5E7EB';
const ERROR = '#EF4444';

const isValidEmail = (e: string) => /^\S+@\S+\.\S+$/.test(e.trim());

export default function Login() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const trimmed = email.trim();
  const valid = isValidEmail(trimmed);

  const onContinue = async () => {
    if (!valid || submitting) return;
    setError(null);
    setSubmitting(true);
    const { error } = await supabase.auth.signInWithOtp({ email: trimmed });
    setSubmitting(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.push({ pathname: '/verify', params: { email: trimmed } });
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
          paddingTop: insets.top + 32,
          paddingBottom: insets.bottom + 24,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'center' }}>
          <Text style={{ color: DARK, fontSize: 19, fontWeight: '600', letterSpacing: -0.7 }}>
            thryve
          </Text>
          <Text style={{ color: ACCENT, fontSize: 19, fontWeight: '600', letterSpacing: -0.7 }}>
            .
          </Text>
        </View>

        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Text
            style={{
              color: DARK,
              fontSize: 28,
              fontWeight: '700',
              textAlign: 'center',
              letterSpacing: -0.5,
            }}
          >
            Welcome to thryve.
          </Text>
          <Text
            style={{
              marginTop: 8,
              color: MUTE,
              fontSize: 15,
              textAlign: 'center',
              lineHeight: 21,
            }}
          >
            Enter your email to get started
          </Text>

          <TextInput
            value={email}
            onChangeText={(t) => {
              setEmail(t);
              if (error) setError(null);
            }}
            onSubmitEditing={onContinue}
            placeholder="you@email.com"
            placeholderTextColor={PLACEHOLDER}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            autoComplete="email"
            autoFocus
            returnKeyType="go"
            style={{
              marginTop: 28,
              height: 56,
              borderRadius: 16,
              backgroundColor: INPUT_BG,
              paddingHorizontal: 20,
              fontSize: 17,
              color: DARK,
            }}
          />

          {error && (
            <Text style={{ marginTop: 10, color: ERROR, fontSize: 13 }}>
              {error}
            </Text>
          )}

          <Pressable
            onPress={onContinue}
            disabled={!valid || submitting}
            style={{
              marginTop: 12,
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

        <Text
          style={{
            color: PLACEHOLDER,
            fontSize: 12,
            textAlign: 'center',
            lineHeight: 18,
          }}
        >
          By continuing, you agree to our Terms & Privacy Policy
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}
