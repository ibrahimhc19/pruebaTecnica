import { uiColors } from '@/theme/uiTokens';
import type { ServiceCategory } from '@/types/service';

export interface CategoryColors {
  text: string;
  bg: string;
}

export const CATEGORY_COLORS: Record<
  Exclude<ServiceCategory, 'all'>,
  CategoryColors
> = {
  cleaning: { text: uiColors.brand.primary, bg: uiColors.surface.featured },
  plumbing: { text: uiColors.text.success, bg: uiColors.surface.success },
  electrical: { text: uiColors.text.danger, bg: uiColors.surface.danger },
  painting: {
    text: uiColors.brand.chipActiveText,
    bg: uiColors.surface.chipActive,
  },
  appliance: { text: uiColors.text.secondary, bg: uiColors.surface.subtle },
  outdoor: { text: uiColors.text.muted, bg: uiColors.surface.base },
};
