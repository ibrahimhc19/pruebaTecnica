import { type ReactNode } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';

import { uiColors } from '@/theme/uiTokens';

interface ScreenLayoutProps {
  children: ReactNode;
  title: string;
  /** Whether to show the back button (default: true) */
  showBack?: boolean;
}

/**
 * Reusable screen layout that handles safe area insets and provides a
 * consistent header with a large-touch-target back button.
 */
export function ScreenLayout({ children, title, showBack = true }: ScreenLayoutProps) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: uiColors.surface.base }} edges={['top']}>
      {/* ── Header ─────────────────────────────────────────── */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 8,
          minHeight: 52,
        }}
      >
        {showBack ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={() => router.back()}
            hitSlop={8}
            style={({ pressed }) => [
              {
                padding: 10,
                borderRadius: 10,
                opacity: pressed ? 0.6 : 1,
              },
            ]}
          >
            <Feather name="chevron-left" size={24} color={uiColors.brand.primary} />
          </Pressable>
        ) : (
          <View style={{ width: 44 }} />
        )}

        <Text
          style={{
            flex: 1,
            fontSize: 18,
            fontWeight: '700',
            color: uiColors.text.primary,
            marginRight: showBack ? 44 : 0, // balance the back button width
          }}
          numberOfLines={1}
        >
          {title}
        </Text>
      </View>

      {/* ── Separator ──────────────────────────────────────── */}
      <View
        style={{
          height: Platform.OS === 'ios' ? StyleSheet.hairlineWidth : 1,
          backgroundColor: uiColors.border.default,
        }}
      />

      {/* ── Content ────────────────────────────────────────── */}
      {children}
    </SafeAreaView>
  );
}
