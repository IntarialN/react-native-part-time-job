import React from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import type {AsyncState} from '../../../types';
import {theme} from '../../../theme';
import {Text, Button} from '../../ui';

type ShiftListEmptyStateProps = {
  status: AsyncState;
  error: string | null;
  onRetry: () => void;
};

export const ShiftListEmptyState: React.FC<ShiftListEmptyStateProps> = ({
  status,
  error,
  onRetry,
}) => {
  if (status === 'loading') {
    return (
      <View style={styles.container}>
        <ActivityIndicator color={theme.colors.primary} size="large" />
        <Text color="textSecondary" style={styles.message}>
          Определяем ваше местоположение и ищем смены поблизости…
        </Text>
      </View>
    );
  }

  if (status === 'error') {
    return (
      <View style={styles.container}>
        <Text weight="bold" color="danger" style={styles.message}>
          {error ?? 'Не удалось получить список смен.'}
        </Text>
        <Button
          label="Попробовать снова"
          onPress={onRetry}
          style={styles.retryButton}
        />
      </View>
    );
  }

  if (status === 'success') {
    return (
      <View style={styles.container}>
        <Text color="textSecondary" style={styles.message}>
          Пока нет доступных смен рядом. Попробуйте обновить позже.
        </Text>
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
  },
  message: {
    marginTop: theme.spacing.md,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: theme.spacing.lg,
    alignSelf: 'center',
    paddingHorizontal: theme.spacing.xxl,
  },
});
