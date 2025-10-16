import React from 'react';
import {Screen, Text} from '../components/ui';

export const ShiftDetailsScreen: React.FC = () => (
  <Screen>
    <Text variant="title">Детали смены</Text>
    <Text color="textSecondary">
      Экран деталей будет использовать данные выбранной смены из MobX стора.
    </Text>
  </Screen>
);
