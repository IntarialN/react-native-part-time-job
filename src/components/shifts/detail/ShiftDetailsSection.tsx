import React from 'react';
import {StyleSheet, View} from 'react-native';
import {theme} from '../../../theme';
import {Text} from '../../ui';

type ShiftDetailsSectionProps = {
  title: string;
  children: React.ReactNode;
};

export const ShiftDetailsSection: React.FC<ShiftDetailsSectionProps> = ({
  title,
  children,
}) => (
  <View style={styles.container}>
    <Text variant="subtitle" weight="bold" style={styles.title}>
      {title}
    </Text>
    <View>{children}</View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.xl,
  },
  title: {
    marginBottom: theme.spacing.sm,
  },
});
