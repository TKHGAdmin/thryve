import { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ACCENT } from '../lib/theme';
import { supabase } from '../lib/supabase';

const DARK = '#111827';
const MUTE = '#6B7280';
const INPUT_BG = '#F3F4F6';
const ERROR = '#EF4444';

const RESEND_SECONDS = 30;

export default function Verify() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { email } = useLocalSearchParams<{ email: string }>();

  const [code, setCode] = useState<string[]>(['', '', '', '', '', '', '', '']);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendIn, setResendIn] = useState(RESEND_SECONDS);

  const inputs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    inputs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (resendIn <= 0) return;
    const id = setInterval(() => setResendIn((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [resendIn]);

  const focusFirst = () => {
    inputs.current[0]?.focus();
  };

  const verify = async (full: string) => {
    if (!email) return;
    setVerifying(true);
    setError(null);
    const { error: verifyError } = await supabase.auth.verifyOtp({
      email,
      token: full,
      type: 'email',
    });
    if (verifyError) {
      setVerifying(false);
      setError('Invalid code. Try again.');
      setCode(['', '', '', '', '', '', '', '']);
      focusFirst();
      return;
    }
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();
    if (!authUser) {
      setVerifying(false);
      setError('Could not verify session. Try again.');
      return;
    }
    const { data: profile } = await supabase
      .from('users')
      .select('id, name, city')
      .eq('id', authUser.id)
      .maybeSingle();
    setVerifying(false);
    if (profile && profile.name && profile.city) {
      router.replace('/(tabs)');
    } else {
      router.replace('/onboarding/name');
    }
  };

  const handleChange = (text: string, index: number) => {
    const digit = (text.match(/\d/g)?.[text.match(/\d/g)!.length - 1]) ?? '';
    const next = [...code];
    next[index] = digit;
    setCode(next);
    if (error) setError(null);
    if (digit && index < 7) {
      inputs.current[index + 1]?.focus();
    }
    if (next.every((d) => d !== '') && next.join('').length === 8) {
      verify(next.join(''));
    }
  };

  const handleKeyPress = (index: number, key: string) => {
    if (key === 'Backspace' && !code[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const onResend = async () => {
    if (resendIn > 0 || !email) return;
    setResendIn(RESEND_SECONDS);
    setError(null);
    await supabase.auth.signInWithOtp({ email });
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
        <Pressable onPress={() => router.back()} style={{ paddingVertical: 8, alignSelf: 'flex-start' }}>
          <Feather name="arrow-left" size={24} color={DARK} />
        </Pressable>

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
            Check your email
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
            We sent a code to {email ?? 'your email'}
          </Text>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              gap: 8,
              marginTop: 32,
            }}
          >
            {code.map((digit, i) => {
              const filled = digit !== '';
              return (
                <TextInput
                  key={i}
                  ref={(r) => {
                    inputs.current[i] = r;
                  }}
                  value={digit}
                  onChangeText={(t) => handleChange(t, i)}
                  onKeyPress={(e) => handleKeyPress(i, e.nativeEvent.key)}
                  keyboardType="number-pad"
                  textContentType="oneTimeCode"
                  autoComplete="sms-otp"
                  maxLength={1}
                  selectTextOnFocus
                  style={{
                    width: 40,
                    height: 56,
                    borderRadius: 12,
                    backgroundColor: INPUT_BG,
                    borderWidth: 2,
                    borderColor: filled ? ACCENT : 'transparent',
                    fontSize: 24,
                    fontWeight: '700',
                    color: DARK,
                    textAlign: 'center',
                  }}
                />
              );
            })}
          </View>

          {verifying && (
            <View style={{ marginTop: 16, alignItems: 'center' }}>
              <ActivityIndicator color={DARK} />
            </View>
          )}

          {error && (
            <Text style={{ marginTop: 16, color: ERROR, fontSize: 14, textAlign: 'center' }}>
              {error}
            </Text>
          )}

          <View style={{ marginTop: 24, alignItems: 'center' }}>
            <Pressable onPress={onResend} disabled={resendIn > 0}>
              <Text
                style={{
                  color: resendIn > 0 ? MUTE : ACCENT,
                  fontSize: 14,
                  fontWeight: '600',
                }}
              >
                {resendIn > 0 ? `Resend in ${resendIn}s` : "Didn't get it? Resend"}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
