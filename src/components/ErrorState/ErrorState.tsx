import { Pressable, Text, View } from 'react-native';

import { uiColors } from '@/theme/uiTokens';

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10, padding: 16 }}>
      <Text style={{ color: uiColors.text.danger, textAlign: 'center' }}>{message}</Text>
      <Pressable
        accessibilityRole="button"
        onPress={onRetry}
        style={{
          backgroundColor: uiColors.brand.primary,
          borderRadius: 10,
          paddingHorizontal: 14,
          paddingVertical: 10,
        }}
      >
        <Text style={{ color: uiColors.text.inverse, fontWeight: '600' }}>Retry</Text>
      </Pressable>
    </View>
  );
}
