import React from 'react';
import * as Icons from 'lucide-react';

interface DynamicIconProps extends Omit<React.ComponentProps<'svg'>, 'ref'> {
  name: string;
  size?: number | string;
  className?: string;
}

export const DynamicIcon: React.FC<DynamicIconProps> = ({
  name,
  size = 24,
  className = '',
  ...props
}) => {
  // Safe lookup with typing
  const IconComponent = (Icons as any)[name];

  if (!IconComponent) {
    // Return standard Sparkles fallback if not found
    const Fallback = Icons.Sparkles;
    return <Fallback size={size} className={className} {...(props as any)} />;
  }

  return <IconComponent size={size} className={className} {...props} />;
};

// Export active icon list for dynamic dropdowns in the Admin interface
export const AVAILABLE_ACCENT_ICONS = [
  'Award',
  'GraduationCap',
  'Heart',
  'BookOpen',
  'Sparkles',
  'Briefcase',
  'Search',
  'Globe',
  'Compass',
  'Star',
  'Smile',
  'Users',
  'Lightbulb',
  'Trophy'
];
