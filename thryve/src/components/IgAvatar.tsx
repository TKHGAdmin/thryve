import { View, Text } from 'react-native';
import { T } from '../lib/theme';
import { PEOPLE, partitionGoing } from '../lib/data';

type Props = {
  handle: string;
  size?: number;
  ring?: boolean;
  border?: string;
};

const hsl = (hue: number, lightness: number, sat: number) =>
  `hsl(${hue}, ${sat}%, ${lightness}%)`;

export const IgAvatar = ({ handle, size = 28, ring = true, border = T.paper }: Props) => {
  const p = PEOPLE[handle];
  if (!p) {
    return (
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: T.hair,
          borderWidth: 2,
          borderColor: border,
        }}
      />
    );
  }
  const ringColor =
    p.rel === 'mutual' ? T.glow :
    p.rel === 'follow' ? T.ink :
    T.hair2;
  const innerSize = size - (ring ? 4 : 0);
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: ring ? ringColor : 'transparent',
        padding: ring ? 2 : 0,
        borderWidth: 2,
        borderColor: border,
      }}
    >
      <View
        style={{
          width: innerSize,
          height: innerSize,
          borderRadius: innerSize / 2,
          backgroundColor: hsl(p.hue, 60, 40),
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text
          style={{
            color: '#fff',
            fontWeight: '600',
            fontSize: Math.max(10, innerSize * 0.4),
          }}
        >
          {p.name[0]}
        </Text>
      </View>
    </View>
  );
};

type StackProps = {
  handles: string[];
  max?: number;
  size?: number;
  border?: string;
  ring?: boolean;
};

export const IgAvatarStack = ({
  handles,
  max = 4,
  size = 28,
  border = T.paper,
  ring = true,
}: StackProps) => {
  const part = partitionGoing(handles);
  const ordered = [...part.mutual, ...part.follow, ...part.follower, ...part.stranger];
  const shown = ordered.slice(0, max);
  const overflow = handles.length - shown.length;
  const overlap = -size * 0.32;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      {shown.map((h, i) => (
        <View key={h} style={{ marginLeft: i === 0 ? 0 : overlap }}>
          <IgAvatar handle={h} size={size} ring={ring} border={border} />
        </View>
      ))}
      {overflow > 0 && (
        <View
          style={{
            marginLeft: overlap,
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: T.ink,
            borderWidth: 2,
            borderColor: border,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text
            style={{
              color: T.paper,
              fontSize: Math.max(9, size * 0.32),
              fontWeight: '600',
            }}
          >
            +{overflow}
          </Text>
        </View>
      )}
    </View>
  );
};
