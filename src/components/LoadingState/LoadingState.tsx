import { ActivityIndicator, Text, View } from 'react-native';

import { uiColors } from '@/utils/uiTokens';

interface LoadingStateProps {
  label?: string;
}

export function LoadingState({ label = 'Loading services...' }: LoadingStateProps) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 }}>
      <ActivityIndicator size="small" color={uiColors.brand.primary} />
      <Text>{label}</Text>
    </View>
  );
}
