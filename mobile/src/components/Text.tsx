import { Text as RNText, TextProps as RNTextProps } from 'react-native';
import { color as C, font, FontVariant } from '@/theme/tokens';

interface TextProps extends RNTextProps {
  variant?: FontVariant;
  color?: string;
  center?: boolean;
}

export function Text({ variant = 'body', color = C.textPrimary, center, style, ...rest }: TextProps) {
  return (
    <RNText
      {...rest}
      style={[font[variant], { color }, center && { textAlign: 'center' }, style]}
      // Cap OS font scaling so hero layouts never break, but still respect accessibility somewhat.
      maxFontSizeMultiplier={1.4}
    />
  );
}
