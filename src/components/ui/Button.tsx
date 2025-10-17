import React from 'react';
import {
  GestureResponderEvent,
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import {theme} from '../../theme';
import {Text} from './Text';

export type ButtonVariant = 'primary' | 'secondary';

type ButtonProps = {
  label: string;
  onPress: (event: GestureResponderEvent) => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

const variantStyles: Record<ButtonVariant, ViewStyle> = {
  primary: {
    backgroundColor: theme.colors.primary,
  },
  secondary: {
    backgroundColor: theme.colors.secondary,
  },
};

export const Button: React.FC<ButtonProps> = ({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  style,
  textStyle,
}) => (
  <TouchableOpacity
    accessibilityRole="button"
    activeOpacity={0.86}
    disabled={disabled}
    onPress={onPress}
    style={[
      styles.base,
      variantStyles[variant],
      disabled ? styles.disabled : null,
      style,
    ]}>
    <Text
      weight="medium"
      color="surface"
      style={[styles.label, textStyle]}
      numberOfLines={1}>
      {label}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  base: {
    borderRadius: theme.radius.md,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.6,
  },
  label: {
    fontSize: theme.typography.body,
  },
});
