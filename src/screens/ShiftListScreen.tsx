import React from 'react';
import {StyleSheet} from 'react-native';
import {Screen, Text} from '../components/ui';

export const ShiftListScreen: React.FC = () => (
  <Screen>
    <Text variant="title" style={styles.title}>
      Доступные смены
    </Text>
    <Text color="textSecondary">
      Здесь будет отображаться список смен на основе геолокации пользователя.
    </Text>
  </Screen>
);

const styles = StyleSheet.create({
  title: {
    marginBottom: 12,
  },
});
