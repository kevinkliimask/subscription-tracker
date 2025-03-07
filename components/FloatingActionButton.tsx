import { LinearGradient } from 'expo-linear-gradient';
import { Plus } from 'lucide-react-native';
import { Pressable } from 'react-native';

interface FloatingActionButtonProps {
  onPress?: () => void;
  icon?: React.ReactNode;
}

export default function FloatingActionButton({
  onPress,
  icon = <Plus size={24} color="white" />,
}: FloatingActionButtonProps) {
  return (
    <Pressable
      className="absolute bottom-4 right-4 h-16 w-16 items-center justify-center overflow-hidden rounded-full shadow-lg active:opacity-80 disabled:opacity-50"
      onPress={onPress}>
      <LinearGradient
        colors={['#0000FF', '#090979']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{ width: 64, height: 64, alignItems: 'center', justifyContent: 'center' }}>
        {icon}
      </LinearGradient>
    </Pressable>
  );
}
