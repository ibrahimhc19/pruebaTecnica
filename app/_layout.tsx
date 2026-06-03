import { View } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { TopBar } from '@/components/TopBar/TopBar';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <View style={{ flex: 1 }}>
        <TopBar />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="services/[id]" />
          <Stack.Screen name="services/[id]/request" />
        </Stack>
        <StatusBar style="auto" />
      </View>
    </SafeAreaProvider>
  );
}
