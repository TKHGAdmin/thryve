import { View } from 'react-native';
import { ACCENT } from '../lib/theme';

const INACTIVE = '#E5E7EB';

type Props = { step: 1 | 2 | 3 };

export const OnboardingProgress = ({ step }: Props) => (
  <View style={{ flexDirection: 'row', gap: 6, justifyContent: 'center' }}>
    {[1, 2, 3].map((s) => (
      <View
        key={s}
        style={{
          width: s === step ? 24 : 8,
          height: 8,
          borderRadius: 4,
          backgroundColor: s <= step ? ACCENT : INACTIVE,
        }}
      />
    ))}
  </View>
);
