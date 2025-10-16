import React, {useEffect} from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {observer} from 'mobx-react-lite';
import {Screen, Text} from '../components/ui';
import {useShiftStore} from '../stores';
import {theme} from '../theme';

export const ShiftListScreen: React.FC = observer(() => {
  const store = useShiftStore();

  useEffect(() => {
    if (store.status === 'idle') {
      store.loadShifts();
    }

    return () => {
      store.cancelOngoingRequest();
    };
  }, [store]);

  return (
    <Screen>
      <Text variant="title" style={styles.title}>
        Доступные смены
      </Text>
      {store.status === 'loading' && (
        <View style={styles.centerContainer}>
          <ActivityIndicator color={theme.colors.primary} size="large" />
          <Text color="textSecondary" style={styles.helperText}>
            Определяем ваше местоположение и ищем смены поблизости…
          </Text>
        </View>
      )}
      {store.status === 'error' && (
        <View style={styles.centerContainer}>
          <Text weight="bold" color="danger" style={styles.helperText}>
            {store.error ?? 'Не удалось получить список смен.'}
          </Text>
        </View>
      )}
      {store.status === 'success' && !store.hasShifts && (
        <View style={styles.centerContainer}>
          <Text color="textSecondary" style={styles.helperText}>
            Пока нет доступных смен рядом. Попробуйте обновить позже.
          </Text>
        </View>
      )}
    </Screen>
  );
});

const styles = StyleSheet.create({
  title: {
    marginBottom: theme.spacing.lg,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  helperText: {
    marginTop: theme.spacing.md,
    textAlign: 'center',
  },
});
