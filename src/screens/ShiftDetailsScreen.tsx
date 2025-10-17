import React, {useEffect, useMemo} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RouteProp} from '@react-navigation/core';
import {observer} from 'mobx-react-lite';
import {Button, Screen, Text} from '../components/ui';
import {
  ShiftDetailsContent,
  ShiftDetailsHeader,
} from '../components/shifts';
import {useShiftStore} from '../stores';
import type {RootStackParamList} from '../navigation/AppNavigator';
import {theme} from '../theme';
import type {Shift} from '../types';

export const ShiftDetailsScreen: React.FC = observer(() => {
  const store = useShiftStore();
  const navigation = useNavigation<
    NativeStackNavigationProp<RootStackParamList>
  >();
  const route = useRoute<RouteProp<RootStackParamList, 'ShiftDetails'>>();

  const routeShiftId = route.params?.shiftId ?? null;

  useEffect(() => {
    if (routeShiftId && routeShiftId !== store.selectedShiftId) {
      store.selectShift(routeShiftId);
    }
  }, [routeShiftId, store]);

  const shift: Shift | undefined = useMemo(() => {
    if (routeShiftId) {
      return store.shifts.find(item => item.id === routeShiftId);
    }

    return store.selectedShift;
  }, [routeShiftId, store.selectedShift, store.shifts]);

  if (!shift) {
    return (
      <Screen contentStyle={styles.screenContent}>
        <View style={styles.emptyState}>
          <Text variant="subtitle" weight="bold" style={styles.emptyTitle}>
            Смена не найдена
          </Text>
          <Text color="textSecondary" style={styles.emptyMessage}>
            Возможно, список обновился. Попробуйте вернуться и выбрать другую
            смену.
          </Text>
          <Button
            label="Вернуться к списку"
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          />
        </View>
      </Screen>
    );
  }

  return (
    <Screen contentStyle={styles.screenContent}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <ShiftDetailsHeader shift={shift} />
        <ShiftDetailsContent shift={shift} />
      </ScrollView>
    </Screen>
  );
});

const styles = StyleSheet.create({
  screenContent: {
    paddingTop: theme.spacing.md,
  },
  scrollContent: {
    paddingBottom: theme.spacing.xxl,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.xxl,
  },
  emptyTitle: {
    marginBottom: theme.spacing.sm,
  },
  emptyMessage: {
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  backButton: {
    paddingHorizontal: theme.spacing.xxl,
  },
});
