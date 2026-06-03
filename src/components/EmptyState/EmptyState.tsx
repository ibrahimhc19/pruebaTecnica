import { Text, View } from 'react-native';

interface EmptyStateProps {
  title?: string;
  description?: string;
}

export function EmptyState({
  title = 'No services found',
  description = 'Try changing your selected category filter.',
}: EmptyStateProps) {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 40, gap: 6 }}>
      <Text style={{ fontSize: 16, fontWeight: '600' }}>{title}</Text>
      <Text style={{ color: '#4b5563', textAlign: 'center', paddingHorizontal: 24 }}>{description}</Text>
    </View>
  );
}
