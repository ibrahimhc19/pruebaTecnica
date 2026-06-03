import { View } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { TopBar } from '@/components/TopBar/TopBar';

export default function RootLayout() {
  return (
    <View style={{ flex: 1 }}>
      <TopBar />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="services/[id]" />
        <Stack.Screen name="services/[id]/request" />
      </Stack>
      <StatusBar style="auto" />
    </View>
  );
}
