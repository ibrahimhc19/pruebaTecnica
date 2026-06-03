import { type ReactNode } from 'react';
import { View } from 'react-native';

interface ScreenLayoutProps {
  children: ReactNode;
  title?: string;
  showBack?: boolean;
}

export function ScreenLayout({ children }: ScreenLayoutProps) {
  return <View style={{ flex: 1 }}>{children}</View>;
}
