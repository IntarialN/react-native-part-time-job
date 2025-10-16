import React from 'react';
import {
  Text as RNText,
  TextProps as RNTextProps,
  StyleSheet,
  TextStyle,
  StyleProp,
} from 'react-native';
import {theme} from '../../theme';

type TextVariant = 'title' | 'subtitle' | 'body' | 'caption';

type TextProps = RNTextProps & {
  variant?: TextVariant;
  weight?: 'regular' | 'medium' | 'bold';
  color?: keyof typeof theme.colors;
  style?: StyleProp<TextStyle>;
};

const fontWeightMap: Record<NonNullable<TextProps['weight']>, TextStyle> = {
  regular: {fontWeight: '400'},
  medium: {fontWeight: '500'},
  bold: {fontWeight: '600'},
};

export const Text: React.FC<TextProps> = ({
  variant = 'body',
  weight = 'regular',
  color = 'textPrimary',
  style,
  children,
  ...rest
}) => (
  <RNText
    {...rest}
    style={[
      styles[variant],
      fontWeightMap[weight],
      {color: theme.colors[color]},
      style,
    ]}>
    {children}
  </RNText>
);

const styles = StyleSheet.create({
  title: {
    fontSize: theme.typography.title,
  },
  subtitle: {
    fontSize: theme.typography.subtitle,
  },
  body: {
    fontSize: theme.typography.body,
  },
  caption: {
    fontSize: theme.typography.caption,
  },
});
