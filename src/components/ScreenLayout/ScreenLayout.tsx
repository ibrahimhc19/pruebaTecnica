import { type ReactNode } from 'react';
import { View } from 'react-native';

interface ScreenLayoutProps {
  children: ReactNode;
}

export function ScreenLayout({ children }: ScreenLayoutProps) {
  return <View style={{ flex: 1 }}>{children}</View>;
}
