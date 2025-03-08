import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Text } from 'react-native';

type SubscriptionLogoProps = {
  name: string;
  logoUrl?: string | null;
  size?: number;
};

const SubscriptionLogo = ({ name, logoUrl, size = 48 }: SubscriptionLogoProps) => {
  if (logoUrl) {
    return (
      <Image
        source={{ uri: logoUrl }}
        style={{ width: size, height: size, borderRadius: 8 }}
        cachePolicy="memory-disk"
        contentFit="cover"
      />
    );
  }

  return (
    <LinearGradient
      colors={['#4F46E5', '#7C3AED']}
      style={{
        width: size,
        height: size,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Text
        style={{
          fontSize: size * 0.4,
        }}
        className="font-bold text-white">
        {name.charAt(0)}
      </Text>
    </LinearGradient>
  );
};

export default SubscriptionLogo;
