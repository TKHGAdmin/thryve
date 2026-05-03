import { View, Text, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { T } from '../lib/theme';
import type { ReactNode } from 'react';

type Props = {
  pretitle?: string;
  title: string;
  sub?: string;
  children?: ReactNode;
};

export const Screen = ({ pretitle, title, sub, children }: Props) => {
  const insets = useSafeAreaInsets();
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: T.page }}
      contentContainerStyle={{
        paddingTop: insets.top + 8,
        paddingHorizontal: 18,
        paddingBottom: 130,
      }}
      showsVerticalScrollIndicator={false}
    >
      {pretitle && (
        <Text style={{ color: T.mute, fontSize: 12.5, fontWeight: '500' }}>{pretitle}</Text>
      )}
      <Text
        style={{
          marginTop: 4,
          color: T.ink,
          fontSize: 36,
          fontWeight: '600',
          letterSpacing: -1.3,
          lineHeight: 38,
        }}
      >
        {title}
      </Text>
      {sub && (
        <Text style={{ color: T.mute, fontSize: 13, fontWeight: '500', marginTop: 4 }}>
          {sub}
        </Text>
      )}
      {children}
    </ScrollView>
  );
};
