import { Pressable, Text, View } from 'react-native';

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10, padding: 16 }}>
      <Text style={{ color: '#b91c1c', textAlign: 'center' }}>{message}</Text>
      <Pressable
        accessibilityRole="button"
        onPress={onRetry}
        style={{ backgroundColor: '#0f766e', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10 }}
      >
        <Text style={{ color: '#f0fdfa', fontWeight: '600' }}>Retry</Text>
      </Pressable>
    </View>
  );
}
