import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

export default function RootLayout() {
  return (
    <>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen
          name="services/[id]"
          options={{ title: 'Service Details', headerBackTitle: 'Services' }}
        />
        <Stack.Screen
          name="services/[id]/request"
          options={{ title: 'Request Service', headerBackTitle: 'Details' }}
        />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
