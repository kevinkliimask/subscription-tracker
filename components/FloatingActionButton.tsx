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
      className="absolute bottom-4 right-4 h-16 w-16 items-center justify-center rounded-full bg-theme-blue shadow-lg"
      onPress={onPress}>
      {icon}
    </Pressable>
  );
}
