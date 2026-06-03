import { ActivityIndicator, Text, View } from 'react-native';

interface LoadingStateProps {
  label?: string;
}

export function LoadingState({ label = 'Loading services...' }: LoadingStateProps) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 }}>
      <ActivityIndicator size="small" color="#0f766e" />
      <Text>{label}</Text>
    </View>
  );
}
