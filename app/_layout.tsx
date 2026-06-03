import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

/**
 * Root layout with custom headers managed by <ScreenLayout />
 * for consistent safe-area handling across all screens.
 */
export default function RootLayout() {
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="services/[id]" />
        <Stack.Screen name="services/[id]/request" />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
