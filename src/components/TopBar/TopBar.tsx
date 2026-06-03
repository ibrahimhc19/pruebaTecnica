import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { router, usePathname } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

import { uiColors } from '@/theme/uiTokens';

function resolveTitle(pathname: string): string {
  if (pathname === '/') return 'Services';
  if (/^\/services\/[^/]+\/request$/.test(pathname)) return 'Request Service';
  return 'Service Details';
}

export function TopBar() {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const isRoot = pathname === '/';

  return (
    <View style={{ backgroundColor: uiColors.surface.base, paddingTop: insets.top }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
          minHeight: 52,
        }}
      >
        {!isRoot && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={() => router.back()}
            hitSlop={8}
            style={({ pressed }) => ({
              marginLeft: -8,
              marginRight: 4,
              padding: 10,
              borderRadius: 10,
              opacity: pressed ? 0.6 : 1,
            })}
          >
            <Feather name="chevron-left" size={24} color={uiColors.brand.primary} />
          </Pressable>
        )}

        <Text
          style={{
            flex: 1,
            fontSize: 18,
            fontWeight: '700',
            color: uiColors.text.primary,
          }}
          numberOfLines={1}
        >
          {resolveTitle(pathname)}
        </Text>
      </View>

      <View
        style={{
          height: Platform.OS === 'ios' ? StyleSheet.hairlineWidth : 1,
          backgroundColor: uiColors.border.default,
        }}
      />
    </View>
  );
}
