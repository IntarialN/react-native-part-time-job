import React from 'react';
import {StyleSheet, View, ViewProps} from 'react-native';
import {theme} from '../../theme';

type CardProps = ViewProps & {
  elevated?: boolean;
};

export const Card: React.FC<CardProps> = ({
  style,
  elevated = false,
  children,
  ...rest
}) => (
  <View
    {...rest}
    style={[
      styles.container,
      elevated ? styles.elevated : styles.flat,
      style,
    ]}>
    {children}
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: theme.spacing.lg,
  },
  flat: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
  },
  elevated: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
});
