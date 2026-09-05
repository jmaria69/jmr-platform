'use client';

import { useWindowWidth } from '@/lib/use-window-width';
import { PraxiaLabLogo } from '@/components/praxia-lab-logo';

export function ResponsivePraxiaLabLogo({ lg = 28, md = 24, sm = 20 }: { lg?: number; md?: number; sm?: number }) {
  const width = useWindowWidth();
  let size = lg;
  if (width < 640) size = sm;
  else if (width < 768) size = md;
  return <PraxiaLabLogo size={size} />;
}